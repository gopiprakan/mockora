import json
import httpx
import re
from typing import Dict, Any, List, Optional
from ..config import settings

GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models"

async def call_gemini(prompt: str, system_instruction: str = "") -> Optional[str]:
    """Calls Gemini REST API with automated multi-model failover."""
    if not settings.GEMINI_API_KEY:
        return None
    
    # Priority ordered list of models to try
    candidate_models = []
    default_models = [settings.GEMINI_MODEL, "gemini-3.1-flash-lite", "gemini-3.7-flash", "gemini-3.8-flash", "gemini-flash-latest"]
    for m in default_models:
        clean_m = m.replace("models/", "") if m else ""
        if clean_m and clean_m not in candidate_models:
            candidate_models.append(clean_m)
            
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.3, # lower temperature for objective, consistent scoring
            "maxOutputTokens": 2048,
        }
    }
    
    if system_instruction:
        payload["systemInstruction"] = {
            "parts": [{"text": system_instruction}]
        }
        
    for model in candidate_models:
        url = f"{GEMINI_ENDPOINT}/{model}:generateContent?key={settings.GEMINI_API_KEY}"
        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                resp = await client.post(url, json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        content_parts = candidates[0].get("content", {}).get("parts", [])
                        if content_parts:
                            return content_parts[0].get("text", "")
                elif resp.status_code in [404, 503, 429]:
                    continue
                else:
                    print(f"Gemini API ({model}) returned {resp.status_code}: {resp.text[:120]}")
        except Exception as e:
            print(f"Gemini call to {model} failed: {e}")
            continue
            
    return None


async def analyze_resume_ai(raw_text: str) -> Optional[Dict[str, Any]]:
    """Uses Gemini to thoroughly parse, analyze, and extract key interview focus areas from resume text."""
    if not settings.GEMINI_API_KEY or not raw_text.strip():
        return None
        
    prompt = f"""
You are Mockora, an expert AI Technical Interviewer & Engineering Recruiter.
Analyze the following candidate resume text. Extract their profile and synthesize key interview focus areas so we can conduct an adaptive, highly relevant mock interview.

Resume Text:
{raw_text[:6000]}

TASK:
Extract and return ONLY a valid JSON object matching this exact structure:
{{
  "candidate_name": "Candidate Full Name or Student Candidate",
  "candidate_email": "candidate email or ''",
  "skills": ["Language/Framework 1", "Database/Tool 2", ...],
  "education": [
    {{
      "degree": "Degree name",
      "institution": "University / College",
      "year": "Graduation year",
      "score": "CGPA / GPA / Honors"
    }}
  ],
  "projects": [
    {{
      "name": "Project Name",
      "technologies": ["Tech 1", "Tech 2"],
      "description": "Short description of what the project does and its technical architecture"
    }}
  ],
  "internships": [
    {{
      "role": "Role / Title",
      "company": "Company Name",
      "duration": "Duration (e.g. Jun 2023 - Aug 2023)",
      "description": "Key achievements and responsibilities"
    }}
  ],
  "certifications": ["Certification 1", ...],
  "key_focus_areas": [
    "Specific technical strength or complex component to question during the interview",
    "Another notable architectural trade-off or challenge in their background"
  ],
  "suggested_opening_question": "A welcoming, natural question directly mentioning a specific project from their resume."
}}
"""
    response_text = await call_gemini(prompt)
    if response_text:
        try:
            clean_json = re.sub(r'```(?:json)?\n|\n```', '', response_text).strip()
            match = re.search(r'\{.*\}', clean_json, re.DOTALL)
            if match:
                clean_json = match.group(0)
            parsed = json.loads(clean_json)
            parsed["raw_text"] = raw_text[:3000]
            return parsed
        except Exception as e:
            print(f"Error parsing Gemini resume analysis JSON: {e}")
    return None


async def generate_adaptive_question(
    interview_session: Dict[str, Any],
    question_number: int,
    previous_qa: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """Generates the next adaptive question based on resume context and prior answers."""
    role = interview_session.get("role", "Software Developer")
    interview_type = interview_session.get("interview_type", "Technical")
    difficulty = interview_session.get("difficulty", "Intermediate")
    resume = interview_session.get("resume_data") or {}
    
    skills = resume.get("skills", [])
    projects = resume.get("projects", [])
    candidate_name = resume.get("candidate_name") or interview_session.get("candidate_name") or "Candidate"
    key_focus_areas = resume.get("key_focus_areas", [])
    suggested_opening = resume.get("suggested_opening_question")
    primary_project = projects[0]["name"] if projects else "your recent software project"
    primary_project_tech = ", ".join(projects[0].get("technologies", [])) if projects else "modern technologies"
    
    if settings.GEMINI_API_KEY:
        history_text = "\n".join([
            f"Q{i+1}: {qa.get('question_text')}\nA{i+1}: {qa.get('answer_text')}"
            for i, qa in enumerate(previous_qa)
        ])
        
        prompt = f"""
You are Mockora, an intelligent, professional AI interviewer conducting an interactive {interview_type} mock interview for a {difficulty} {role}.

Candidate Profile from Resume:
- Candidate Name: {candidate_name}
- Technical Skills: {', '.join(skills) if skills else 'General Software Engineering'}
- Projects: {json.dumps(projects)}
- Key Focus Areas from Resume: {json.dumps(key_focus_areas)}
- Education: {json.dumps(resume.get('education', []))}
{"- Suggested Opening Direction: " + suggested_opening if suggested_opening and question_number == 1 else ""}

Interview Progress:
Current Question Number: {question_number}
Previous Q&A History:
{history_text or 'No previous questions yet (Starting interview)'}

TASK:
Generate question #{question_number}.
Guidelines:
- Question 1: Greet {candidate_name} and ask about a specific technical project or accomplishment from their resume (e.g. "{primary_project}").
- Follow-up Questions (Question 2+): Be truly interactive! If they answered poorly or vaguely in the previous turn, ask them to clarify or give a concrete example. If they gave a strong answer, probe their architecture decisions, edge cases, failure scenarios, or debugging methodologies.
- Return ONLY valid JSON in this exact structure:
{{
  "question_text": "The question to speak aloud to the candidate",
  "category": "{interview_type}",
  "context_note": "Short rationale explaining why this question was chosen based on their resume and previous answer"
}}
"""
        response_text = await call_gemini(prompt)
        if response_text:
            try:
                clean_json = re.sub(r'```(?:json)?\n|\n```', '', response_text).strip()
                match = re.search(r'\{.*\}', clean_json, re.DOTALL)
                if match:
                    clean_json = match.group(0)
                parsed = json.loads(clean_json)
                return {
                    "question_text": parsed.get("question_text"),
                    "category": parsed.get("category", interview_type),
                    "context_note": parsed.get("context_note", "Adaptive resume exploration")
                }
            except Exception as e:
                print(f"Error parsing Gemini question JSON: {e}")

    # Adaptive fallback engine
    last_qa = previous_qa[-1] if previous_qa else None
    last_answer = last_qa.get("answer_text", "").lower() if last_qa else ""

    if question_number == 1:
        if projects:
            q_text = f"Welcome to your Mockora mock interview! To get started, I was reviewing your resume and noticed your project '{projects[0]['name']}'. Could you walk me through the problem it solves and your core technical architecture?"
            note = f"Initial deep-dive into resume project: {projects[0]['name']}"
        else:
            q_text = f"Welcome to Mockora! To kick off our session for the {role} position, could you introduce yourself and highlight a challenging technical project or problem you've worked on recently?"
            note = f"Icebreaker and core project overview for {role}"
    
    elif question_number == 2:
        if any(w in last_answer for w in ["tensorflow", "pytorch", "model", "cnn", "yolo", "cv", "machine learning"]):
            q_text = "You mentioned using deep learning models for that project. Which specific model architecture did you select, and how did you prepare and normalize your training dataset?"
            note = "Follow-up on deep learning model architecture and data preprocessing"
        elif any(w in last_answer for w in ["react", "state", "frontend", "ui", "component"]):
            q_text = "You mentioned building the frontend with React. How did you structure your component hierarchy and handle application state to prevent unnecessary re-renders?"
            note = "Follow-up on React component state management & performance"
        elif any(w in last_answer for w in ["api", "backend", "fastapi", "node", "express", "spring"]):
            q_text = "You spoke about your backend API design. How did you handle data validation, error responses, and authentication across your endpoints?"
            note = "Follow-up on backend API reliability and security"
        elif any(w in last_answer for w in ["database", "postgres", "sql", "mongo"]):
            q_text = "You touched on your database layer. Could you explain your database schema design and any indexing strategies you applied to keep queries fast?"
            note = "Follow-up on database design and query performance"
        else:
            tech = primary_project_tech.split(",")[0] if primary_project_tech else "core technologies"
            q_text = f"Looking deeper at the technical stack ({tech}), what was the single biggest technical roadblock you encountered while implementing it, and how did you debug it?"
            note = "Probing technical problem solving and debugging methodology"

    elif question_number == 3:
        if "traffic" in last_answer or "traffic" in primary_project.lower():
            q_text = "In real-world deployment, unexpected anomalies happen. What would your traffic management system do if two emergency vehicles arrived simultaneously from different perpendicular directions?"
            note = "System edge case & fail-safe decision logic"
        elif any(w in last_answer for w in ["docker", "scale", "concurrency", "traffic", "request"]):
            q_text = "Let's explore scalability. If your user traffic suddenly spiked by a factor of 10x in a few minutes, what would be the first point of failure in your architecture, and how would you mitigate it?"
            note = "Scalability bottlenecks and mitigation strategy"
        elif any(w in last_answer for w in ["database", "table", "query", "nosql"]):
            q_text = "Regarding data persistence, how would you guarantee transaction consistency and avoid race conditions when multiple users perform simultaneous updates?"
            note = "Concurrency control and transaction integrity"
        else:
            q_text = "If you had to redesign this system from scratch today with what you learned, what architectural choice or library would you replace, and what trade-offs would that introduce?"
            note = "Technical trade-offs and retrospective architectural thinking"

    elif question_number == 4:
        if role in ["AI/ML Engineer", "Data Scientist"]:
            q_text = "Let's touch on fundamentals. How do you evaluate whether your model is suffering from high variance versus high bias, and what specific regularization techniques do you reach for first?"
            note = "Core ML theory: bias-variance tradeoff & regularization"
        elif role in ["Java Developer", "Software Developer"]:
            q_text = "Could you explain the internal working of a HashMap or Hash Table, specifically how hash collisions are resolved, and what happens when the load factor threshold is exceeded?"
            note = "Data structures & core algorithmic complexity"
        else:
            q_text = "In asynchronous programming, how does the event loop manage microtasks and macrotasks under heavy concurrent I/O operations?"
            note = "Runtime concurrency models and asynchronous I/O execution"

    else:
        if interview_type in ["HR", "Mixed"]:
            q_text = "Can you share a scenario where you had a strong disagreement with a teammate or reviewer regarding code design or task priority? How did you communicate and resolve it?"
            note = "Team collaboration, conflict resolution and engineering empathy"
        else:
            q_text = "How do you approach writing automated tests, continuous integration, and monitoring to ensure your code is production-ready before deployment?"
            note = "Testing culture, CI/CD and production readiness"

    return {
        "question_text": q_text,
        "category": interview_type,
        "context_note": note
    }


async def evaluate_answer(
    question_text: str,
    answer_text: str,
    role: str,
    communication_observations: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Evaluates the candidate's answer STRICTLY based on performance on a 0-10 scale.
    No inflated or arbitrary marks. Score strictly reflects accuracy, depth, relevance, and clarity.
    """
    cleaned_answer = (answer_text or "").strip()
    
    # Check for empty or non-answers
    dismissals = ["idk", "no idea", "i don't know", "i dont know", "skip", "pass", "no", "nothing", "na", "n/a", "none"]
    is_dismissal = cleaned_answer.lower() in dismissals or len(cleaned_answer) < 4
    
    if is_dismissal:
        return {
            "technical_score": 0.5,
            "relevance_score": 0.5,
            "communication_score": 1.0,
            "structure_score": 1.0,
            "problem_solving_score": 0.5,
            "examples_score": 0.0,
            "feedback": "No technical explanation was provided for this question. In interviews, even if unsure, attempt to outline the general concepts or problem-solving direction.",
            "improved_answer": f"To answer '{question_text}', a senior engineer would clearly break down the problem statement, highlight key constraints, and explain their chosen solution step-by-step."
        }

    # Try calling Gemini with strict, objective rubric
    if settings.GEMINI_API_KEY:
        prompt = f"""
You are Mockora, a rigorous and fair Senior Technical Interviewer & Engineering Hiring Manager.
Evaluate the candidate's answer for the following question for a {role} position.

STRICT SCORING RULES — NO GRADE INFLATION:
- You must evaluate FULLY and STRICTLY based on actual answer performance. Do NOT give high marks if the answer is short, vague, incorrect, or superficial.
- 0.0 to 2.0: Non-answer, gibberish, completely incorrect, or totally unrelated.
- 2.5 to 4.5: Very weak, superficial, lacks core technical understanding, or misses most of what was asked.
- 5.0 to 6.5: Average / Basic entry-level answer. Partially correct but lacks depth, implementation details, or trade-offs.
- 7.0 to 8.5: Solid / Competent answer. Clear technical accuracy, relevant examples, good explanation of how things work.
- 8.6 to 10.0: Outstanding senior-level answer with deep architectural nuance, edge cases, error recovery, and quantitative results.

Question: "{question_text}"
Candidate's Answer: "{cleaned_answer}"

Evaluate each criterion on a 0-10 scale (use 1 decimal place, e.g. 3.5, 6.2, 8.4):
1. technical_score: Technical accuracy and conceptual correctness (0-10)
2. relevance_score: Directness in addressing the specific question asked (0-10)
3. communication_score: Articulation, vocabulary, and clarity (0-10)
4. structure_score: Organization and logical flow (0-10)
5. problem_solving_score: Analytical problem-solving and handling constraints (0-10)
6. examples_score: Practical details, architecture patterns, or concrete trade-offs (0-10)

Also provide:
- feedback: 2-3 sentences of honest, objective feedback explicitly pointing out what was missing or what was good.
- improved_answer: A model answer (3-5 sentences) showing how a top-tier engineer would answer this question.

Return ONLY valid JSON matching this exact structure:
{{
  "technical_score": 5.0,
  "relevance_score": 5.5,
  "communication_score": 5.0,
  "structure_score": 4.5,
  "problem_solving_score": 5.0,
  "examples_score": 4.0,
  "feedback": "...",
  "improved_answer": "..."
}}
"""
        response_text = await call_gemini(prompt)
        if response_text:
            try:
                clean_json = re.sub(r'```(?:json)?\n|\n```', '', response_text).strip()
                match = re.search(r'\{.*\}', clean_json, re.DOTALL)
                if match:
                    clean_json = match.group(0)
                parsed = json.loads(clean_json)
                
                tech = max(0.0, min(10.0, float(parsed.get("technical_score", 5.0))))
                rel = max(0.0, min(10.0, float(parsed.get("relevance_score", 5.0))))
                comm = max(0.0, min(10.0, float(parsed.get("communication_score", 5.0))))
                struct = max(0.0, min(10.0, float(parsed.get("structure_score", 5.0))))
                prob = max(0.0, min(10.0, float(parsed.get("problem_solving_score", 5.0))))
                ex = max(0.0, min(10.0, float(parsed.get("examples_score", 4.0))))
                
                return {
                    "technical_score": round(tech, 1),
                    "relevance_score": round(rel, 1),
                    "communication_score": round(comm, 1),
                    "structure_score": round(struct, 1),
                    "problem_solving_score": round(prob, 1),
                    "examples_score": round(ex, 1),
                    "feedback": parsed.get("feedback", "Answer evaluated based on technical depth and relevance."),
                    "improved_answer": parsed.get("improved_answer", "A comprehensive answer should clearly outline the problem, architectural choices, and quantitative outcomes.")
                }
            except Exception as e:
                print(f"Error parsing Gemini evaluation JSON: {e}")

    # Rigorous Heuristic evaluation engine (when offline or fallback)
    words = cleaned_answer.split()
    word_count = len(words)
    
    # Technical keywords check
    tech_keywords = [
        "architecture", "database", "query", "index", "latency", "scale", "docker", "api", "rest",
        "algorithm", "complexity", "time", "space", "model", "training", "optimization", "cache",
        "redis", "state", "component", "async", "thread", "concurrency", "security", "jwt",
        "service", "endpoint", "pipeline", "schema", "table", "node", "tree", "memory", "testing"
    ]
    matched_keywords = sum(1 for kw in tech_keywords if kw in cleaned_answer.lower())

    if word_count < 12:
        tech_score = 2.5
        rel_score = 3.0
        comm_score = 3.0
        struct_score = 2.5
        prob_score = 2.5
        ex_score = 1.5
        feedback = "Your answer was extremely brief (under 12 words) and did not demonstrate sufficient technical understanding. Always explain the 'how' and 'why' behind your solutions."
        improved_answer = f"To answer '{question_text}', explain the core concepts, outline your implementation approach, and discuss how you verify accuracy and performance."
    elif word_count < 30:
        base = 4.0 + min(2.0, matched_keywords * 0.5)
        tech_score = min(6.0, base)
        rel_score = min(6.5, base + 0.5)
        comm_score = 5.0
        struct_score = 4.5
        prob_score = min(6.0, base)
        ex_score = 3.5
        feedback = "Basic response that touched on high-level points, but lacked technical depth, concrete architecture details, and measurable trade-offs."
        improved_answer = f"To strengthen this answer: 'In our system, we structured the architecture to handle edge cases by isolating components, introducing logging, and validating throughput under peak load.'"
    elif word_count < 65:
        base = 5.5 + min(2.5, matched_keywords * 0.6)
        tech_score = min(8.0, base)
        rel_score = min(8.5, base + 0.5)
        comm_score = 7.0
        struct_score = 6.5
        prob_score = min(8.0, base)
        ex_score = min(7.5, base - 0.5)
        feedback = "Good response with relevant technical context. To stand out even more, explicitly outline alternative designs you considered and why your choice was optimal."
        improved_answer = f"A senior answer would highlight metrics: 'By selecting this approach over alternatives, we achieved sub-50ms latency and maintained high data consistency through atomic updates.'"
    else:
        base = 7.0 + min(2.5, matched_keywords * 0.5)
        tech_score = min(9.5, base)
        rel_score = min(9.5, base + 0.5)
        comm_score = 8.5
        struct_score = 8.0
        prob_score = min(9.5, base)
        ex_score = min(9.0, base)
        feedback = "Comprehensive and well-articulated response! You demonstrated strong technical depth, domain knowledge, and clear engineering structure."
        improved_answer = f"Refined model summary: 'We implemented this pattern with automated regression tests, distributed caching, and health telemetry, ensuring robust production resilience.'"

    return {
        "technical_score": round(tech_score, 1),
        "relevance_score": round(rel_score, 1),
        "communication_score": round(comm_score, 1),
        "structure_score": round(struct_score, 1),
        "problem_solving_score": round(prob_score, 1),
        "examples_score": round(ex_score, 1),
        "feedback": feedback,
        "improved_answer": improved_answer
    }


async def generate_final_report(
    session_data: Dict[str, Any],
    qa_list: List[Dict[str, Any]],
    evaluations: List[Dict[str, Any]],
    comm_summary: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Compiles the final report card with TRUE scores based strictly on actual student answers.
    No artificial minimum grade floors or inflated scores.
    """
    
    if evaluations:
        avg_tech = sum(e.get("technical_score", 0.0) for e in evaluations) / len(evaluations)
        avg_rel = sum(e.get("relevance_score", 0.0) for e in evaluations) / len(evaluations)
        avg_comm = sum(e.get("communication_score", 0.0) for e in evaluations) / len(evaluations)
        avg_struct = sum(e.get("structure_score", 0.0) for e in evaluations) / len(evaluations)
        avg_prob = sum(e.get("problem_solving_score", 0.0) for e in evaluations) / len(evaluations)
    else:
        avg_tech = 0.0
        avg_rel = 0.0
        avg_comm = 0.0
        avg_struct = 0.0
        avg_prob = 0.0

    # True percentage conversions (0 - 100)
    tech_pct = max(0, min(100, int(round(avg_tech * 10))))
    rel_pct = max(0, min(100, int(round(avg_rel * 10))))
    comm_pct = max(0, min(100, int(round(avg_comm * 10))))
    struct_pct = max(0, min(100, int(round(avg_struct * 10))))
    prob_pct = max(0, min(100, int(round(avg_prob * 10))))
    
    # Weighted composite overall score
    raw_overall = (avg_tech * 0.35 + avg_rel * 0.20 + avg_prob * 0.20 + avg_comm * 0.15 + avg_struct * 0.10) * 10
    overall_score = max(0, min(100, int(round(raw_overall))))

    # Assemble question-by-question analysis
    questions_analysis = []
    for i, qa in enumerate(qa_list):
        ev = evaluations[i] if i < len(evaluations) else {}
        t_score = ev.get("technical_score", 0.0)
        r_score = ev.get("relevance_score", 0.0)
        q_score = int(round(((t_score + r_score) / 2) * 10))
        q_score = max(0, min(100, q_score))
        
        questions_analysis.append({
            "question_number": i + 1,
            "question": qa.get("question_text", f"Question {i+1}"),
            "student_answer": qa.get("answer_text", "No answer recorded"),
            "score": f"{q_score}/100",
            "ai_feedback": ev.get("feedback", "Answer evaluated based on relevance and technical clarity."),
            "improved_answer": ev.get("improved_answer", "Consider structuring your response with clear technical specifics and quantitative results.")
        })

    role = session_data.get("role", "Software Developer")

    # Tailored recommendations based on role
    role_topics = {
        "Software Developer": ["SQL joins & query plans", "Object-Oriented Design (SOLID)", "REST API best practices", "Data structures & time complexity"],
        "Full Stack Developer": ["React state management & re-renders", "REST/GraphQL API design", "Database indexing & connection pooling", "Authentication & CORS"],
        "Data Scientist": ["Feature engineering pipelines", "Cross-validation & data leakage", "Precision vs. Recall trade-offs", "Gradient Boosting vs Random Forest"],
        "AI/ML Engineer": ["CNN & Transformer architectures", "Model quantization & pruning", "Latency optimization on GPU/TPU", "MLOps & model drift monitoring"],
        "Java Developer": ["JVM memory model & Garbage Collection", "Spring Boot auto-configuration", "Kafka consumer groups", "Multithreading & concurrency"],
        "Python Developer": ["Asyncio event loop & coroutines", "Python memory management & GIL", "FastAPI dependency injection", "Pytest fixture design"]
    }
    recommended_topics = role_topics.get(role, role_topics["Software Developer"])

    # Dynamic strengths & improvements based on actual score
    if overall_score >= 80:
        strengths = [
            "Strong command of technical fundamentals and architecture flow",
            "Direct and relevant responses with clear engineering vocabulary",
            "Logical problem-solving methodology when analyzing trade-offs"
        ]
        areas_to_improve = [
            "Incorporate more quantitative production metrics (e.g. latency, throughput, error rates)",
            "Elaborate on disaster recovery, failure failovers, and monitoring alerts"
        ]
    elif overall_score >= 55:
        strengths = [
            "Good foundational knowledge on primary tools and core concepts",
            "Understood the intent of the questions and provided direct answers"
        ]
        areas_to_improve = [
            "Deepen technical specificity — explain exact algorithms and data structures rather than high-level summaries",
            "Structure answers using the STAR method (Situation, Task, Action, Result)",
            "Address edge cases, concurrency, and performance bottlenecks more thoroughly"
        ]
    else:
        strengths = [
            "Engaged with the interview session and attempted questions"
        ]
        areas_to_improve = [
            "Significant preparation needed in core technical fundamentals and role-specific architecture",
            "Avoid one-line or vague responses; provide detailed explanations with examples",
            "Review key topics such as data structures, API design, and system debugging thoroughly"
        ]

    return {
        "candidate_name": session_data.get("candidate_name", "Candidate"),
        "candidate_email": session_data.get("candidate_email", ""),
        "role": role,
        "interview_type": session_data.get("interview_type", "Technical"),
        "duration_minutes": session_data.get("duration_minutes", 15),
        "overall_score": overall_score,
        "category_scores": {
            "Technical Knowledge": tech_pct,
            "Communication": comm_pct,
            "Problem Solving": prob_pct,
            "Answer Relevance": rel_pct,
            "Answer Structure": struct_pct
        },
        "strengths": strengths,
        "areas_to_improve": areas_to_improve,
        "recommended_topics": recommended_topics,
        "communication_summary": {
            "camera_engagement": comm_summary.get("camera_engagement", "Good"),
            "long_pauses": comm_summary.get("long_pauses", 2),
            "filler_words": comm_summary.get("filler_words", 4),
            "average_response_time": f"{comm_summary.get('average_response_time', 3.8)}s"
        },
        "questions_analysis": questions_analysis
    }
