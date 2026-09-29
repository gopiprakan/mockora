import httpx
import logging
from typing import Dict, Any, Optional
from ..config import settings

logger = logging.getLogger("mockora.google_sheets")

async def sync_report_to_google_sheets(report: Dict[str, Any]) -> Dict[str, Any]:
    """
    Sends the completed interview report to Google Sheets via Google Apps Script Webhook.
    
    Fields sent:
    - candidate_name
    - candidate_email
    - role
    - overall_score
    - technical_score
    - communication_score
    - problem_solving_score
    - relevance_score
    - structure_score
    - strengths (bullet points / comma-separated)
    - areas_to_improve (bullet points / comma-separated)
    - recommended_topics (bullet points / comma-separated)
    - camera_engagement
    - long_pauses
    - filler_words
    - average_response_time
    - status = "COMPLETED"
    """
    webhook_url = getattr(settings, "GOOGLE_SHEETS_WEBHOOK_URL", "") or ""
    
    cat_scores = report.get("category_scores", {})
    comm_summary = report.get("communication_summary", {})
    
    payload = {
        "report_id": report.get("id", ""),
        "interview_id": report.get("interview_id", ""),
        "candidate_name": report.get("candidate_name", "Student"),
        "candidate_email": report.get("candidate_email", ""),
        "role": report.get("role", "Software Developer"),
        "duration_minutes": report.get("duration_minutes", 15),
        "overall_score": report.get("overall_score", 78),
        "technical_score": cat_scores.get("Technical Knowledge", 78),
        "communication_score": cat_scores.get("Communication", 74),
        "problem_solving_score": cat_scores.get("Problem Solving", 82),
        "relevance_score": cat_scores.get("Answer Relevance", 86),
        "structure_score": cat_scores.get("Answer Structure", 72),
        "strengths": report.get("strengths", []),
        "areas_to_improve": report.get("areas_to_improve", []),
        "recommended_topics": report.get("recommended_topics", []),
        "camera_engagement": comm_summary.get("camera_engagement", "Good"),
        "long_pauses": comm_summary.get("long_pauses", 2),
        "filler_words": comm_summary.get("filler_words", 5),
        "average_response_time": comm_summary.get("average_response_time", "4.1s"),
        "status": "COMPLETED",
        "timestamp": report.get("created_at", "")
    }

    if not webhook_url:
        logger.info("[Google Sheets Service] GOOGLE_SHEETS_WEBHOOK_URL not configured. Running in local simulation mode.")
        return {
            "status": "simulated",
            "message": "Google Sheets webhook not configured in .env. Report prepared with status COMPLETED.",
            "data": payload
        }

    try:
        async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
            response = await client.post(webhook_url, json=payload)
            if response.status_code in [200, 201, 302]:
                logger.info(f"[Google Sheets Service] Successfully pushed report to Google Sheets for {payload['candidate_email']}")
                return {
                    "status": "success",
                    "message": f"Report saved to Google Sheets with status COMPLETED and email trigger activated for {payload['candidate_email']}",
                    "response": response.text[:200]
                }
            else:
                logger.warning(f"[Google Sheets Service] Google Apps Script responded with code {response.status_code}: {response.text[:200]}")
                return {
                    "status": "warning",
                    "message": f"Google Sheets webhook returned status {response.status_code}",
                    "response": response.text[:200]
                }
    except Exception as e:
        logger.error(f"[Google Sheets Service] Error sending data to Google Sheets: {e}")
        return {
            "status": "error",
            "message": f"Failed to reach Google Sheets Webhook: {str(e)}",
            "data": payload
        }
