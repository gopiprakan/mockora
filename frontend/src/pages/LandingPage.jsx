import React, { useState } from 'react';
import RobotAvatar from '../components/RobotAvatar';
import { 
  ArrowRight, Sparkles, FileText, CheckCircle2, BarChart2, ShieldCheck, 
  Zap, X, Mic, Video, Award, ChevronRight, Play, Volume2, Cpu, Brain, Terminal
} from 'lucide-react';

export default function LandingPage({ onStartInterview }) {
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [previewStatus, setPreviewStatus] = useState('speaking');

  const features = [
    {
      icon: <FileText size={24} color="#00f0ff" />,
      title: "100% Resume-Adaptive",
      description: "Mockora parses your uploaded PDF resume, extracts projects, tech stacks, and domain skills to ask deeply relevant questions."
    },
    {
      icon: <Mic size={24} color="#a855f7" />,
      title: "Real-Time Speech-to-Text",
      description: "Speak your answers naturally. Real-time transcription captures your thoughts with instant editing fallback options."
    },
    {
      icon: <Video size={24} color="#10b981" />,
      title: "Visual & Pacing HUD",
      description: "Tracks camera engagement, speech cadence, long pauses, and filler words to elevate your delivery under pressure."
    },
    {
      icon: <BarChart2 size={24} color="#38bdf8" />,
      title: "6-Axis Rubric Scoring",
      description: "Get evaluated on Technical Knowledge, Problem Solving, Communication, Answer Relevance, and Structure with Senior Model Answers."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Upload Your Resume",
      desc: "Attach your resume PDF. Mockora scans your education, internships, and primary code repositories."
    },
    {
      number: "02",
      title: "Configure Session",
      desc: "Choose your target role (Full Stack, AI/ML, Data Science, etc.), difficulty, and time limit."
    },
    {
      number: "03",
      title: "Face the AI Interviewer",
      desc: "Engage in live speech interaction with adaptive follow-up questions tailored to your responses."
    },
    {
      number: "04",
      title: "Receive Detailed Report",
      desc: "Unlock scores, strengths, improvement areas, model answers, and email your PDF breakdown."
    }
  ];

  return (
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      {/* Hero Section */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        alignItems: 'center',
        gap: '48px',
        minHeight: '520px',
        marginBottom: '80px',
        position: 'relative'
      }}>
        {/* Left Column: Copy & Actions */}
        <div>
          <div style={{ marginBottom: '16px' }}>
            <span className="badge-cyber" style={{ padding: '6px 14px' }}>
              <Sparkles size={14} />
              Next-Gen AI Interview Coaching
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(42px, 5.5vw, 66px)',
            lineHeight: '1.08',
            marginBottom: '20px',
            letterSpacing: '-0.03em'
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #38bdf8 50%, #00f0ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'block'
            }}>
              MOCKORA
            </span>
            <span style={{ fontSize: 'clamp(26px, 3.6vw, 38px)', color: '#cbd5e1', fontWeight: '500' }}>
              Your AI Interview Coach
            </span>
          </h1>

          <p style={{
            fontSize: '18px',
            color: '#94a3b8',
            lineHeight: '1.6',
            maxWidth: '540px',
            marginBottom: '36px'
          }}>
            Practice live technical & HR mock interviews with an adaptive humanoid AI. Get instantaneous rubric feedback, speech cadence analytics, and custom model answers.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
            <button
              onClick={onStartInterview}
              className="btn-primary"
              style={{ padding: '16px 36px', fontSize: '15px' }}
            >
              Start Interview
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => setShowHowItWorks(true)}
              className="btn-secondary"
              style={{ padding: '15px 30px', fontSize: '15px' }}
            >
              <Zap size={16} color="#00f0ff" />
              How It Works
            </button>
          </div>

          {/* Social Proof & Metrics Badges */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            marginTop: '45px',
            paddingTop: '25px',
            borderTop: '1px solid rgba(56, 189, 248, 0.15)'
          }}>
            <div>
              <div style={{ fontSize: '26px', fontWeight: '800', color: '#00f0ff', fontFamily: 'var(--font-heading)' }}>100%</div>
              <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Resume Adaptive</div>
            </div>
            <div>
              <div style={{ fontSize: '26px', fontWeight: '800', color: '#a855f7', fontFamily: 'var(--font-heading)' }}>6-Axis</div>
              <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Rubric Scoring</div>
            </div>
            <div>
              <div style={{ fontSize: '26px', fontWeight: '800', color: '#10b981', fontFamily: 'var(--font-heading)' }}>Real-Time</div>
              <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Voice & Gaze HUD</div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Robot Interviewer Preview Widget */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          <div className="cyber-card" style={{
            width: '100%',
            maxWidth: '430px',
            padding: '36px 24px',
            textAlign: 'center',
            background: 'radial-gradient(circle at 50% 30%, rgba(15, 23, 42, 0.95) 0%, rgba(6, 9, 19, 0.98) 100%)',
            border: '1px solid rgba(0, 240, 255, 0.35)',
            boxShadow: '0 25px 60px rgba(0, 240, 255, 0.18)'
          }}>
            <div className="hud-corner-tl" />
            <div className="hud-corner-tr" />
            <div className="hud-corner-bl" />
            <div className="hud-corner-br" />

            {/* Robot Avatar */}
            <RobotAvatar status={previewStatus} size={270} showStatusBadge={true} />

            {/* Live Interactive State Toggles */}
            <div style={{ marginTop: '24px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
                Test Live AI Interviewer States
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setPreviewStatus('speaking')}
                  className={previewStatus === 'speaking' ? 'btn-primary' : 'btn-secondary'}
                  style={{ padding: '6px 14px', fontSize: '12px' }}
                >
                  Speaking
                </button>
                <button
                  onClick={() => setPreviewStatus('listening')}
                  className={previewStatus === 'listening' ? 'btn-primary' : 'btn-secondary'}
                  style={{ padding: '6px 14px', fontSize: '12px' }}
                >
                  Listening
                </button>
                <button
                  onClick={() => setPreviewStatus('thinking')}
                  className={previewStatus === 'thinking' ? 'btn-primary' : 'btn-secondary'}
                  style={{ padding: '6px 14px', fontSize: '12px' }}
                >
                  Thinking
                </button>
                <button
                  onClick={() => setPreviewStatus('idle')}
                  className={previewStatus === 'idle' ? 'btn-primary' : 'btn-secondary'}
                  style={{ padding: '6px 14px', fontSize: '12px' }}
                >
                  Idle
                </button>
              </div>
            </div>

            {/* Speech bubble demo */}
            <div style={{
              marginTop: '20px',
              padding: '12px 16px',
              borderRadius: '10px',
              background: 'rgba(8, 14, 28, 0.8)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              fontSize: '13px',
              color: '#cbd5e1',
              fontStyle: 'italic',
              lineHeight: '1.4'
            }}>
              "{previewStatus === 'speaking' ? 'Welcome to Mockora! Tell me about the architecture of your primary project.' :
                previewStatus === 'listening' ? 'I am listening to your live response and analyzing your solution depth...' :
                previewStatus === 'thinking' ? 'Evaluating your architectural trade-offs against industry benchmarks...' :
                'Ready to begin your tailored interview session when you are.'}"
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section style={{ marginBottom: '90px' }}>
        <div style={{ textAlign: 'center', marginBottom: '45px' }}>
          <span className="badge-purple" style={{ marginBottom: '10px' }}>
            <Brain size={14} />
            Built For Placement Excellence
          </span>
          <h2 style={{ fontSize: '34px', color: '#f8fafc', marginBottom: '12px' }}>
            Engineered to Help You Crack Technical Rounds
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
            Unlike generic mock interview platforms, Mockora drills into your actual code repositories, algorithms, and design choices.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px'
        }}>
          {features.map((feat, idx) => (
            <div key={idx} className="cyber-card cyber-card-interactive" style={{ padding: '32px 24px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: 'rgba(10, 18, 36, 0.9)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                boxShadow: '0 0 15px rgba(0, 240, 255, 0.15)'
              }}>
                {feat.icon}
              </div>

              <h3 style={{ fontSize: '19px', color: '#f8fafc', marginBottom: '10px' }}>
                {feat.title}
              </h3>

              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6' }}>
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Step-by-Step Workflow */}
      <section style={{ marginBottom: '80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '45px' }}>
          <span className="badge-cyber" style={{ marginBottom: '10px' }}>
            <Terminal size={14} />
            How It Works
          </span>
          <h2 style={{ fontSize: '34px', color: '#f8fafc', marginBottom: '12px' }}>
            Your 4-Step Journey to Confidence
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px'
        }}>
          {steps.map((s, idx) => (
            <div key={idx} className="cyber-card" style={{ padding: '28px 22px', position: 'relative' }}>
              <div style={{
                fontSize: '38px',
                fontFamily: 'var(--font-heading)',
                fontWeight: '900',
                color: 'rgba(0, 240, 255, 0.2)',
                lineHeight: '1',
                marginBottom: '14px'
              }}>
                {s.number}
              </div>

              <h3 style={{ fontSize: '17px', color: '#f8fafc', marginBottom: '8px' }}>
                {s.title}
              </h3>

              <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action Box */}
      <section className="cyber-card cyber-card-glow" style={{
        padding: '50px 30px',
        textAlign: 'center',
        borderRadius: '20px',
        position: 'relative'
      }}>
        <div className="hud-corner-tl" />
        <div className="hud-corner-tr" />
        <div className="hud-corner-bl" />
        <div className="hud-corner-br" />

        <h2 style={{ fontSize: '32px', color: '#f8fafc', marginBottom: '14px' }}>
          Ready to Test Your Readiness?
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '16px', maxWidth: '560px', margin: '0 auto 30px' }}>
          Upload your resume and start a 15-minute simulated interview session with Mockora AI coach now.
        </p>

        <button
          onClick={onStartInterview}
          className="btn-primary"
          style={{ padding: '16px 42px', fontSize: '16px' }}
        >
          Begin Mock Interview Now
          <ArrowRight size={18} />
        </button>
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
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="cyber-card" style={{
            maxWidth: '680px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
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
                cursor: 'pointer',
                padding: '6px'
              }}
            >
              <X size={22} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <Sparkles size={24} color="#00f0ff" />
              <h2 style={{ fontSize: '24px', color: '#f8fafc' }}>How Mockora Works</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.15)' }}>
                <h4 style={{ color: '#00f0ff', marginBottom: '6px', fontSize: '16px' }}>1. Deep Resume Extraction</h4>
                <p>Mockora reads your PDF resume using AI parsing. It identifies technical skills, project architectures, internships, and certifications.</p>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.15)' }}>
                <h4 style={{ color: '#a855f7', marginBottom: '6px', fontSize: '16px' }}>2. Dynamic Question Generation</h4>
                <p>Instead of generic static lists, the AI formulates targeted questions. For example: "In your project [Traffic AI], why did you choose OpenCV over YOLO for vehicle tracking?"</p>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.15)' }}>
                <h4 style={{ color: '#10b981', marginBottom: '6px', fontSize: '16px' }}>3. Multi-Modal Live Proctoring</h4>
                <p>During the session, speech recognition captures your voice, while the camera monitor evaluates eye contact, filler words (um/uh), and pause durations.</p>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.15)' }}>
                <h4 style={{ color: '#38bdf8', marginBottom: '6px', fontSize: '16px' }}>4. Actionable Rubric Scorecard</h4>
                <p>Upon finishing, you receive scores across 6 key metrics, a study guide with recommended topics, and ideal senior model answers for each question.</p>
              </div>
            </div>

            <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => setShowHowItWorks(false)}
                className="btn-secondary"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowHowItWorks(false);
                  onStartInterview();
                }}
                className="btn-primary"
              >
                Start Interview Now
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
