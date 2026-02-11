from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from services.excel_service import excel_service
import shutil
import os

router = APIRouter(prefix="/excel", tags=["excel"])

@router.post("/upload")
async def upload_excel(
    file: UploadFile = File(...),
    branch: str = Form(...),
    department: str = Form(...)
):
    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload an Excel file.")

    temp_path = f"uploads/excel/{branch}/{file.filename}"
    os.makedirs(os.path.dirname(temp_path), exist_ok=True)

    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = await excel_service.parse_excel(temp_path, branch)
    
    # In a real app, we would save 'result' to MySQL/MongoDB here
    
    return result
