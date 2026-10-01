import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from app.services.ai_service import analyze_resume_ai, generate_adaptive_question, evaluate_answer

sample_resume = """
Gopiprakan R
Full Stack Software Developer
Email: gopi@example.com
Skills: React, Python, FastAPI, PostgreSQL, Docker, Redis

Experience & Projects:
1. Smart Traffic Management AI: Built a computer vision system using YOLOv8 and FastAPI to detect emergency vehicles and optimize signal green times, decreasing congestion by 28%.
2. Mockora AI Interviewer: Developed full stack interactive mock interview simulator using React, FastAPI, Web Speech API and Gemini AI.

Education:
B.E Computer Science and Engineering, Anna University (2024), CGPA 8.6
"""

async def test_all():
    print("--- Testing Resume Analysis ---")
    resume_analysis = await analyze_resume_ai(sample_resume)
    print("Parsed Candidate Name:", resume_analysis.get("candidate_name") if resume_analysis else None)
    print("Extracted Skills:", resume_analysis.get("skills") if resume_analysis else None)
    print("Key Focus Areas:", resume_analysis.get("key_focus_areas") if resume_analysis else None)
    print("Suggested Opening:", resume_analysis.get("suggested_opening_question") if resume_analysis else None)

    print("\n--- Testing Adaptive Question Generation ---")
    session = {
        "role": "Full Stack Developer",
        "interview_type": "Technical",
        "difficulty": "Intermediate",
        "candidate_name": "Gopiprakan",
        "resume_data": resume_analysis
    }
    q1 = await generate_adaptive_question(session, 1, [])
    print("Q1:", q1)

    previous_qa = [
        {
            "question_text": q1.get("question_text"),
            "answer_text": "In our Smart Traffic AI project, we used FastAPI for asynchronous video frame processing and YOLOv8 to run detection on edge cameras."
        }
    ]
    q2 = await generate_adaptive_question(session, 2, previous_qa)
    print("\nQ2:", q2)

    print("\n--- Testing Evaluation ---")
    eval_result = await evaluate_answer(
        q1.get("question_text"),
        previous_qa[0]["answer_text"],
        role="Full Stack Developer"
    )
    print("Evaluation:", eval_result)

if __name__ == "__main__":
    asyncio.run(test_all())
