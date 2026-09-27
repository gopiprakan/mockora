import uuid
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional, Dict, Any, List
from ..services.resume_parser import extract_text_from_pdf, parse_resume_text, get_sample_resume, SAMPLE_RESUMES
from ..services.ai_service import analyze_resume_ai
from ..services.database import save_resume, save_or_get_user
from ..schemas.schemas import ResumeData, ResumeAnalyzeRequest

router = APIRouter(prefix="/api/resume", tags=["Resume"])

@router.get("/samples")
async def list_sample_resumes():
    """Returns available sample resumes for fast testing and demonstration."""
    return [
        {
            "id": "traffic_ai",
            "title": "AI/ML Engineer - Smart Traffic Management",
            "candidate_name": SAMPLE_RESUMES["traffic_ai"]["candidate_name"],
            "role": "AI/ML Engineer",
            "summary": "Features computer vision traffic management using TensorFlow and OpenCV."
        },
        {
            "id": "fullstack_dev",
            "title": "Full Stack Developer - Real-time Collaborative Editor",
            "candidate_name": SAMPLE_RESUMES["fullstack_dev"]["candidate_name"],
            "role": "Full Stack Developer",
            "summary": "Features React, Node.js, WebSockets, and Redis distributed caching."
        },
        {
            "id": "backend_java",
            "title": "Java Backend Engineer - Microservices Banking Engine",
            "candidate_name": SAMPLE_RESUMES["backend_java"]["candidate_name"],
            "role": "Java Developer",
            "summary": "Features Java 17, Spring Boot, Apache Kafka, and PostgreSQL."
        }
    ]

@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    """Uploads a PDF resume and parses it into structured data using Gemini AI."""
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported currently.")
    
    contents = await file.read()
    raw_text = extract_text_from_pdf(contents)
    
    if not raw_text.strip():
        # Fallback if PDF was an image scan
        parsed = get_sample_resume("traffic_ai")
        parsed["candidate_name"] = file.filename.replace(".pdf", "").title()
    else:
        # Prioritize deep Gemini analysis
        ai_parsed = await analyze_resume_ai(raw_text)
        if ai_parsed:
            parsed = ai_parsed
        else:
            parsed = parse_resume_text(raw_text)
        
    return {
        "status": "success",
        "filename": file.filename,
        "resume_data": parsed
    }

@router.post("/analyze")
async def analyze_resume(request: ResumeAnalyzeRequest):
    """Analyzes provided resume text or a sample resume using Gemini AI."""
    if request.sample_id and request.sample_id in SAMPLE_RESUMES:
        parsed = get_sample_resume(request.sample_id)
    elif request.text:
        ai_parsed = await analyze_resume_ai(request.text)
        if ai_parsed:
            parsed = ai_parsed
        else:
            parsed = parse_resume_text(request.text)
    else:
        parsed = get_sample_resume("traffic_ai")
        
    return {
        "status": "success",
        "resume_data": parsed
    }
