import React, { useState, useEffect } from 'react';
import RobotAvatar from '../components/RobotAvatar';
import { 
  Sparkles, Code2, FolderGit2, GraduationCap, Briefcase, Award, 
  ArrowRight, CheckCircle2, Cpu, Terminal, Layers, Check, ShieldCheck
} from 'lucide-react';
import { analyzeResume } from '../services/api';

export default function ResumeAnalysisPage({ setupConfig, onStartLiveInterview }) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [extractedData, setExtractedData] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(20);

  useEffect(() => {
    let timer1, timer2, timer3;

    async function runAnalysis() {
      timer1 = setTimeout(() => setAnalysisProgress(55), 500);
      timer2 = setTimeout(() => setAnalysisProgress(88), 1200);

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
        }, 1900);
      }
    }

    runAnalysis();

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [setupConfig]);

  const skills = extractedData?.skills || ['Python', 'TensorFlow', 'FastAPI', 'Docker', 'PostgreSQL', 'Git', 'REST APIs'];
  const projects = extractedData?.projects || [{
    name: 'AI Smart Traffic Management System',
    technologies: ['Python', 'TensorFlow', 'OpenCV'],
    description: 'Dynamic traffic signal control based on real-time vehicle density analysis with multi-camera stream synchronization.'
  }];
  const education = extractedData?.education || [{
    degree: 'B.Tech in Computer Science & Engineering',
    institution: 'National Institute of Technology',
    year: '2025'
  }];
  const internships = extractedData?.internships || [{
    role: 'Computer Vision Intern',
    company: 'NeuralSense Analytics',
    duration: '6 Months',
    description: 'Trained model inference pipelines and reduced batch latency by 24%.'
  }];
  const certifications = extractedData?.certifications || [
    'Deep Learning Specialization',
    'TensorFlow Developer Certificate'
  ];

  return (
    <div className="container" style={{ padding: '36px 24px 80px', maxWidth: '980px' }}>
      {/* Top Status & AI Avatar Scanning Presentation */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <RobotAvatar status={isAnalyzing ? 'thinking' : 'idle'} size={250} showStatusBadge={false} />

        <div style={{ marginTop: '22px' }}>
          {isAnalyzing ? (
            <>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span className="badge-purple" style={{ fontSize: '12px' }}>
                  <Cpu size={14} />
                  Neural Semantic Parser Running
                </span>
              </div>
              <h1 style={{ fontSize: '32px', color: '#f8fafc', marginBottom: '10px' }}>
                Analyzing Your Resume & Projects...
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '15px', maxWidth: '580px', margin: '0 auto 20px' }}>
                Mockora is extracting your core architectures, algorithmic design patterns, and tech stacks to generate personalized adaptive questions.
              </p>

              {/* Progress Bar with Percentage */}
              <div style={{ maxWidth: '440px', margin: '0 auto' }}>
                <div style={{
                  height: '8px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  marginBottom: '8px'
                }}>
                  <div style={{
                    width: `${analysisProgress}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #00f0ff, #a855f7)',
                    boxShadow: '0 0 14px #00f0ff',
                    transition: 'width 0.4s ease'
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b' }}>
                  <span>Parsing AST & Semantic Entities</span>
                  <span style={{ color: '#00f0ff', fontWeight: '700' }}>{analysisProgress}%</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#10b981', marginBottom: '10px' }}>
                <span className="badge-green" style={{ fontSize: '13px', padding: '6px 16px' }}>
                  <CheckCircle2 size={16} />
                  Resume Calibration Complete
                </span>
              </div>
              <h1 style={{ fontSize: '32px', color: '#f8fafc', marginBottom: '8px' }}>
                Your Personalized Interview is Ready
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '15px', maxWidth: '600px', margin: '0 auto 24px' }}>
                Mockora Cyber AI has calibrated question paths for the <strong style={{ color: '#38bdf8' }}>{setupConfig.role}</strong> role based on your highlighted projects.
              </p>

              <button
                onClick={() => onStartLiveInterview(extractedData)}
                className="btn-primary"
                style={{
                  padding: '16px 44px',
                  fontSize: '16px',
                  boxShadow: '0 0 35px rgba(0, 240, 255, 0.5)'
                }}
              >
                Start Live Interview Session
                <ArrowRight size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Extracted Intelligence Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '22px',
        opacity: isAnalyzing ? 0.5 : 1,
        transition: 'opacity 0.4s ease'
      }}>
        {/* Card 1: Extracted Skills Cloud */}
        <div className="cyber-card" style={{ padding: '26px' }}>
          <div className="hud-corner-tl" />
          <div className="hud-corner-tr" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Code2 size={20} color="#00f0ff" />
            <h3 style={{ fontSize: '17px', color: '#f8fafc' }}>Extracted Skills & Tools</h3>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {skills.map((s, idx) => (
              <span key={idx} className="badge-cyber" style={{ fontSize: '12px', padding: '4px 12px' }}>
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Card 2: Highlighted Projects & Focus Points */}
        <div className="cyber-card" style={{ padding: '26px' }}>
          <div className="hud-corner-tl" />
          <div className="hud-corner-tr" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <FolderGit2 size={20} color="#a855f7" />
            <h3 style={{ fontSize: '17px', color: '#f8fafc' }}>Targeted Project Focus</h3>
          </div>
          {projects.map((p, idx) => (
            <div key={idx} style={{ marginBottom: idx < projects.length - 1 ? '16px' : '0' }}>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#38bdf8' }}>{p.name}</div>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 8px', lineHeight: '1.5' }}>
                {p.description}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {p.technologies?.map((tech, tidx) => (
                  <span key={tidx} style={{
                    fontSize: '11px',
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    color: '#cbd5e1'
                  }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Card 3: Internships / Work Experience */}
        <div className="cyber-card" style={{ padding: '26px' }}>
          <div className="hud-corner-tl" />
          <div className="hud-corner-tr" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Briefcase size={20} color="#f59e0b" />
            <h3 style={{ fontSize: '17px', color: '#f8fafc' }}>Internships / Experience</h3>
          </div>
          {internships.map((intern, idx) => (
            <div key={idx} style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#f8fafc' }}>{intern.role}</div>
              <div style={{ fontSize: '12px', color: '#f59e0b', marginTop: '2px' }}>{intern.company} &bull; {intern.duration}</div>
              {intern.description && (
                <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px', lineHeight: '1.4' }}>{intern.description}</p>
              )}
            </div>
          ))}
        </div>

        {/* Card 4: Education & Certifications */}
        <div className="cyber-card" style={{ padding: '26px' }}>
          <div className="hud-corner-tl" />
          <div className="hud-corner-tr" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <GraduationCap size={20} color="#10b981" />
            <h3 style={{ fontSize: '17px', color: '#f8fafc' }}>Education & Certifications</h3>
          </div>
          {education.map((edu, idx) => (
            <div key={idx} style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#f8fafc' }}>{edu.degree}</div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>{edu.institution} {edu.year ? `(${edu.year})` : ''}</div>
            </div>
          ))}
          {certifications?.length > 0 && (
            <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(56, 189, 248, 0.15)' }}>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>Certifications</div>
              <ul style={{ paddingLeft: '16px', margin: 0, color: '#cbd5e1', fontSize: '12px' }}>
                {certifications.map((c, idx) => (
                  <li key={idx} style={{ marginBottom: '3px' }}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
