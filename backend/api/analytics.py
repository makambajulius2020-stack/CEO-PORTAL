from fastapi import APIRouter, Depends
from services.ai_service import ai_service
from services.anomalies import anomaly_detector
from pydantic import BaseModel
from typing import List, Dict

router = APIRouter(prefix="/ai", tags=["ai"])

class QueryRequest(BaseModel):
    query: str
    context: Dict = {}

@router.get("/alerts")
async def get_alerts():
    # In a real app, this would query the database for recent data
    mock_data = [{"item_name": "Seafood", "unit_cost": 150.0, "quantity": 5, "vendor": "Premium Fish"}]
    mock_history = []
    
    alerts = await anomaly_detector.run_full_audit(mock_data, mock_history)
    return alerts

@router.post("/query")
async def ask_ai(request: QueryRequest):
    response = await ai_service.process_query(request.query, request.context)
    return {"response": response}

@router.get("/summary")
async def get_summary():
    # Mock summary data
    summary_data = {"revenue": 124850, "growth": 12.5, "red_flags": 3}
    summary = await ai_service.generate_insight(summary_data)
    return {"summary": summary}
