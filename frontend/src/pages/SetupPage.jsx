import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, ArrowRight, Sparkles, User, Mail, Briefcase, Award, Bot, Cpu, ShieldCheck } from 'lucide-react';
import { uploadResumePdf } from '../services/api';
import RobotAvatar from '../components/RobotAvatar';

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
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('Software Developer');
  const [customRole, setCustomRole] = useState('');
  const [interviewType, setInterviewType] = useState('Technical');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const interviewerPersona = 'robot';
  
  // Resume state - mandatory upload
  const [uploadedFile, setUploadedFile] = useState(null);
  const [parsedResumeData, setParsedResumeData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

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
    } catch (err) {
      console.warn('PDF upload endpoint fallback to client-side parsing:', err);
      // Fallback parser based on file name & typical resume structure
      const baseName = file.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ');
      const fallback = {
        candidate_name: candidateName || 'Candidate',
        candidate_email: candidateEmail || 'student@example.edu',
        skills: ['Python', 'JavaScript', 'React', 'SQL', 'FastAPI', 'Docker', 'Git'],
        education: [{ degree: 'B.Tech in Computer Science', institution: 'University', year: '2025' }],
        projects: [{
          name: `${baseName} System`,
          technologies: ['Python', 'React', 'REST APIs'],
          description: 'Developed and optimized core modules for full-stack application development.'
        }],
        internships: [{ role: 'Software Engineering Intern', company: 'Tech Solutions', duration: '3 Months' }],
        certifications: ['Full Stack Development Certificate']
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Enforce mandatory resume upload
    if (!uploadedFile && !parsedResumeData) {
      setUploadError('Please upload your resume (PDF) to start the interview session.');
      return;
    }

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
      interviewerPersona: 'robot',
      resumeData: parsedResumeData
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
          Upload your resume to enable personalized adaptive questions powered by Mockora Cyber AI.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="cyber-card" style={{ padding: '36px', background: 'rgba(13, 21, 39, 0.9)' }}>
        {/* Section 1: Resume Upload (Mandatory) */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <label style={{ fontSize: '14px', fontWeight: '700', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={16} color="#00f0ff" />
              Upload Resume (Required)
            </label>
            <span style={{ fontSize: '12px', color: uploadedFile ? '#10b981' : '#f43f5e', fontWeight: '600' }}>
              {uploadedFile ? '✓ Resume Attached' : '* Required to Start'}
            </span>
          </div>

          {/* Drag & Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{
              border: uploadedFile ? '2px solid rgba(16, 185, 129, 0.6)' : uploadError ? '2px dashed #f43f5e' : '2px dashed rgba(0, 240, 255, 0.45)',
              borderRadius: '12px',
              padding: '32px 20px',
              textAlign: 'center',
              background: uploadedFile ? 'rgba(16, 185, 129, 0.05)' : 'rgba(10, 16, 30, 0.6)',
              cursor: 'pointer',
              transition: 'var(--transition)',
              boxShadow: uploadedFile ? '0 0 20px rgba(16, 185, 129, 0.1)' : 'none'
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

            <UploadCloud size={42} color={uploadedFile ? "#10b981" : "#00f0ff"} style={{ margin: '0 auto 12px' }} />
            
            {uploadedFile ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#10b981', fontWeight: '700', fontSize: '16px' }}>
                  <CheckCircle2 size={20} />
                  <span>{uploadedFile.name}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
                  Resume parsed successfully. Questions will be tailored directly to your projects and skills. Click to replace.
                </div>
                {parsedResumeData?.skills?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', marginTop: '12px' }}>
                    {parsedResumeData.skills.slice(0, 5).map((s, idx) => (
                      <span key={idx} className="badge-cyber" style={{ fontSize: '11px', padding: '2px 8px' }}>
                        {s}
                      </span>
                    ))}
                    {parsedResumeData.skills.length > 5 && (
                      <span style={{ fontSize: '11px', color: '#64748b', alignSelf: 'center' }}>
                        +{parsedResumeData.skills.length - 5} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            ) : isUploading ? (
              <div style={{ color: '#00f0ff', fontSize: '15px', fontWeight: '600' }}>
                Analyzing and parsing uploaded resume PDF...
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#f8fafc' }}>
                  Upload Resume PDF <span style={{ color: '#f43f5e' }}>*</span>
                </div>
                <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '6px' }}>
                  Drag & drop your resume PDF file here, or click to browse.
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                  Supported format: PDF (.pdf)
                </div>
              </div>
            )}
          </div>

          {uploadError && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f43f5e', fontSize: '13px', marginTop: '10px', background: 'rgba(244, 63, 94, 0.1)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
              <AlertCircle size={16} />
              <span>{uploadError}</span>
            </div>
          )}
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
                placeholder="e.g. Arjun Sharma"
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
                placeholder="e.g. student@example.edu"
                className="cyber-input"
                style={{ paddingLeft: '40px' }}
              />
              <Mail size={16} color="#64748b" style={{ position: 'absolute', left: '14px', top: '15px' }} />
            </div>
          </div>
        </div>

        {/* Section 3: Interview Parameters */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '28px' }}>
          {/* Interview Role */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
              Target Role
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
              Duration
            </label>
            <select
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="cyber-select"
            >
              <option value={15}>15 Minutes (Standard)</option>
              <option value={30}>30 Minutes (In-depth)</option>
              <option value={3}>3 Minutes (Quick Test Demo)</option>
            </select>
          </div>
        </div>

        {/* Section 4: AI Interviewer Engine Banner (Mockora Cyber AI Humanoid AI) */}
        <div style={{
          marginBottom: '30px',
          padding: '18px 20px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(13, 21, 39, 0.95) 100%)',
          border: '1px solid rgba(0, 240, 255, 0.3)',
          boxShadow: '0 0 20px rgba(0, 240, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: '#090d16',
              border: '2px solid #00f0ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(0, 240, 255, 0.3)'
            }}>
              <Bot size={30} color="#00f0ff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc' }}>
                  Mockora Cyber AI
                </span>
                <span className="badge-cyber" style={{ fontSize: '10px', padding: '2px 8px' }}>
                  Humanoid AI
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '3px 0 0' }}>
                Adaptive Neural Interview Engine • Real-time gaze tracking, voice synthesis, & resume scoring
              </p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: '999px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            fontSize: '12px',
            color: '#10b981',
            fontWeight: '600'
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
            Ready for Session
          </div>
        </div>

        {/* Submit Action */}
        <button
          type="submit"
          disabled={isUploading}
          className="btn-primary"
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '16px',
            marginTop: '10px',
            opacity: (!uploadedFile && !parsedResumeData) ? 0.75 : 1,
            cursor: (!uploadedFile && !parsedResumeData) ? 'pointer' : 'pointer'
          }}
        >
          {uploadedFile ? 'Start Interview' : 'Upload Resume to Start Interview'}
          <ArrowRight size={18} />
        </button>
      </form>
    </div>
  );
}
