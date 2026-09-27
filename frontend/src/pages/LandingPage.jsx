import React, { useState } from 'react';
import RobotAvatar from '../components/RobotAvatar';
import { ArrowRight, Sparkles, FileText, CheckCircle2, BarChart2, ShieldCheck, Zap, X } from 'lucide-react';

export default function LandingPage({ onStartInterview }) {
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [previewStatus, setPreviewStatus] = useState('idle');

  return (
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      {/* Hero Section */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        alignItems: 'center',
        gap: '40px',
        minHeight: '480px',
        marginBottom: '60px'
      }}>
        {/* Left Column: Copy & Actions */}
        <div>
          <div style={{ marginBottom: '16px' }}>
            <span className="badge-cyber">
              <Sparkles size={13} />
              Next-Gen AI Interview Coaching
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(40px, 5vw, 62px)',
            lineHeight: '1.08',
            marginBottom: '18px',
            letterSpacing: '-0.03em'
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #38bdf8 50%, #00f0ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'block'
            }}>
              INTERVEXA
            </span>
            <span style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', color: '#cbd5e1', fontWeight: '500' }}>
              Your AI Interview Coach
            </span>
          </h1>

          <p style={{
            fontSize: '18px',
            color: '#94a3b8',
            lineHeight: '1.6',
            maxWidth: '520px',
            marginBottom: '32px'
          }}>
            Practice real interviews. Get instant feedback. Improve your confidence.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
            <button
              onClick={onStartInterview}
              className="btn-primary"
              style={{ padding: '15px 34px', fontSize: '16px' }}
            >
              Start Interview
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => setShowHowItWorks(true)}
              className="btn-secondary"
              style={{ padding: '14px 28px', fontSize: '15px' }}
            >
              How It Works
            </button>
          </div>

          {/* Social Proof Stats */}
          <div style={{
            display: 'flex',
            gap: '30px',
            marginTop: '45px',
            paddingTop: '25px',
            borderTop: '1px solid rgba(56, 189, 248, 0.12)'
          }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#00f0ff' }}>100%</div>
              <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Resume Adaptive</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#a855f7' }}>6-Axis</div>
              <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Rubric Scoring</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#10b981' }}>Live Voice</div>
              <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Speech-to-Text</div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Robot Interviewer Preview */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          <div className="cyber-card" style={{
            width: '100%',
            maxWidth: '420px',
            padding: '40px 24px',
            textAlign: 'center',
            background: 'radial-gradient(circle at 50% 40%, rgba(13, 21, 39, 0.9) 0%, rgba(6, 9, 19, 0.95) 100%)',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            boxShadow: '0 20px 50px rgba(0, 240, 255, 0.15)'
          }}>
            {/* Robot Avatar */}
            <RobotAvatar status={previewStatus} size={280} showStatusBadge={true} />

            <div style={{ marginTop: '24px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
                Try Intervexa Robot States
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                {['idle', 'listening', 'thinking', 'speaking'].map(s => (
                  <button
                    key={s}
                    onClick={() => setPreviewStatus(s)}
                    style={{
                      padding: '4px 10px',
                      fontSize: '11px',
                      borderRadius: '6px',
                      background: previewStatus === s ? 'rgba(0, 240, 255, 0.2)' : 'rgba(15, 23, 42, 0.7)',
                      border: `1px solid ${previewStatus === s ? '#00f0ff' : 'rgba(56, 189, 248, 0.2)'}`,
                      color: previewStatus === s ? '#00f0ff' : '#94a3b8',
                      cursor: 'pointer',
                      textTransform: 'capitalize'
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Feature Cards */}
      <section style={{ marginTop: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h2 style={{ fontSize: '28px', color: '#f8fafc', marginBottom: '8px' }}>
            Built Specifically for Freshers & College Students
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '15px' }}>
            Transform your interview anxiety into clear, structured, confident answers.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {/* Card 1: Resume-Based Questions */}
          <div className="cyber-card" style={{ padding: '30px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'rgba(0, 240, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              border: '1px solid rgba(0, 240, 255, 0.3)'
            }}>
              <FileText size={24} color="#00f0ff" />
            </div>
            <h3 style={{ fontSize: '20px', color: '#f8fafc', marginBottom: '10px' }}>
              Resume-Based Questions
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6' }}>
              Intervexa analyzes your projects, technologies, internships, and certifications. Questions adapt dynamically to your stated tech stack.
            </p>
          </div>

          {/* Card 2: AI Interview Evaluation */}
          <div className="cyber-card" style={{ padding: '30px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'rgba(168, 85, 247, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              border: '1px solid rgba(168, 85, 247, 0.3)'
            }}>
              <Zap size={24} color="#a855f7" />
            </div>
            <h3 style={{ fontSize: '20px', color: '#f8fafc', marginBottom: '10px' }}>
              AI Interview Evaluation
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6' }}>
              Every answer is evaluated across 6 core criteria: Technical Accuracy, Relevance, Communication, Structure, Problem Solving, and Examples.
            </p>
          </div>

          {/* Card 3: Detailed Performance Report */}
          <div className="cyber-card" style={{ padding: '30px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              <BarChart2 size={24} color="#10b981" />
            </div>
            <h3 style={{ fontSize: '20px', color: '#f8fafc', marginBottom: '10px' }}>
              Detailed Performance Report
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6' }}>
              Gain comprehensive insights including personalized strengths, areas to improve, recommended study topics, and email delivery.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Modal */}
      {showHowItWorks && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(2, 6, 18, 0.88)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="cyber-card" style={{
            maxWidth: '620px',
            width: '100%',
            padding: '36px',
            background: '#0d1527',
            border: '1px solid rgba(0, 240, 255, 0.4)',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowHowItWorks(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer'
              }}
            >
              <X size={22} />
            </button>

            <h2 style={{ fontSize: '24px', color: '#f8fafc', marginBottom: '8px' }}>
              How Intervexa Works
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>
              A 4-step streamlined journey to landing your dream software role.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', gap: '14px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(0, 240, 255, 0.2)',
                  color: '#00f0ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  flexShrink: 0
                }}>1</div>
                <div>
                  <h4 style={{ color: '#f8fafc', fontSize: '16px', marginBottom: '4px' }}>Upload Your Resume</h4>
                  <p style={{ color: '#94a3b8', fontSize: '13px' }}>Upload your PDF or select from quick pre-built samples. Intervexa parses your skills, projects, and coursework.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(0, 240, 255, 0.2)',
                  color: '#00f0ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  flexShrink: 0
                }}>2</div>
                <div>
                  <h4 style={{ color: '#f8fafc', fontSize: '16px', marginBottom: '4px' }}>Configure Your Role & Duration</h4>
                  <p style={{ color: '#94a3b8', fontSize: '13px' }}>Select between 15 or 30 minute sessions, Technical, HR, or Mixed interview types, and your target engineering role.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(0, 240, 255, 0.2)',
                  color: '#00f0ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  flexShrink: 0
                }}>3</div>
                <div>
                  <h4 style={{ color: '#f8fafc', fontSize: '16px', marginBottom: '4px' }}>Voice Interview with Humanoid AI</h4>
                  <p style={{ color: '#94a3b8', fontSize: '13px' }}>Answer with your microphone or keyboard. The AI listens, looks toward you, and generates adaptive follow-up questions in real-time.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(0, 240, 255, 0.2)',
                  color: '#00f0ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  flexShrink: 0
                }}>4</div>
                <div>
                  <h4 style={{ color: '#f8fafc', fontSize: '16px', marginBottom: '4px' }}>Instant Diagnostic Report & Email</h4>
                  <p style={{ color: '#94a3b8', fontSize: '13px' }}>Receive your practice score (0-100), STAR feedback for each question, model answers, and have the full report sent to your email.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => { setShowHowItWorks(false); onStartInterview(); }}
              className="btn-primary"
              style={{ width: '100%', marginTop: '28px' }}
            >
              Get Started Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
