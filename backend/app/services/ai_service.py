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
    for m in [settings.GEMINI_MODEL, "gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.8-flash"]:
        if m and m not in candidate_models:
            candidate_models.append(m)
            
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.7,
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
                    # Model unavailable, overloaded, or rate limited -> try fallback model
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
    
    # Try calling Gemini if available
    if settings.GEMINI_API_KEY:
        history_text = "\n".join([
            f"Q{i+1}: {qa.get('question_text')}\nA{i+1}: {qa.get('answer_text')}"
            for i, qa in enumerate(previous_qa)
        ])
        
        prompt = f"""
You are Mockora, an intelligent, friendly humanoid AI interviewer conducting an interactive {interview_type} mock interview for a {difficulty} {role}.

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
- Question 1: Greet {candidate_name} warmly and ask about a specific technical project or accomplishment from their resume (e.g. "{primary_project}").
- Follow-up Questions (Question 2+): Be truly interactive! Directly probe specific details, trade-offs, technologies, or design choices they mentioned in their previous response. DO NOT ask generic questions.
- Challenge their architecture decisions, concurrency handling, database queries, edge cases, failure scenarios, or debugging methodologies.
- Keep the tone encouraging, conversational, professional, and clear.
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
                # Clean markdown json code fences if any
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

    # High-quality dynamic adaptive fallback engine
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
        # Check what student mentioned in answer 1
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
            q_text = f"That's a solid overview. Looking deeper at the technical stack ({tech}), what was the single biggest technical roadblock you encountered while implementing it, and how did you debug it?"
            note = "Probing technical problem solving and debugging methodology"

    elif question_number == 3:
        # Edge cases and system stress testing
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
        # Core algorithmic & CS fundamentals
        if role in ["AI/ML Engineer", "Data Scientist"]:
            q_text = "Let's touch on fundamentals. How do you evaluate whether your model is suffering from high variance versus high bias, and what specific regularization techniques do you reach for first?"
            note = "Core ML theory: bias-variance tradeoff & regularization"
        elif role in ["Java Developer", "Software Developer"]:
            q_text = "Could you explain the internal working of a HashMap or Hash Table, specifically how hash collisions are resolved, and what happens when the load factor threshold is exceeded?"
            note = "Data structures & core algorithmic complexity"
        else:
            q_text = "In asynchronous programming, how does the JavaScript event loop or Python asyncio event loop manage the microtask and macrotask queues under heavy I/O operations?"
            note = "Runtime concurrency models and asynchronous I/O execution"

    else:
        # Question 5+: Behavioral / Engineering Best Practices
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
    """Evaluates the candidate's answer across 6 core criteria on a 0-10 scale."""
    
    # Try calling Gemini if available
    if settings.GEMINI_API_KEY:
        prompt = f"""
You are Mockora, an expert AI Technical Interviewer & Engineering Evaluator.
Evaluate the candidate's answer for the following question for a {role} position.

IMPORTANT INSTRUCTION FOR FAIR SCORING:
Evaluate fairly and objectively based strictly on the student's actual answer quality, technical accuracy, relevance, and problem-solving maturity.
- Give credit for clear reasoning, mention of specific technologies, architectural awareness, and logical problem-solving.
- Deduct marks if the answer is superficial, vague, lacks real technical depth, or misses the core question.
- Do not arbitrarily assign default grades; differentiate between basic, intermediate, and advanced performance fairly.

Question: "{question_text}"
Candidate's Answer: "{answer_text}"

Evaluate across these 6 criteria on a 0-10 scale (with 1 decimal place, e.g. 7.8, 8.4):
1. technical_score: Technical accuracy and depth of concepts explained (0-10)
2. relevance_score: Directness and relevance to the specific question asked (0-10)
3. communication_score: Clarity, articulation, and vocabulary (0-10)
4. structure_score: Organization (e.g. STAR method, chronological, structured) (0-10)
5. problem_solving_score: Analytical thinking and handling constraints (0-10)
6. examples_score: Inclusion of concrete metrics, projects, or practical examples (0-10)

Also provide:
- feedback: 2-3 sentences of constructive, encouraging feedback highlighting strengths and specific improvement areas.
- improved_answer: A concise, model answer (3-5 sentences) demonstrating how a senior engineer would structure and phrase this response.

Return ONLY valid JSON in this exact structure:
{{
  "technical_score": 7.8,
  "relevance_score": 8.6,
  "communication_score": 7.4,
  "structure_score": 7.2,
  "problem_solving_score": 8.2,
  "examples_score": 7.0,
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
                return {
                    "technical_score": float(parsed.get("technical_score", 8.0)),
                    "relevance_score": float(parsed.get("relevance_score", 8.5)),
                    "communication_score": float(parsed.get("communication_score", 8.0)),
                    "structure_score": float(parsed.get("structure_score", 7.5)),
                    "problem_solving_score": float(parsed.get("problem_solving_score", 8.0)),
                    "examples_score": float(parsed.get("examples_score", 7.0)),
                    "feedback": parsed.get("feedback", "Good explanation with clear technical points."),
                    "improved_answer": parsed.get("improved_answer", "A more structured response would clearly outline context, action taken, and quantitative outcomes.")
                }
            except Exception as e:
                print(f"Error parsing Gemini evaluation JSON: {e}")

    # Heuristic evaluation engine
    word_count = len(answer_text.split())
    
    # Assess length & depth
    if word_count < 15:
        tech_score = 6.0
        rel_score = 6.5
        comm_score = 6.0
        struct_score = 5.5
        prob_score = 6.0
        ex_score = 5.0
        feedback = "Your answer was very brief. In technical interviews, aim to provide sufficient context, technical specifics, and the rationale behind your decisions."
        improved_answer = f"A stronger answer to '{question_text}' should detail the specific technologies used, explain why that approach was chosen over alternatives, and mention measurable results achieved."
    elif word_count < 45:
        tech_score = 7.5
        rel_score = 8.0
        comm_score = 7.5
        struct_score = 7.0
        prob_score = 7.5
        ex_score = 6.5
        feedback = "Good direct response that touched on key points. To stand out further, structure your answer using the STAR framework (Situation, Task, Action, Result) and include concrete technical trade-offs."
        improved_answer = f"To elevate your answer: 'In our architecture, we specifically leveraged this approach to minimize latency. For instance, by implementing caching and decoupled workers, we handled unexpected traffic spikes seamlessly with zero downtime.'"
    else:
        tech_score = 8.5
        rel_score = 9.0
        comm_score = 8.5
        struct_score = 8.0
        prob_score = 8.5
        ex_score = 8.0
        feedback = "Excellent depth and clarity! You articulated the problem clearly, backed it up with technical detail, and demonstrated solid engineering maturity."
        improved_answer = f"Your answer was well rounded. A refined wrap-up could emphasize metrics: 'By monitoring system telemetry through Prometheus and setting up circuit breakers, we maintained 99.9% uptime while optimizing resource allocation.'"

    return {
        "technical_score": tech_score,
        "relevance_score": rel_score,
        "communication_score": comm_score,
        "structure_score": struct_score,
        "problem_solving_score": prob_score,
        "examples_score": ex_score,
        "feedback": feedback,
        "improved_answer": improved_answer
    }


async def generate_final_report(
    session_data: Dict[str, Any],
    qa_list: List[Dict[str, Any]],
    evaluations: List[Dict[str, Any]],
    comm_summary: Dict[str, Any]
) -> Dict[str, Any]:
    """Compiles the final report card, category scores, strengths, and areas to improve."""
    
    # Calculate average scores
    if evaluations:
        avg_tech = sum(e.get("technical_score", 8.0) for e in evaluations) / len(evaluations)
        avg_rel = sum(e.get("relevance_score", 8.0) for e in evaluations) / len(evaluations)
        avg_comm = sum(e.get("communication_score", 8.0) for e in evaluations) / len(evaluations)
        avg_struct = sum(e.get("structure_score", 7.5) for e in evaluations) / len(evaluations)
        avg_prob = sum(e.get("problem_solving_score", 8.0) for e in evaluations) / len(evaluations)
    else:
        avg_tech = 7.8
        avg_rel = 8.6
        avg_comm = 7.4
        avg_struct = 7.2
        avg_prob = 8.2

    # Percentage conversions
    tech_pct = int(avg_tech * 10)
    rel_pct = int(avg_rel * 10)
    comm_pct = int(avg_comm * 10)
    struct_pct = int(avg_struct * 10)
    prob_pct = int(avg_prob * 10)
    
    overall_score = int((avg_tech * 0.3 + avg_rel * 0.2 + avg_prob * 0.2 + avg_comm * 0.15 + avg_struct * 0.15) * 10)
    overall_score = max(55, min(96, overall_score))

    # Assemble question-by-question analysis
    questions_analysis = []
    for i, qa in enumerate(qa_list):
        ev = evaluations[i] if i < len(evaluations) else {}
        q_score = int(((ev.get("technical_score", 8.0) + ev.get("relevance_score", 8.0)) / 2) * 10)
        questions_analysis.append({
            "question_number": i + 1,
            "question": qa.get("question_text", f"Question {i+1}"),
            "student_answer": qa.get("answer_text", "No answer recorded"),
            "score": f"{q_score}/100",
            "ai_feedback": ev.get("feedback", "Clear technical foundation demonstrated."),
            "improved_answer": ev.get("improved_answer", "Consider structuring your response with clear trade-offs and quantitative results.")
        })

    role = session_data.get("role", "Software Developer")

    # Tailored recommendations based on role
    role_topics = {
        "Software Developer": ["SQL joins & indexing", "Object-Oriented Design (SOLID)", "REST API best practices", "Data structures & time complexity"],
        "Full Stack Developer": ["React rendering cycle & hooks", "State management patterns", "Database connection pooling", "JWT & CORS security"],
        "Data Scientist": ["Feature engineering pipelines", "Cross-validation & data leakage", "Precision vs. Recall trade-offs", "Gradient Boosting vs Random Forest"],
        "AI/ML Engineer": ["CNN & Transformer architectures", "Model quantization & pruning", "Latency optimization on GPU/TPU", "MLOps & model drift monitoring"],
        "Java Developer": ["JVM memory model & Garbage Collection", "Spring Boot auto-configuration", "Kafka consumer groups", "Multithreading & locks"],
        "Python Developer": ["Asyncio event loop & coroutines", "Python memory management & GIL", "FastAPI dependency injection", "Pytest fixture design"]
    }
    recommended_topics = role_topics.get(role, role_topics["Software Developer"])

    strengths = [
        "Good understanding of fundamental engineering concepts and architectural flow",
        "Relevant project explanations tied directly to real-world software tooling",
        "Logical problem-solving approach when tackling follow-up constraints"
    ]

    areas_to_improve = [
        "Give more concrete quantitative metrics and real-world system examples",
        "Structure complex answers using a defined framework (e.g. STAR: Situation, Task, Action, Result)",
        "Deepen explanations of database query optimization and error recovery handling"
    ]

    return {
        "candidate_name": session_data.get("candidate_name", "Student Candidate"),
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
            "filler_words": comm_summary.get("filler_words", 5),
            "average_response_time": f"{comm_summary.get('average_response_time', 3.8)}s"
        },
        "questions_analysis": questions_analysis
    }
