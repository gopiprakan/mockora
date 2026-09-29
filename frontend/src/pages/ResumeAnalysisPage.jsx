import React, { useState, useEffect } from 'react';
import RobotAvatar from '../components/RobotAvatar';
import { Sparkles, Code2, FolderGit2, GraduationCap, Briefcase, Award, ArrowRight, CheckCircle2 } from 'lucide-react';
import { analyzeResume } from '../services/api';

export default function ResumeAnalysisPage({ setupConfig, onStartLiveInterview }) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [extractedData, setExtractedData] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(15);

  useEffect(() => {
    let timer1, timer2, timer3;

    async function runAnalysis() {
      // Progress animation
      timer1 = setTimeout(() => setAnalysisProgress(50), 600);
      timer2 = setTimeout(() => setAnalysisProgress(85), 1400);

      try {
        if (setupConfig.resumeData) {
          setExtractedData(setupConfig.resumeData);
        } else {
          const res = await analyzeResume({
            sample_id: setupConfig.sampleId || 'traffic_ai'
          });
          setExtractedData(res.resume_data);
        }
      } catch (err) {
        console.warn('Error during resume analysis:', err);
      } finally {
        timer3 = setTimeout(() => {
          setAnalysisProgress(100);
          setIsAnalyzing(false);
        }, 2200);
      }
    }

    runAnalysis();

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [setupConfig]);

  const skills = extractedData?.skills || ['Python', 'TensorFlow', 'FastAPI', 'Docker', 'PostgreSQL', 'Git'];
  const projects = extractedData?.projects || [{
    name: 'AI Smart Traffic Management System',
    technologies: ['Python', 'TensorFlow', 'OpenCV'],
    description: 'Dynamic traffic signal control based on real-time vehicle density analysis.'
  }];
  const education = extractedData?.education || [{
    degree: 'B.Tech in Computer Science & Engineering',
    institution: 'National Institute of Technology',
    year: '2025'
  }];
  const internships = extractedData?.internships || [{
    role: 'Computer Vision Intern',
    company: 'NeuralSense Analytics',
    duration: '6 Months'
  }];
  const certifications = extractedData?.certifications || [
    'Deep Learning Specialization',
    'TensorFlow Developer Certificate'
  ];

  return (
    <div className="container" style={{ padding: '30px 24px 80px', maxWidth: '960px' }}>
      {/* Top Status & Mockora Cyber AI Robot Avatar Animation */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <RobotAvatar status={isAnalyzing ? 'thinking' : 'idle'} size={240} showStatusBadge={false} />

        <div style={{ marginTop: '20px' }}>
          {isAnalyzing ? (
            <>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="badge-cyber" style={{ fontSize: '11px' }}>
                  <Sparkles size={13} />
                  Mockora Cyber AI • Humanoid AI Engine
                </span>
              </div>
              <h1 style={{ fontSize: '28px', color: '#f8fafc', marginBottom: '8px' }}>
                Analyzing your resume...
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '16px' }}>
                Mockora is parsing your projects, core technologies, and domain experience to build adaptive questions.
              </p>

              {/* Progress Bar */}
              <div style={{
                maxWidth: '420px',
                height: '6px',
                background: '#0f172a',
                borderRadius: '3px',
                margin: '0 auto',
                overflow: 'hidden',
                border: '1px solid rgba(56, 189, 248, 0.2)'
              }}>
                <div style={{
                  width: `${analysisProgress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #00f0ff, #a855f7)',
                  boxShadow: '0 0 10px #00f0ff',
                  transition: 'width 0.4s ease'
                }} />
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#10b981', marginBottom: '8px' }}>
                <CheckCircle2 size={24} />
                <span style={{ fontSize: '26px', fontWeight: '700', color: '#f8fafc' }}>
                  Your personalized interview is ready.
                </span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>
                Mockora Cyber AI has calibrated questions tailored to your resume for the <strong style={{ color: '#38bdf8' }}>{setupConfig.role}</strong> role.
              </p>

              <button
                onClick={() => onStartLiveInterview(extractedData)}
                className="btn-primary"
                style={{ padding: '14px 40px', fontSize: '16px', boxShadow: '0 0 25px rgba(0, 240, 255, 0.4)' }}
              >
                Start Interview Session
                <ArrowRight size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Extracted Information Display Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        opacity: isAnalyzing ? 0.6 : 1,
        transition: 'opacity 0.5s ease'
      }}>
        {/* Card 1: Skills */}
        <div className="cyber-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Code2 size={20} color="#00f0ff" />
            <h3 style={{ fontSize: '16px', color: '#f8fafc' }}>Extracted Skills</h3>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {skills.map((s, idx) => (
              <span key={idx} className="badge-cyber" style={{ fontSize: '11px', padding: '3px 10px' }}>
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Card 2: Projects */}
        <div className="cyber-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <FolderGit2 size={20} color="#a855f7" />
            <h3 style={{ fontSize: '16px', color: '#f8fafc' }}>Highlighted Projects</h3>
          </div>
          {projects.map((p, idx) => (
            <div key={idx} style={{ marginBottom: idx < projects.length - 1 ? '14px' : '0' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#38bdf8' }}>{p.name}</div>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 6px', lineHeight: '1.4' }}>
                {p.description}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {p.technologies?.map((tech, tidx) => (
                  <span key={tidx} style={{ fontSize: '10px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '2px 6px', borderRadius: '4px', color: '#cbd5e1' }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Card 3: Education */}
        <div className="cyber-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <GraduationCap size={20} color="#10b981" />
            <h3 style={{ fontSize: '16px', color: '#f8fafc' }}>Education</h3>
          </div>
          {education.map((edu, idx) => (
            <div key={idx} style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#f8fafc' }}>{edu.degree}</div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>{edu.institution} {edu.year ? `(${edu.year})` : ''}</div>
              {edu.score && <div style={{ fontSize: '11px', color: '#10b981', marginTop: '2px' }}>{edu.score}</div>}
            </div>
          ))}
        </div>

        {/* Card 4: Internships */}
        <div className="cyber-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Briefcase size={20} color="#f59e0b" />
            <h3 style={{ fontSize: '16px', color: '#f8fafc' }}>Internships / Experience</h3>
          </div>
          {internships.map((intern, idx) => (
            <div key={idx} style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#f8fafc' }}>{intern.role}</div>
              <div style={{ fontSize: '12px', color: '#f59e0b' }}>{intern.company} &bull; {intern.duration}</div>
              {intern.description && (
                <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{intern.description}</p>
              )}
            </div>
          ))}
        </div>

        {/* Card 5: Certifications */}
        <div className="cyber-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Award size={20} color="#00f0ff" />
            <h3 style={{ fontSize: '16px', color: '#f8fafc' }}>Certifications</h3>
          </div>
          <ul style={{ paddingLeft: '18px', margin: 0, color: '#cbd5e1', fontSize: '13px', lineHeight: '1.6' }}>
            {certifications.map((c, idx) => (
              <li key={idx}>{c}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
