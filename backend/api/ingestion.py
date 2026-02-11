from __future__ import annotations

import hashlib
import time
from typing import Literal, Optional

import httpx
from fastapi import APIRouter, Body, Depends, File, Form, HTTPException, UploadFile, status
from pydantic import BaseModel, HttpUrl
from sqlalchemy import text
from sqlalchemy.orm import Session

from database.mysql import get_db
from services.gridfs_storage import gridfs_storage
from tasks.excel_tasks import process_excel

router = APIRouter(prefix="/ingestion", tags=["ingestion"])

Branch = Literal["patiobella", "eateroo"]
FileType = Literal["procurement", "inventory", "sales", "finance", "petty_cash"]

MAX_BYTES = 50 * 1024 * 1024
ALLOWED_EXT = (".xlsx", ".xls")
ALLOWED_CONTENT_TYPES = {
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
}


class UploadResponse(BaseModel):
    file_id: str
    excel_upload_id: int
    status: str
    sha256: str


class ImportLinkRequest(BaseModel):
    url: HttpUrl
    branch: Branch
    file_type: FileType


class UploadRow(BaseModel):
    id: int
    original_filename: str
    branch: Branch
    file_type: FileType
    upload_date: str
    file_size: Optional[int] = None
    ai_audit_score: Optional[float] = None
    processing_status: Optional[str] = None
    mongo_gridfs_id: str
    ai_audit_id: Optional[str] = None


@router.post("/upload", response_model=UploadResponse)
async def upload_excel(
    file: UploadFile = File(...),
    branch: Branch = Form(...),
    file_type: FileType = Form(...),
    db: Session = Depends(get_db),
):
    if not file.filename or not file.filename.lower().endswith(ALLOWED_EXT):
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload .xlsx or .xls")

    if file.content_type and file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=400, detail="Invalid content type")

    started = time.time()
    content = await file.read()

    if len(content) > MAX_BYTES:
        raise HTTPException(status_code=413, detail="File too large (max 50MB)")

    sha256 = hashlib.sha256(content).hexdigest()

    metadata = {
        "branch": branch,
        "file_type": file_type,
        "uploaded_by": "ceo@hugamara.com",
        "file_hash": f"sha256:{sha256}",
        "processing_status": "pending",
    }

    try:
        file_id = await gridfs_storage.save_file(
            file_content=content,
            filename=file.filename,
            content_type=file.content_type or "application/octet-stream",
            metadata=metadata,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to store file: {str(e)}")

    try:
        db.execute(
            text(
                """
                INSERT INTO excel_uploads (
                    original_filename, branch, file_type, mongo_gridfs_id, file_hash, file_size,
                    processing_status
                ) VALUES (
                    :original_filename, :branch, :file_type, :mongo_gridfs_id, :file_hash, :file_size,
                    :processing_status
                )
                """
            ),
            {
                "original_filename": file.filename,
                "branch": branch,
                "file_type": file_type,
                "mongo_gridfs_id": str(file_id),
                "file_hash": sha256,
                "file_size": len(content),
                "processing_status": "pending",
            },
        )
        db.commit()
        excel_upload_id = db.execute(text("SELECT LAST_INSERT_ID() as id")).mappings().first()["id"]
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to write metadata: {str(e)}")

    try:
        process_excel.delay(int(excel_upload_id), str(file_id), branch, file_type)
    except Exception:
        # If Celery/Redis not running, keep record as pending.
        pass

    return UploadResponse(
        file_id=str(file_id),
        excel_upload_id=int(excel_upload_id),
        status="queued",
        sha256=sha256,
    )


@router.post("/import-link", response_model=UploadResponse)
async def import_from_link(
    request: ImportLinkRequest,
    db: Session = Depends(get_db),
):
    try:
        async with httpx.AsyncClient(follow_redirects=True, timeout=60) as client:
            resp = await client.get(str(request.url))
            resp.raise_for_status()
            content = resp.content
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to import link: {str(e)}")

    filename = str(request.url).split("/")[-1] or "import.xlsx"
    sha256 = hashlib.sha256(content).hexdigest()

    metadata = {
        "branch": request.branch,
        "file_type": request.file_type,
        "uploaded_by": "ceo@hugamara.com",
        "file_hash": f"sha256:{sha256}",
        "processing_status": "pending",
    }

    file_id = await gridfs_storage.save_file(
        file_content=content,
        filename=filename,
        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        metadata=metadata,
    )

    db.execute(
        text(
            """
            INSERT INTO excel_uploads (
                original_filename, branch, file_type, mongo_gridfs_id, file_hash, file_size,
                processing_status
            ) VALUES (
                :original_filename, :branch, :file_type, :mongo_gridfs_id, :file_hash, :file_size,
                :processing_status
            )
            """
        ),
        {
            "original_filename": filename,
            "branch": request.branch,
            "file_type": request.file_type,
            "mongo_gridfs_id": str(file_id),
            "file_hash": sha256,
            "file_size": len(content),
            "processing_status": "pending",
        },
    )
    db.commit()
    excel_upload_id = db.execute(text("SELECT LAST_INSERT_ID() as id")).mappings().first()["id"]

    try:
        process_excel.delay(int(excel_upload_id), str(file_id), request.branch, request.file_type)
    except Exception:
        pass

    return UploadResponse(file_id=str(file_id), excel_upload_id=int(excel_upload_id), status="queued", sha256=sha256)


@router.get("/uploads", response_model=list[UploadRow])
async def list_uploads(
    limit: int = 50,
    branch: Optional[Branch] = None,
    file_type: Optional[FileType] = None,
    db: Session = Depends(get_db),
):
    q = "SELECT id, original_filename, branch, file_type, upload_date, file_size, ai_audit_score, processing_status, mongo_gridfs_id, ai_audit_id FROM excel_uploads"
    where = []
    params: dict[str, object] = {}
    if branch:
        where.append("branch = :branch")
        params["branch"] = branch
    if file_type:
        where.append("file_type = :file_type")
        params["file_type"] = file_type
    if where:
        q += " WHERE " + " AND ".join(where)
    q += " ORDER BY upload_date DESC LIMIT :limit"
    params["limit"] = int(limit)

    rows = db.execute(text(q), params).mappings().all()
    return [UploadRow(**{**r, "upload_date": str(r["upload_date"])}) for r in rows]


@router.get("/upload/{excel_upload_id}", response_model=UploadRow)
async def get_upload(excel_upload_id: int, db: Session = Depends(get_db)):
    row = db.execute(
        text(
            "SELECT id, original_filename, branch, file_type, upload_date, file_size, ai_audit_score, processing_status, mongo_gridfs_id, ai_audit_id FROM excel_uploads WHERE id=:id"
        ),
        {"id": excel_upload_id},
    ).mappings().first()
    if not row:
        raise HTTPException(status_code=404, detail="Upload not found")
    return UploadRow(**{**row, "upload_date": str(row["upload_date"])})


@router.get("/audit/{excel_upload_id}")
async def get_audit(excel_upload_id: int, db: Session = Depends(get_db)):
    row = db.execute(
        text("SELECT ai_audit_id, mongo_gridfs_id, ai_audit_score, processing_status FROM excel_uploads WHERE id=:id"),
        {"id": excel_upload_id},
    ).mappings().first()
    if not row:
        raise HTTPException(status_code=404, detail="Upload not found")
    if not row["ai_audit_id"]:
        raise HTTPException(status_code=409, detail="Audit not ready")

    from database.mongodb import get_mongo_db

    mongo_db = get_mongo_db()
    doc = await mongo_db["excel_extractions"].find_one({"_id": __import__("bson").ObjectId(row["ai_audit_id"])})
    if not doc:
        raise HTTPException(status_code=404, detail="Audit not found")

    doc["_id"] = str(doc["_id"])
    doc["gridfs_file_id"] = str(doc.get("gridfs_file_id"))
    return {"upload": {"excel_upload_id": excel_upload_id, **row}, "audit": doc}


@router.get("/file/{file_id}")
async def download_file(file_id: str):
    return await gridfs_storage.stream_file_response(file_id=file_id)


@router.get("/file/{file_id}/preview")
async def file_preview(file_id: str, rows: int = 10):
    return await gridfs_storage.get_file_preview(file_id=file_id, rows=rows)
