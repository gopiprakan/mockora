import sqlite3
import json
import uuid
from datetime import datetime
from typing import Optional, Dict, Any, List
from pathlib import Path
from ..config import settings

DB_FILE = settings.DATA_DIR / "mockora.db"
# If an older intervexa.db exists and mockora.db does not, migrate it seamlessly
if not DB_FILE.exists() and (settings.DATA_DIR / "intervexa.db").exists():
    try:
        (settings.DATA_DIR / "intervexa.db").rename(DB_FILE)
    except Exception:
        pass

def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initializes tables for Mockora based on the requested schema."""
    conn = get_db()
    cursor = conn.cursor()
    
    # 1. users table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        name TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)
    
    # 2. resumes table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS resumes (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        candidate_name TEXT,
        candidate_email TEXT,
        skills_json TEXT,
        education_json TEXT,
        projects_json TEXT,
        internships_json TEXT,
        certifications_json TEXT,
        raw_text TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    );
    """)
    
    # 3. interviews table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS interviews (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        role TEXT,
        interview_type TEXT,
        difficulty TEXT,
        duration INTEGER,
        start_time TIMESTAMP,
        end_time TIMESTAMP,
        overall_score REAL DEFAULT 0,
        status TEXT DEFAULT 'active',
        resume_id TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(resume_id) REFERENCES resumes(id)
    );
    """)
    
    # 4. questions table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS questions (
        id TEXT PRIMARY KEY,
        interview_id TEXT,
        question_text TEXT,
        question_number INTEGER,
        category TEXT,
        context_note TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(interview_id) REFERENCES interviews(id)
    );
    """)
    
    # 5. answers table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS answers (
        id TEXT PRIMARY KEY,
        question_id TEXT,
        interview_id TEXT,
        answer_text TEXT,
        response_time REAL,
        communication_observations_json TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(question_id) REFERENCES questions(id),
        FOREIGN KEY(interview_id) REFERENCES interviews(id)
    );
    """)
    
    # 6. evaluations table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS evaluations (
        id TEXT PRIMARY KEY,
        answer_id TEXT,
        interview_id TEXT,
        question_id TEXT,
        technical_score REAL,
        relevance_score REAL,
        communication_score REAL,
        structure_score REAL,
        problem_solving_score REAL,
        examples_score REAL,
        feedback TEXT,
        improved_answer TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(answer_id) REFERENCES answers(id),
        FOREIGN KEY(interview_id) REFERENCES interviews(id),
        FOREIGN KEY(question_id) REFERENCES questions(id)
    );
    """)
    
    # 7. interview_reports table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS interview_reports (
        id TEXT PRIMARY KEY,
        interview_id TEXT UNIQUE,
        candidate_name TEXT,
        candidate_email TEXT,
        role TEXT,
        duration_minutes INTEGER,
        overall_score INTEGER,
        category_scores_json TEXT,
        strengths_json TEXT,
        areas_to_improve_json TEXT,
        recommended_topics_json TEXT,
        communication_summary_json TEXT,
        questions_analysis_json TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(interview_id) REFERENCES interviews(id)
    );
    """)
    
    conn.commit()
    conn.close()

# Database helper functions

def save_or_get_user(email: str, name: str) -> str:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
    row = cursor.fetchone()
    if row:
        user_id = row["id"]
    else:
        user_id = str(uuid.uuid4())
        cursor.execute("INSERT INTO users (id, email, name) VALUES (?, ?, ?)", (user_id, email, name))
        conn.commit()
    conn.close()
    return user_id

def save_resume(user_id: Optional[str], resume_data: Dict[str, Any]) -> str:
    resume_id = str(uuid.uuid4())
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO resumes (id, user_id, candidate_name, candidate_email, skills_json, education_json, projects_json, internships_json, certifications_json, raw_text)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        resume_id,
        user_id,
        resume_data.get("candidate_name", "Candidate"),
        resume_data.get("candidate_email", ""),
        json.dumps(resume_data.get("skills", [])),
        json.dumps(resume_data.get("education", [])),
        json.dumps(resume_data.get("projects", [])),
        json.dumps(resume_data.get("internships", [])),
        json.dumps(resume_data.get("certifications", [])),
        resume_data.get("raw_text", "")
    ))
    conn.commit()
    conn.close()
    return resume_id

def create_interview_session(
    user_id: str,
    role: str,
    interview_type: str,
    difficulty: str,
    duration: int,
    resume_id: Optional[str] = None
) -> str:
    interview_id = str(uuid.uuid4())
    start_time = datetime.utcnow().isoformat()
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO interviews (id, user_id, role, interview_type, difficulty, duration, start_time, status, resume_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'active', ?)
    """, (interview_id, user_id, role, interview_type, difficulty, duration, start_time, resume_id))
    conn.commit()
    conn.close()
    return interview_id

def save_question(interview_id: str, question_text: str, question_number: int, category: str = "Technical", context_note: str = "") -> str:
    q_id = str(uuid.uuid4())
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO questions (id, interview_id, question_text, question_number, category, context_note)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (q_id, interview_id, question_text, question_number, category, context_note))
    conn.commit()
    conn.close()
    return q_id

def save_answer(interview_id: str, question_id: str, answer_text: str, response_time: float, communication_obs: Optional[Dict[str, Any]] = None) -> str:
    a_id = str(uuid.uuid4())
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO answers (id, question_id, interview_id, answer_text, response_time, communication_observations_json)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (a_id, question_id, interview_id, answer_text, response_time, json.dumps(communication_obs or {})))
    conn.commit()
    conn.close()
    return a_id

def save_evaluation(
    answer_id: str,
    interview_id: str,
    question_id: str,
    eval_dict: Dict[str, Any]
) -> str:
    eval_id = str(uuid.uuid4())
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO evaluations (
            id, answer_id, interview_id, question_id,
            technical_score, relevance_score, communication_score,
            structure_score, problem_solving_score, examples_score,
            feedback, improved_answer
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        eval_id,
        answer_id,
        interview_id,
        question_id,
        eval_dict.get("technical_score", 8.0),
        eval_dict.get("relevance_score", 8.0),
        eval_dict.get("communication_score", 8.0),
        eval_dict.get("structure_score", 7.5),
        eval_dict.get("problem_solving_score", 8.0),
        eval_dict.get("examples_score", 7.0),
        eval_dict.get("feedback", ""),
        eval_dict.get("improved_answer", "")
    ))
    conn.commit()
    conn.close()
    return eval_id

def save_final_report(report_data: Dict[str, Any]) -> str:
    report_id = report_data.get("id") or str(uuid.uuid4())
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT OR REPLACE INTO interview_reports (
            id, interview_id, candidate_name, candidate_email, role, duration_minutes,
            overall_score, category_scores_json, strengths_json, areas_to_improve_json,
            recommended_topics_json, communication_summary_json, questions_analysis_json, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        report_id,
        report_data.get("interview_id"),
        report_data.get("candidate_name"),
        report_data.get("candidate_email"),
        report_data.get("role"),
        report_data.get("duration_minutes", 15),
        report_data.get("overall_score", 78),
        json.dumps(report_data.get("category_scores", {})),
        json.dumps(report_data.get("strengths", [])),
        json.dumps(report_data.get("areas_to_improve", [])),
        json.dumps(report_data.get("recommended_topics", [])),
        json.dumps(report_data.get("communication_summary", {})),
        json.dumps(report_data.get("questions_analysis", [])),
        datetime.utcnow().isoformat()
    ))
    
    # Update interview status to completed
    cursor.execute("""
        UPDATE interviews 
        SET status = 'completed', end_time = ?, overall_score = ?
        WHERE id = ?
    """, (datetime.utcnow().isoformat(), report_data.get("overall_score", 78), report_data.get("interview_id")))
    
    conn.commit()
    conn.close()
    return report_id

def get_report_by_id(report_id: str) -> Optional[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM interview_reports WHERE id = ? OR interview_id = ?", (report_id, report_id))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return None
    return {
        "id": row["id"],
        "interview_id": row["interview_id"],
        "candidate_name": row["candidate_name"],
        "candidate_email": row["candidate_email"],
        "role": row["role"],
        "duration_minutes": row["duration_minutes"],
        "overall_score": row["overall_score"],
        "category_scores": json.loads(row["category_scores_json"] or "{}"),
        "strengths": json.loads(row["strengths_json"] or "[]"),
        "areas_to_improve": json.loads(row["areas_to_improve_json"] or "[]"),
        "recommended_topics": json.loads(row["recommended_topics_json"] or "[]"),
        "communication_summary": json.loads(row["communication_summary_json"] or "{}"),
        "questions_analysis": json.loads(row["questions_analysis_json"] or "[]"),
        "created_at": row["created_at"]
    }

def get_all_reports() -> List[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM interview_reports ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    reports = []
    for row in rows:
        reports.append({
            "id": row["id"],
            "interview_id": row["interview_id"],
            "candidate_name": row["candidate_name"],
            "candidate_email": row["candidate_email"],
            "role": row["role"],
            "duration_minutes": row["duration_minutes"],
            "overall_score": row["overall_score"],
            "category_scores": json.loads(row["category_scores_json"] or "{}"),
            "strengths": json.loads(row["strengths_json"] or "[]"),
            "areas_to_improve": json.loads(row["areas_to_improve_json"] or "[]"),
            "recommended_topics": json.loads(row["recommended_topics_json"] or "[]"),
            "created_at": row["created_at"]
        })
    return reports

# Initialize database tables on import
init_db()
