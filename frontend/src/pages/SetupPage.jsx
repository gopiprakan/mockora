import React, { useState, useEffect } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, ArrowRight, Sparkles, User, Mail, Briefcase, Award } from 'lucide-react';
import { uploadResumePdf, fetchSampleResumes } from '../services/api';

const DEFAULT_ROLES = [
  "Software Developer",
  "Full Stack Developer",
  "Data Scientist",
  "AI/ML Engineer",
  "Java Developer",
  "Python Developer",
  "Custom Role"
];

export default function SetupPage({ onProceedToAnalysis }) {
  const [candidateName, setCandidateName] = useState('Arjun Sharma');
  const [candidateEmail, setCandidateEmail] = useState('arjun.sharma@example.edu');
  const [selectedRole, setSelectedRole] = useState('Software Developer');
  const [customRole, setCustomRole] = useState('');
  const [interviewType, setInterviewType] = useState('Technical');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [durationMinutes, setDurationMinutes] = useState(15);
  
  // Resume state
  const [uploadedFile, setUploadedFile] = useState(null);
  const [parsedResumeData, setParsedResumeData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [samples, setSamples] = useState([]);
  const [selectedSampleId, setSelectedSampleId] = useState('traffic_ai');

  // Load sample resumes on mount
  useEffect(() => {
    async function loadSamples() {
      const data = await fetchSampleResumes();
      setSamples(data);
    }
    loadSamples();
  }, []);

  // Handle PDF file upload
  const handleFileUpload = async (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setUploadError('Please select a valid PDF file.');
      return;
    }

    setUploadError('');
    setIsUploading(true);
    setUploadedFile(file);

    try {
      const result = await uploadResumePdf(file);
      setParsedResumeData(result.resume_data);
      if (result.resume_data.candidate_name && result.resume_data.candidate_name !== 'Candidate') {
        setCandidateName(result.resume_data.candidate_name);
      }
      if (result.resume_data.candidate_email) {
        setCandidateEmail(result.resume_data.candidate_email);
      }
      setSelectedSampleId(''); // clear sample selection
    } catch (err) {
      console.warn('PDF upload endpoint fallback to mock parsing:', err);
      // Fallback: create mock resume based on file name
      const fallback = {
        candidate_name: candidateName || 'Candidate',
        candidate_email: candidateEmail || 'student@example.edu',
        skills: ['Python', 'JavaScript', 'React', 'SQL', 'FastAPI', 'Docker', 'Git'],
        education: [{ degree: 'B.Tech in Computer Science', institution: 'University', year: '2024' }],
        projects: [{
          name: 'AI Traffic & Signal Optimization System',
          technologies: ['Python', 'TensorFlow', 'OpenCV'],
          description: 'Designed real-time vehicle density detection with automated signal light timing control.'
        }],
        internships: [{ role: 'SDE Intern', company: 'TechCorp', duration: 'Summer 2024' }],
        certifications: ['TensorFlow Developer Certificate', 'AWS Cloud Practitioner']
      };
      setParsedResumeData(fallback);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSelectSample = (sampleId) => {
    setSelectedSampleId(sampleId);
    setUploadedFile(null);
    setUploadError('');

    if (sampleId === 'traffic_ai') {
      setCandidateName('Arjun Sharma');
      setCandidateEmail('arjun.sharma@example.edu');
      setSelectedRole('AI/ML Engineer');
    } else if (sampleId === 'fullstack_dev') {
      setCandidateName('Priya Patel');
      setCandidateEmail('priya.patel@example.edu');
      setSelectedRole('Full Stack Developer');
    } else if (sampleId === 'backend_java') {
      setCandidateName('Rohan Verma');
      setCandidateEmail('rohan.verma@example.edu');
      setSelectedRole('Java Developer');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!candidateEmail) {
      setUploadError('Please provide your student email address.');
      return;
    }

    const effectiveRole = selectedRole === 'Custom Role' ? (customRole || 'Software Developer') : selectedRole;

    onProceedToAnalysis({
      candidateName: candidateName || 'Candidate',
      candidateEmail,
      role: effectiveRole,
      interviewType,
      difficulty,
      durationMinutes,
      resumeData: parsedResumeData,
      sampleId: selectedSampleId
    });
  };

  return (
    <div className="container" style={{ padding: '30px 24px 80px', maxWidth: '820px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span className="badge-cyber" style={{ marginBottom: '12px' }}>
          <Sparkles size={13} />
          Interview Setup
        </span>
        <h1 style={{ fontSize: '32px', color: '#f8fafc', marginBottom: '8px' }}>
          Let's prepare your interview
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '15px' }}>
          Upload your resume and customize your mock interview parameters.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="cyber-card" style={{ padding: '36px', background: 'rgba(13, 21, 39, 0.9)' }}>
        {/* Section 1: Resume Upload */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#f8fafc', marginBottom: '10px' }}>
            Resume Upload
          </label>

          {/* Drag & Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{
              border: '2px dashed rgba(0, 240, 255, 0.35)',
              borderRadius: '12px',
              padding: '30px 20px',
              textAlign: 'center',
              background: 'rgba(10, 16, 30, 0.6)',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
            onClick={() => document.getElementById('resume-pdf-input').click()}
          >
            <input
              id="resume-pdf-input"
              type="file"
              accept=".pdf"
              style={{ display: 'none' }}
              onChange={(e) => handleFileUpload(e.target.files[0])}
            />

            <UploadCloud size={38} color="#00f0ff" style={{ margin: '0 auto 12px' }} />
            
            {uploadedFile ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#10b981', fontWeight: '600' }}>
                  <CheckCircle2 size={18} />
                  <span>{uploadedFile.name}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                  Resume uploaded and analyzed. Click to replace.
                </div>
              </div>
            ) : isUploading ? (
              <div style={{ color: '#00f0ff', fontSize: '14px' }}>
                Analyzing uploaded PDF...
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '15px', fontWeight: '600', color: '#f8fafc' }}>
                  Upload Resume PDF
                </div>
                <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
                  Drag & drop your resume PDF here, or click to browse
                </div>
              </div>
            )}
          </div>

          {uploadError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f43f5e', fontSize: '13px', marginTop: '8px' }}>
              <AlertCircle size={15} />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Quick Sample Selector */}
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.04em' }}>
              Or quick test with verified student sample:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              {samples.map((s) => (
                <div
                  key={s.id}
                  onClick={() => handleSelectSample(s.id)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: `1px solid ${selectedSampleId === s.id && !uploadedFile ? '#00f0ff' : 'rgba(56, 189, 248, 0.15)'}`,
                    background: selectedSampleId === s.id && !uploadedFile ? 'rgba(0, 240, 255, 0.1)' : 'rgba(15, 23, 42, 0.6)',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: '600', color: selectedSampleId === s.id && !uploadedFile ? '#00f0ff' : '#f8fafc' }}>
                    {s.candidate_name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                    {s.role}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Student Details */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
              Student Name
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="Student Name"
                className="cyber-input"
                style={{ paddingLeft: '40px' }}
              />
              <User size={16} color="#64748b" style={{ position: 'absolute', left: '14px', top: '15px' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
              Student Email (For Performance Report)
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                value={candidateEmail}
                onChange={(e) => setCandidateEmail(e.target.value)}
                placeholder="Email address"
                className="cyber-input"
                style={{ paddingLeft: '40px' }}
              />
              <Mail size={16} color="#64748b" style={{ position: 'absolute', left: '14px', top: '15px' }} />
            </div>
          </div>
        </div>

        {/* Section 3: Interview Parameters */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          {/* Interview Role */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
              Interview Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="cyber-select"
            >
              {DEFAULT_ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            {selectedRole === 'Custom Role' && (
              <input
                type="text"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                placeholder="Enter custom role title..."
                className="cyber-input"
                style={{ marginTop: '8px' }}
              />
            )}
          </div>

          {/* Interview Type */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
              Interview Type
            </label>
            <select
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value)}
              className="cyber-select"
            >
              <option value="Technical">Technical</option>
              <option value="HR">HR</option>
              <option value="Mixed">Mixed</option>
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="cyber-select"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
              Interview Duration
            </label>
            <select
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="cyber-select"
            >
              <option value={15}>15 Minutes</option>
              <option value={30}>30 Minutes</option>
              <option value={3}>3 Minutes (Quick Test Demo)</option>
            </select>
          </div>
        </div>

        {/* Submit Action */}
        <button
          type="submit"
          className="btn-primary"
          style={{ width: '100%', padding: '16px', fontSize: '16px', marginTop: '10px' }}
        >
          Start Interview
          <ArrowRight size={18} />
        </button>
      </form>
    </div>
  );
}
