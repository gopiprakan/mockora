/**
 * Mockora API Client
 * Secure communication layer to Python FastAPI backend
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/health`, { method: 'GET' });
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend server not directly reachable, using local fallback mode.');
  }
  return { status: 'offline', gemini_active: false };
}

export async function fetchSampleResumes() {
  try {
    const res = await fetch(`${API_BASE}/api/resume/samples`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.error('Error fetching samples:', e);
  }
  // Return embedded fallback samples if backend is starting
  return [
    {
      id: "traffic_ai",
      title: "AI/ML Engineer - Smart Traffic Management",
      candidate_name: "Arjun Sharma",
      role: "AI/ML Engineer",
      summary: "Features computer vision traffic management using TensorFlow and OpenCV."
    },
    {
      id: "fullstack_dev",
      title: "Full Stack Developer - Real-time Collaborative Editor",
      candidate_name: "Priya Patel",
      role: "Full Stack Developer",
      summary: "Features React, Node.js, WebSockets, and Redis distributed caching."
    },
    {
      id: "backend_java",
      title: "Java Backend Engineer - Microservices Banking Engine",
      candidate_name: "Rohan Verma",
      role: "Java Developer",
      summary: "Features Java 17, Spring Boot, Apache Kafka, and PostgreSQL."
    }
  ];
}

export async function uploadResumePdf(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/api/resume/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Upload failed' }));
    throw new Error(err.detail || 'Resume upload failed');
  }
  return await res.json();
}

export async function analyzeResume(data) {
  const res = await fetch(`${API_BASE}/api/resume/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Resume analysis failed');
  }
  return await res.json();
}

export async function startInterviewSession(payload) {
  const res = await fetch(`${API_BASE}/api/interview/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error('Failed to start interview session');
  }
  return await res.json();
}

export async function getNextAdaptiveQuestion(payload) {
  const res = await fetch(`${API_BASE}/api/interview/question`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error('Failed to retrieve next question');
  }
  return await res.json();
}

export async function submitStudentAnswer(payload) {
  const res = await fetch(`${API_BASE}/api/interview/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error('Failed to submit answer');
  }
  return await res.json();
}

export async function finishInterviewSession(interviewId) {
  const res = await fetch(`${API_BASE}/api/interview/finish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ interview_id: interviewId }),
  });

  if (!res.ok) {
    throw new Error('Failed to generate interview report');
  }
  return await res.json();
}

export async function fetchInterviewReport(reportId) {
  const res = await fetch(`${API_BASE}/api/interview/report/${reportId}`);
  if (!res.ok) {
    throw new Error('Interview report not found');
  }
  return await res.json();
}

export async function listAllReports() {
  try {
    const res = await fetch(`${API_BASE}/api/interview/reports`);
    if (res.ok) {
      const data = await res.json();
      return data.reports || [];
    }
  } catch (e) {
    console.error('Failed to list reports:', e);
  }
  return [];
}

export async function sendReportEmail(reportId, email) {
  const res = await fetch(`${API_BASE}/api/report/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ report_id: reportId, email }),
  });

  if (!res.ok) {
    throw new Error('Failed to send report email');
  }
  return await res.json();
}
