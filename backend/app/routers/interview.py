import uuid
from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from ..schemas.schemas import (
    InterviewStartRequest,
    QuestionRequest,
    QuestionResponse,
    AnswerSubmitRequest,
    AnswerEvaluationResponse,
    FinishInterviewRequest
)
from ..services.database import (
    save_or_get_user,
    save_resume,
    create_interview_session,
    save_question,
    save_answer,
    save_evaluation,
    save_final_report,
    get_report_by_id
)
from ..services.ai_service import (
    generate_adaptive_question,
    evaluate_answer,
    generate_final_report
)
from ..services.google_sheets_service import sync_report_to_google_sheets

router = APIRouter(prefix="/api/interview", tags=["Interview"])

# In-memory session tracking for low-latency active interviews
sessions_cache: Dict[str, Dict[str, Any]] = {}

@router.post("/start")
async def start_interview(payload: InterviewStartRequest):
    """Starts a new mock interview session and returns Question 1."""
    user_id = save_or_get_user(payload.candidate_email, payload.candidate_name)
    resume_id = None
    if payload.resume_data:
        resume_id = save_resume(user_id, payload.resume_data.dict())
        
    interview_id = create_interview_session(
        user_id=user_id,
        role=payload.role,
        interview_type=payload.interview_type,
        difficulty=payload.difficulty,
        duration=payload.duration_minutes,
        resume_id=resume_id
    )
    
    session_data = {
        "id": interview_id,
        "user_id": user_id,
        "candidate_name": payload.candidate_name,
        "candidate_email": payload.candidate_email,
        "role": payload.role,
        "interview_type": payload.interview_type,
        "difficulty": payload.difficulty,
        "duration_minutes": payload.duration_minutes,
        "resume_data": payload.resume_data.dict() if payload.resume_data else {},
        "qa_history": [],
        "evaluations": [],
        "communication_records": []
    }
    sessions_cache[interview_id] = session_data
    
    # Generate adaptive first question based on resume
    q1_data = await generate_adaptive_question(
        interview_session=session_data,
        question_number=1,
        previous_qa=[]
    )
    
    q1_id = save_question(
        interview_id=interview_id,
        question_text=q1_data["question_text"],
        question_number=1,
        category=q1_data["category"],
        context_note=q1_data["context_note"]
    )
    
    first_question = {
        "id": q1_id,
        "interview_id": interview_id,
        "question_number": 1,
        "question_text": q1_data["question_text"],
        "category": q1_data["category"],
        "context_note": q1_data["context_note"]
    }
    
    return {
        "status": "success",
        "interview_id": interview_id,
        "session": {
            "id": interview_id,
            "candidate_name": payload.candidate_name,
            "role": payload.role,
            "interview_type": payload.interview_type,
            "difficulty": payload.difficulty,
            "duration_minutes": payload.duration_minutes
        },
        "question": first_question
    }


@router.post("/question")
async def get_next_question(payload: QuestionRequest):
    """Generates the next adaptive question based on candidate's answers so far."""
    interview_id = payload.interview_id
    session = sessions_cache.get(interview_id)
    if not session:
        raise HTTPException(status_code=404, detail="Interview session not found or expired.")
        
    next_num = len(session["qa_history"]) + 1
    q_data = await generate_adaptive_question(
        interview_session=session,
        question_number=next_num,
        previous_qa=session["qa_history"]
    )
    
    q_id = save_question(
        interview_id=interview_id,
        question_text=q_data["question_text"],
        question_number=next_num,
        category=q_data["category"],
        context_note=q_data["context_note"]
    )
    
    return {
        "id": q_id,
        "interview_id": interview_id,
        "question_number": next_num,
        "question_text": q_data["question_text"],
        "category": q_data["category"],
        "context_note": q_data["context_note"]
    }


@router.post("/answer")
async def submit_answer(payload: AnswerSubmitRequest):
    """Submits candidate's answer, saves transcription, and generates evaluation."""
    interview_id = payload.interview_id
    session = sessions_cache.get(interview_id)
    if not session:
        # Create minimal fallback session
        session = {
            "id": interview_id,
            "candidate_name": "Candidate",
            "candidate_email": "student@example.edu",
            "role": "Software Developer",
            "interview_type": "Technical",
            "duration_minutes": 15,
            "qa_history": [],
            "evaluations": [],
            "communication_records": []
        }
        sessions_cache[interview_id] = session

    # 1. Save answer in DB
    ans_id = save_answer(
        interview_id=interview_id,
        question_id=payload.question_id,
        answer_text=payload.answer_text,
        response_time=payload.response_time_seconds,
        communication_obs=payload.communication_observations
    )
    
    # 2. Evaluate answer
    evaluation_result = await evaluate_answer(
        question_text=payload.question_text,
        answer_text=payload.answer_text,
        role=session.get("role", "Software Developer"),
        communication_observations=payload.communication_observations
    )
    
    # 3. Save evaluation in DB
    eval_id = save_evaluation(
        answer_id=ans_id,
        interview_id=interview_id,
        question_id=payload.question_id,
        eval_dict=evaluation_result
    )
    
    # 4. Store in session history
    session["qa_history"].append({
        "question_id": payload.question_id,
        "question_text": payload.question_text,
        "answer_id": ans_id,
        "answer_text": payload.answer_text,
        "response_time": payload.response_time_seconds
    })
    session["evaluations"].append(evaluation_result)
    if payload.communication_observations:
        session["communication_records"].append(payload.communication_observations)
        
    return {
        "status": "success",
        "answer_id": ans_id,
        "evaluation_id": eval_id,
        "evaluation": evaluation_result
    }


@router.post("/finish")
async def finish_interview(payload: FinishInterviewRequest):
    """Finishes the interview session and compiles the final report."""
    interview_id = payload.interview_id
    session = sessions_cache.get(interview_id)
    if not session:
        # Check if report already exists in DB
        existing_report = get_report_by_id(interview_id)
        if existing_report:
            return {"status": "success", "report": existing_report}
        raise HTTPException(status_code=404, detail="Interview session not found.")
        
    # Aggregate communication records
    comm_summary = {
        "camera_engagement": "Good",
        "long_pauses": 2,
        "filler_words": 5,
        "average_response_time": 4.1
    }
    if session["communication_records"]:
        total_fillers = sum(c.get("filler_words", 0) for c in session["communication_records"])
        total_pauses = sum(c.get("long_pauses", 0) for c in session["communication_records"])
        avg_rt = sum(c.get("response_time", 4.0) for c in session["communication_records"]) / len(session["communication_records"])
        comm_summary["filler_words"] = total_fillers or 4
        comm_summary["long_pauses"] = total_pauses or 2
        comm_summary["average_response_time"] = round(avg_rt, 1)

    # Generate final report
    report_dict = await generate_final_report(
        session_data=session,
        qa_list=session["qa_history"],
        evaluations=session["evaluations"],
        comm_summary=comm_summary
    )
    report_dict["interview_id"] = interview_id
    report_dict["id"] = str(uuid.uuid4())
    
    # Save in DB
    report_id = save_final_report(report_dict)
    report_dict["id"] = report_id
    
    # Save report to Google Sheets & Trigger Google Apps Script Email Workflow
    try:
        sheets_res = await sync_report_to_google_sheets(report_dict)
        report_dict["sheets_sync"] = sheets_res
    except Exception as e:
        print(f"Error syncing report to Google Sheets: {e}")
    
    return {
        "status": "success",
        "report": report_dict
    }
