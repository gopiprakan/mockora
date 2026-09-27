from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class EducationItem(BaseModel):
    degree: str
    institution: str
    year: Optional[str] = None
    score: Optional[str] = None

class ProjectItem(BaseModel):
    name: str
    description: str
    technologies: List[str] = Field(default_factory=list)

class WorkItem(BaseModel):
    role: str
    company: str
    duration: Optional[str] = None
    description: Optional[str] = None

class ResumeData(BaseModel):
    candidate_name: Optional[str] = "Student Candidate"
    candidate_email: Optional[str] = ""
    skills: List[str] = Field(default_factory=list)
    education: List[EducationItem] = Field(default_factory=list)
    projects: List[ProjectItem] = Field(default_factory=list)
    internships: List[WorkItem] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
    raw_text: Optional[str] = ""

class ResumeAnalyzeRequest(BaseModel):
    text: Optional[str] = None
    sample_id: Optional[str] = None

class InterviewStartRequest(BaseModel):
    candidate_name: str = "Candidate"
    candidate_email: str
    role: str = "Software Developer"
    interview_type: str = "Technical"  # HR, Technical, Mixed
    difficulty: str = "Intermediate"   # Beginner, Intermediate, Advanced
    duration_minutes: int = 15         # 15, 30
    resume_data: Optional[ResumeData] = None

class InterviewSession(BaseModel):
    id: str
    candidate_name: str
    candidate_email: str
    role: str
    interview_type: str
    difficulty: str
    duration_minutes: int
    start_time: str
    status: str = "active" # active, completed
    current_question_number: int = 1
    resume_data: Optional[ResumeData] = None

class QuestionRequest(BaseModel):
    interview_id: str
    question_number: Optional[int] = None
    time_elapsed_seconds: Optional[int] = 0

class QuestionResponse(BaseModel):
    id: str
    interview_id: str
    question_number: int
    question_text: str
    category: str = "Technical"
    context_note: Optional[str] = None

class AnswerSubmitRequest(BaseModel):
    interview_id: str
    question_id: str
    question_text: str
    answer_text: str
    response_time_seconds: float = 0.0
    communication_observations: Optional[Dict[str, Any]] = None

class AnswerEvaluationResponse(BaseModel):
    id: str
    answer_id: str
    question_id: str
    technical_score: float = 8.0
    relevance_score: float = 8.0
    communication_score: float = 8.0
    structure_score: float = 7.5
    problem_solving_score: float = 8.0
    examples_score: float = 7.0
    feedback: str
    improved_answer: str
    communication_observations: Optional[Dict[str, Any]] = None

class FinishInterviewRequest(BaseModel):
    interview_id: str

class EmailReportRequest(BaseModel):
    report_id: str
    email: str
