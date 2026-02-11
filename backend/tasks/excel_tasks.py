from __future__ import annotations

import asyncio
import time
from typing import Any

from bson import ObjectId
from sqlalchemy import text

from celery_app import celery_app
from database.mongodb import get_mongo_db, get_gridfs_bucket
from database.mysql import SessionLocal
from services.excel_processor import excel_processor_service


async def _download_gridfs_bytes(file_id: str) -> bytes:
    bucket = get_gridfs_bucket()
    stream = await bucket.open_download_stream(ObjectId(file_id))
    return await stream.read()


async def _insert_extraction_doc(doc: dict[str, Any]) -> str:
    mongo_db = get_mongo_db()
    inserted = await mongo_db["excel_extractions"].insert_one(doc)
    return str(inserted.inserted_id)


@celery_app.task(bind=True, max_retries=3)
def process_excel(self, excel_upload_id: int, gridfs_id: str, branch: str, file_type: str):
    started = time.time()
    db = SessionLocal()
    try:
        db.execute(
            text("UPDATE excel_uploads SET processing_status='processing' WHERE id=:id"),
            {"id": excel_upload_id},
        )
        db.commit()

        content = asyncio.run(_download_gridfs_bytes(gridfs_id))
        result = excel_processor_service.process_bytes(content, branch=branch, file_type=file_type)

        mongo_db = get_mongo_db()
        doc = {
            "excel_upload_id": excel_upload_id,
            "gridfs_file_id": ObjectId(gridfs_id),
            "overall_confidence": result.audit.get("overall_score"),
            "field_confidence": result.audit.get("field_confidence"),
            "column_mappings": result.audit.get("column_mappings"),
            "extracted_data": result.extracted_data,
            "anomalies": result.audit.get("anomalies"),
            "warnings": result.audit.get("warnings"),
            "created_at": time.time(),
        }
        audit_id = asyncio.run(_insert_extraction_doc(doc))

        db.execute(
            text(
                """
                INSERT INTO extraction_audit_log (excel_upload_id, audit_score, column_mappings, anomalies_detected, warnings)
                VALUES (:excel_upload_id, :audit_score, :column_mappings, :anomalies_detected, :warnings)
                """
            ),
            {
                "excel_upload_id": excel_upload_id,
                "audit_score": float(result.audit.get("overall_score") or 0),
                "column_mappings": __import__("json").dumps(result.audit.get("column_mappings") or []),
                "anomalies_detected": __import__("json").dumps(result.audit.get("anomalies") or []),
                "warnings": __import__("json").dumps(result.audit.get("warnings") or []),
            },
        )

        processing_time = int(time.time() - started)
        status = "completed" if float(result.audit.get("overall_score") or 0) >= 6.5 else "review_needed"

        db.execute(
            text(
                """
                UPDATE excel_uploads
                SET ai_audit_score=:score, ai_audit_id=:audit_id, processing_status=:status, processing_time=:processing_time
                WHERE id=:id
                """
            ),
            {
                "score": float(result.audit.get("overall_score") or 0),
                "audit_id": audit_id,
                "status": status,
                "processing_time": processing_time,
                "id": excel_upload_id,
            },
        )
        db.commit()

        return {"excel_upload_id": excel_upload_id, "audit_id": audit_id, "score": result.audit.get("overall_score")}
    except Exception as e:
        db.rollback()
        db.execute(
            text("UPDATE excel_uploads SET processing_status='failed' WHERE id=:id"),
            {"id": excel_upload_id},
        )
        db.commit()
        raise self.retry(exc=e, countdown=5)
    finally:
        db.close()
