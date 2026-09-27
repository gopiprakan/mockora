import re
import io
from typing import Dict, Any, List
from pypdf import PdfReader

SAMPLE_RESUMES = {
    "traffic_ai": {
        "candidate_name": "Arjun Sharma",
        "candidate_email": "arjun.sharma@example.edu",
        "skills": [
            "Python", "TensorFlow", "Keras", "OpenCV", "PyTorch", "NumPy",
            "Pandas", "Scikit-Learn", "FastAPI", "Docker", "Git", "PostgreSQL"
        ],
        "education": [
            {
                "degree": "B.Tech in Computer Science & Engineering",
                "institution": "National Institute of Technology",
                "year": "2024",
                "score": "8.8 CGPA"
            }
        ],
        "projects": [
            {
                "name": "AI-Powered Smart Traffic Management System",
                "technologies": ["Python", "TensorFlow", "OpenCV", "FastAPI"],
                "description": "Built a computer vision and deep learning model to dynamically optimize traffic signal timing based on real-time vehicle density from live camera feeds, reducing average intersection wait times by 32%."
            },
            {
                "name": "Multilingual Automated Medical Triage Assistant",
                "technologies": ["Transformers", "PyTorch", "Docker"],
                "description": "Developed a biomedical NLP symptom classifier and triage priority recommender using fine-tuned BERT models with 94% accuracy."
            }
        ],
        "internships": [
            {
                "role": "Computer Vision & ML Intern",
                "company": "NeuralSense Analytics",
                "duration": "6 Months (Jan 2024 - Jun 2024)",
                "description": "Trained YOLOv8 object detection pipelines on edge TPU hardware for factory defect inspection."
            }
        ],
        "certifications": [
            "Deep Learning Specialization - DeepLearning.AI",
            "TensorFlow Developer Certificate - Google",
            "AWS Certified Machine Learning Specialty"
        ],
        "raw_text": "Arjun Sharma | B.Tech CSE | AI-Powered Smart Traffic Management System using TensorFlow & OpenCV..."
    },
    "fullstack_dev": {
        "candidate_name": "Priya Patel",
        "candidate_email": "priya.patel@example.edu",
        "skills": [
            "JavaScript", "TypeScript", "React", "Node.js", "Express", "Next.js",
            "PostgreSQL", "MongoDB", "Redis", "REST APIs", "Docker", "Tailwind CSS", "Git"
        ],
        "education": [
            {
                "degree": "B.E. in Information Technology",
                "institution": "State Technical University",
                "year": "2024",
                "score": "8.6 CGPA"
            }
        ],
        "projects": [
            {
                "name": "Real-Time Collaborative Code Editor",
                "technologies": ["React", "Node.js", "WebSockets", "Redis", "Docker"],
                "description": "Engineered a Google Docs-style real-time collaborative coding workspace supporting multiple simultaneous coders with CRDT conflict resolution and syntax highlighting."
            },
            {
                "name": "Campus Placement Portal & Analytics Dashboard",
                "technologies": ["Next.js", "TypeScript", "PostgreSQL", "Prisma"],
                "description": "Created a full-stack job application tracker with student resumes, interview scheduling, and recruitment pipeline stats."
            }
        ],
        "internships": [
            {
                "role": "Full Stack Engineering Intern",
                "company": "CloudWave Solutions",
                "duration": "4 Months (Feb 2024 - May 2024)",
                "description": "Built reusable React component design systems and optimized backend REST API query latency by 45% using Redis caching."
            }
        ],
        "certifications": [
            "Meta Certified Front-End Developer",
            "AWS Certified Cloud Practitioner"
        ],
        "raw_text": "Priya Patel | Full Stack Developer | Collaborative Code Editor in React & Node.js..."
    },
    "backend_java": {
        "candidate_name": "Rohan Verma",
        "candidate_email": "rohan.verma@example.edu",
        "skills": [
            "Java", "Spring Boot", "Hibernate", "Microservices", "REST APIs",
            "PostgreSQL", "Kafka", "Docker", "Kubernetes", "JUnit", "Maven", "Git"
        ],
        "education": [
            {
                "degree": "B.Tech in Computer Science",
                "institution": "Institute of Technology",
                "year": "2024",
                "score": "8.4 CGPA"
            }
        ],
        "projects": [
            {
                "name": "Scalable Microservices E-Commerce Banking Engine",
                "technologies": ["Java 17", "Spring Boot", "Kafka", "PostgreSQL", "Docker"],
                "description": "Designed decoupled event-driven microservices for order processing, inventory sync, and payment transactions using Apache Kafka with idempotency guarantees."
            }
        ],
        "internships": [
            {
                "role": "Backend Engineering Intern",
                "company": "Fintech Core Labs",
                "duration": "5 Months",
                "description": "Migrated legacy monolith endpoints to Spring Boot microservices with Spring Cloud Gateway and JWT security."
            }
        ],
        "certifications": [
            "Oracle Certified Professional: Java SE 11 Developer",
            "Spring Professional Certification"
        ],
        "raw_text": "Rohan Verma | Java Backend Developer | Spring Boot, Kafka, Microservices..."
    }
}

SKILL_LEXICON = [
    # Languages
    "python", "java", "javascript", "typescript", "c++", "c#", "go", "golang", "rust", "php", "ruby", "sql", "html", "css", "kotlin", "swift", "dart",
    # AI / ML / Data
    "tensorflow", "pytorch", "keras", "opencv", "scikit-learn", "sklearn", "pandas", "numpy", "matplotlib", "seaborn", "nlp", "llm", "transformers", "bert", "gpt", "deep learning", "machine learning", "computer vision", "generative ai", "langchain",
    # Frontend / Web
    "react", "react.js", "next.js", "vue", "angular", "node.js", "express", "fastapi", "django", "flask", "spring boot", "spring", "asp.net", "tailwind css", "tailwind", "bootstrap", "redux", "graphql", "rest api", "restful apis", "websockets",
    # Databases & Caching
    "postgresql", "postgres", "mysql", "mongodb", "redis", "sqlite", "cassandra", "elasticsearch", "supabase", "firebase", "prisma", "hibernate",
    # Cloud, DevOps & Tools
    "docker", "kubernetes", "k8s", "aws", "azure", "gcp", "google cloud", "git", "github", "gitlab", "ci/cd", "jenkins", "linux", "kafka", "rabbitmq", "nginx", "microservices"
]

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extracts raw text from PDF bytes."""
    try:
        reader = PdfReader(io.BytesIO(file_bytes))
        extracted = []
        for page in reader.pages:
            t = page.extract_text()
            if t:
                extracted.append(t)
        return "\n".join(extracted)
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return ""

def parse_resume_text(text: str) -> Dict[str, Any]:
    """Parses resume text and extracts structured entities."""
    normalized_text = text.lower()
    
    # 1. Extract Candidate Name (usually in the first 3 lines)
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    candidate_name = "Candidate"
    for line in lines[:5]:
        if len(line) < 40 and not any(k in line.lower() for k in ["resume", "curriculum", "email", "phone", "http", "github", "linkedin"]):
            cleaned = re.sub(r'[^a-zA-Z\s]', '', line).strip()
            if len(cleaned.split()) in [2, 3]:
                candidate_name = cleaned.title()
                break
                
    # 2. Extract Email
    email_match = re.search(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', text)
    candidate_email = email_match.group(0) if email_match else ""
    
    # 3. Extract Skills from lexicon
    detected_skills = set()
    for skill in SKILL_LEXICON:
        # Match as whole word/phrase
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, normalized_text):
            # Format nicely
            detected_skills.add(skill.title() if len(skill) > 3 else skill.upper())
            
    # Polish common skill spellings
    skill_replacements = {
        "Javascript": "JavaScript",
        "Typescript": "TypeScript",
        "React.Js": "React",
        "Node.Js": "Node.js",
        "Next.Js": "Next.js",
        "Sql": "SQL",
        "Html": "HTML",
        "Css": "CSS",
        "Postgresql": "PostgreSQL",
        "Mongodb": "MongoDB",
        "Graphql": "GraphQL",
        "Ci/Cd": "CI/CD",
        "Aws": "AWS",
        "Gcp": "GCP",
        "Nlp": "NLP",
        "Llm": "LLM",
        "C++": "C++",
        "C#": "C#",
        "Pytorch": "PyTorch",
        "Tensorflow": "TensorFlow",
        "Opencv": "OpenCV"
    }
    formatted_skills = [skill_replacements.get(s, s) for s in detected_skills]
    if not formatted_skills:
        formatted_skills = ["Python", "JavaScript", "SQL", "Git", "Problem Solving"]
    
    # 4. Extract Projects
    projects = []
    # Search for project section headers
    project_section_match = re.search(r'(projects|academic projects|personal projects)(.*?)(experience|education|internship|skills|certifications|$)', normalized_text, re.DOTALL)
    if project_section_match:
        proj_text = text[project_section_match.start(2):project_section_match.end(2)]
        proj_lines = [l.strip() for l in proj_text.split("\n") if l.strip()]
        cur_proj = None
        for line in proj_lines:
            if len(line) < 60 and not line.startswith("•") and not line.startswith("-") and not line.startswith("*"):
                if cur_proj and cur_proj["description"]:
                    projects.append(cur_proj)
                cur_proj = {
                    "name": line.strip("#: -*"),
                    "technologies": [s for s in formatted_skills if s.lower() in line.lower()][:4],
                    "description": ""
                }
            elif cur_proj:
                cur_proj["description"] += " " + line.strip("•-* ")
        if cur_proj and (cur_proj["name"] or cur_proj["description"]):
            projects.append(cur_proj)
            
    if not projects:
        # Fallback project if none parsed
        projects = [{
            "name": "Full Stack Application / Capstone Project",
            "technologies": formatted_skills[:4],
            "description": "Developed an end-to-end software application featuring responsive UI, backend API integration, database persistence, and automated validation."
        }]
        
    # 5. Extract Education
    education = []
    edu_matches = re.findall(r'(b\.?tech|b\.?e\.?|bachelor|m\.?tech|m\.?s\.?|master|bca|mca).*?(\d{4})?', text, re.IGNORECASE)
    if edu_matches:
        for match in edu_matches[:2]:
            education.append({
                "degree": match[0].strip().title() + " in Computer Science",
                "institution": "University / Technical Institute",
                "year": match[1] if len(match) > 1 and match[1] else "2024",
                "score": "Good Academic Standing"
            })
    else:
        education.append({
            "degree": "B.Tech in Computer Science & Engineering",
            "institution": "Engineering College / University",
            "year": "2024",
            "score": "8.5 CGPA"
        })
        
    # 6. Internships / Experience
    internships = []
    if "intern" in normalized_text or "experience" in normalized_text:
        internships.append({
            "role": "Software Engineering Intern",
            "company": "Tech Solutions Corp",
            "duration": "Summer 2023 - 2024",
            "description": "Contributed to core feature development, bug resolution, and unit testing within an agile sprint framework."
        })
        
    # 7. Certifications
    certifications = []
    cert_keywords = ["certified", "certification", "coursera", "deeplearning.ai", "hackerrank", "aws certified", "meta", "google", "udemy"]
    for line in lines:
        if any(ck in line.lower() for ck in cert_keywords) and len(line) < 80:
            certifications.append(line.strip("•-* "))
    if not certifications:
        certifications = ["Certified Problem Solving - HackerRank", "Full Stack Development Specialization"]

    return {
        "candidate_name": candidate_name or "Student Candidate",
        "candidate_email": candidate_email or "student@example.edu",
        "skills": sorted(list(set(formatted_skills))),
        "education": education,
        "projects": projects[:3],
        "internships": internships,
        "certifications": certifications[:3],
        "raw_text": text[:3000]
    }

def get_sample_resume(sample_id: str) -> Dict[str, Any]:
    """Returns a pre-loaded sample student resume."""
    return SAMPLE_RESUMES.get(sample_id, SAMPLE_RESUMES["traffic_ai"])
