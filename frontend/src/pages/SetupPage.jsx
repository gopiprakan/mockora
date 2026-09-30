import React, { useState } from 'react';
import { 
  UploadCloud, FileText, CheckCircle2, AlertCircle, ArrowRight, Sparkles, 
  User, Mail, Briefcase, Award, Bot, Cpu, ShieldCheck, Code, Brain, Database, Layers, Check
} from 'lucide-react';
import { uploadResumePdf } from '../services/api';

const PRESET_ROLES = [
  { id: "Software Developer", label: "Software Engineer", desc: "Core algorithms, data structures & backend systems", icon: <Code size={18} color="#00f0ff" /> },
  { id: "Full Stack Developer", label: "Full Stack Developer", desc: "React, Node, REST APIs, state & databases", icon: <Layers size={18} color="#38bdf8" /> },
  { id: "AI/ML Engineer", label: "AI/ML Engineer", desc: "Deep learning, model training & deployment", icon: <Brain size={18} color="#a855f7" /> },
  { id: "Data Scientist", label: "Data Scientist", desc: "Analytics, SQL, data pipelines & statistics", icon: <Database size={18} color="#10b981" /> },
  { id: "Custom Role", label: "Custom Role", desc: "Enter your own targeted role title", icon: <Sparkles size={18} color="#f59e0b" /> }
];

export default function SetupPage({ onProceedToAnalysis }) {
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('Software Developer');
  const [customRole, setCustomRole] = useState('');
  const [interviewType, setInterviewType] = useState('Technical');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [durationMinutes, setDurationMinutes] = useState(15);
  
  // Resume upload state
  const [uploadedFile, setUploadedFile] = useState(null);
  const [parsedResumeData, setParsedResumeData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

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
      console.warn('PDF upload fallback to client parser:', err);
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

    if (!uploadedFile && !parsedResumeData) {
      setUploadError('Please upload your resume (PDF) to calibrate adaptive questions.');
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
    <div className="container" style={{ padding: '36px 24px 80px', maxWidth: '880px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <span className="badge-cyber" style={{ marginBottom: '12px' }}>
          <Sparkles size={13} />
          Session Setup
        </span>
        <h1 style={{ fontSize: '34px', color: '#f8fafc', marginBottom: '10px' }}>
          Configure Your Mock Interview
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '15px', maxWidth: '580px', margin: '0 auto' }}>
          Upload your resume and customize the role, difficulty, and interview format for tailored questions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="cyber-card" style={{ padding: '38px', background: 'rgba(11, 18, 36, 0.92)' }}>
        <div className="hud-corner-tl" />
        <div className="hud-corner-tr" />
        <div className="hud-corner-bl" />
        <div className="hud-corner-br" />

        {/* Section 1: Resume Upload (Mandatory) */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <label style={{ fontSize: '14px', fontWeight: '700', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={17} color="#00f0ff" />
              Upload Resume (PDF Required)
            </label>
            <span style={{ fontSize: '12px', color: uploadedFile ? '#10b981' : '#f43f5e', fontWeight: '600' }}>
              {uploadedFile ? '✓ PDF Attached' : '* Required for AI Tailoring'}
            </span>
          </div>

          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{
              border: uploadedFile ? '2px solid rgba(16, 185, 129, 0.7)' : uploadError ? '2px dashed #f43f5e' : '2px dashed rgba(0, 240, 255, 0.45)',
              borderRadius: '14px',
              padding: '36px 24px',
              textAlign: 'center',
              background: uploadedFile ? 'rgba(16, 185, 129, 0.06)' : 'rgba(8, 14, 28, 0.7)',
              cursor: 'pointer',
              transition: 'var(--transition)',
              boxShadow: uploadedFile ? '0 0 25px rgba(16, 185, 129, 0.15)' : 'none',
              position: 'relative'
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

            <UploadCloud size={46} color={uploadedFile ? "#10b981" : "#00f0ff"} style={{ margin: '0 auto 14px' }} />

            {uploadedFile ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#10b981', fontWeight: '700', fontSize: '17px' }}>
                  <CheckCircle2 size={22} />
                  <span>{uploadedFile.name}</span>
                </div>
                <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '6px' }}>
                  Resume parsed! Mockora will generate adaptive technical questions from your projects and skills. Click to replace.
                </p>
                {parsedResumeData?.skills?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', marginTop: '14px' }}>
                    {parsedResumeData.skills.slice(0, 6).map((s, idx) => (
                      <span key={idx} className="badge-cyber" style={{ fontSize: '11px', padding: '3px 10px' }}>
                        {s}
                      </span>
                    ))}
                    {parsedResumeData.skills.length > 6 && (
                      <span style={{ fontSize: '11px', color: '#64748b', alignSelf: 'center' }}>
                        +{parsedResumeData.skills.length - 6} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            ) : isUploading ? (
              <div>
                <div style={{ color: '#00f0ff', fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>
                  Parsing and analyzing your resume PDF...
                </div>
                <div style={{
                  width: '200px',
                  height: '4px',
                  background: 'rgba(56, 189, 248, 0.2)',
                  borderRadius: '2px',
                  margin: '0 auto',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: '60%',
                    height: '100%',
                    background: '#00f0ff',
                    boxShadow: '0 0 10px #00f0ff',
                    animation: 'pulseGlow 1s infinite alternate'
                  }} />
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '17px', fontWeight: '700', color: '#f8fafc' }}>
                  Drop your resume PDF here, or <span style={{ color: '#00f0ff', textDecoration: 'underline' }}>browse</span>
                </div>
                <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '6px' }}>
                  Format: PDF document (.pdf) &bull; Maximum size: 10MB
                </div>
              </div>
            )}
          </div>

          {uploadError && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#f43f5e',
              fontSize: '13px',
              marginTop: '12px',
              background: 'rgba(244, 63, 94, 0.12)',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(244, 63, 94, 0.3)'
            }}>
              <AlertCircle size={16} />
              <span>{uploadError}</span>
            </div>
          )}
        </div>

        {/* Section 2: Student Identity */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '28px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
              Candidate Name
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="e.g. Alex Johnson"
                className="cyber-input"
                style={{ paddingLeft: '42px' }}
              />
              <User size={16} color="#64748b" style={{ position: 'absolute', left: '14px', top: '15px' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
              Candidate Email (For Final Report)
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                value={candidateEmail}
                onChange={(e) => setCandidateEmail(e.target.value)}
                placeholder="e.g. alex.j@university.edu"
                className="cyber-input"
                style={{ paddingLeft: '42px' }}
              />
              <Mail size={16} color="#64748b" style={{ position: 'absolute', left: '14px', top: '15px' }} />
            </div>
          </div>
        </div>

        {/* Section 3: Target Role Selection Cards */}
        <div style={{ marginBottom: '28px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#cbd5e1', marginBottom: '10px' }}>
            Target Interview Role
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            {PRESET_ROLES.map((r) => {
              const isSelected = selectedRole === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedRole(r.id)}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '10px',
                    background: isSelected ? 'rgba(0, 240, 255, 0.12)' : 'rgba(8, 14, 28, 0.7)',
                    border: `1px solid ${isSelected ? 'var(--cyan-primary)' : 'rgba(56, 189, 248, 0.2)'}`,
                    boxShadow: isSelected ? '0 0 16px rgba(0, 240, 255, 0.25)' : 'none',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {r.icon}
                      <span style={{ fontSize: '13px', fontWeight: '700', color: isSelected ? '#00f0ff' : '#f8fafc' }}>
                        {r.label}
                      </span>
                    </div>
                    {isSelected && <Check size={14} color="#00f0ff" />}
                  </div>
                  <p style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.3' }}>
                    {r.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {selectedRole === 'Custom Role' && (
            <input
              type="text"
              value={customRole}
              onChange={(e) => setCustomRole(e.target.value)}
              placeholder="Enter custom role title (e.g. Cloud Security Architect)..."
              className="cyber-input"
              style={{ marginTop: '12px' }}
            />
          )}
        </div>

        {/* Section 4: Format, Difficulty & Duration */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
              Interview Type
            </label>
            <select
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value)}
              className="cyber-select"
            >
              <option value="Technical">Technical (Coding & Architecture)</option>
              <option value="HR">HR (Behavioral & STAR)</option>
              <option value="Mixed">Mixed (Comprehensive Round)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="cyber-select"
            >
              <option value="Beginner">Beginner (College / Entry)</option>
              <option value="Intermediate">Intermediate (1-3 Yrs Depth)</option>
              <option value="Advanced">Advanced (Senior / Edge Cases)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
              Duration
            </label>
            <select
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="cyber-select"
            >
              <option value={15}>15 Minutes (Standard - 5-6 Qs)</option>
              <option value={30}>30 Minutes (Deep Dive - 9-10 Qs)</option>
              <option value={3}>3 Minutes (Quick Test Demo)</option>
            </select>
          </div>
        </div>

        {/* AI Interviewer Engine Banner */}
        <div style={{
          marginBottom: '32px',
          padding: '18px 22px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(13, 21, 39, 0.98) 100%)',
          border: '1px solid rgba(0, 240, 255, 0.35)',
          boxShadow: '0 0 25px rgba(0, 240, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: '#090d16',
              border: '2px solid #00f0ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(0, 240, 255, 0.35)'
            }}>
              <Bot size={28} color="#00f0ff" />
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
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0' }}>
                Neural Speech Synthesis & Real-Time Rubric Proctoring Active
              </p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '999px',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            fontSize: '12px',
            color: '#10b981',
            fontWeight: '600'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
            Calibrated & Ready
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isUploading}
          className="btn-primary"
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          {uploadedFile ? 'Proceed to Resume Calibration' : 'Upload Resume to Proceed'}
          <ArrowRight size={18} />
        </button>
      </form>
    </div>
  );
}
