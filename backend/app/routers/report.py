from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from ..schemas.schemas import EmailReportRequest
from ..services.database import get_report_by_id, get_all_reports
from ..services.email_service import send_interview_report_email

router = APIRouter(prefix="/api", tags=["Report"])

@router.get("/interview/report/{report_id}")
async def fetch_interview_report(report_id: str):
    """Fetches full interview report by report ID or interview ID."""
    report = get_report_by_id(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Interview report not found.")
    return {
        "status": "success",
        "report": report
    }

@router.get("/interview/reports")
async def list_interview_reports():
    """Lists past interview reports for candidate dashboard."""
    reports = get_all_reports()
    return {
        "status": "success",
        "reports": reports
    }

@router.post("/report/email")
async def email_report(payload: EmailReportRequest):
    """Sends the interview report to student's email."""
    report = get_report_by_id(payload.report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found to send email.")
        
    result = send_interview_report_email(report, payload.email)
    return result
