import React, { useState, useEffect } from 'react';
import sarahImg from '../assets/interviewers/sarah.jpg';
import alexImg from '../assets/interviewers/alex.jpg';
import priyaImg from '../assets/interviewers/priya.jpg';
import marcusImg from '../assets/interviewers/marcus.jpg';
import RobotAvatar from './RobotAvatar';
import { Volume2, Sparkles, UserCheck, RefreshCw, Radio, Eye } from 'lucide-react';

export const INTERVIEWER_PERSONAS = [
  {
    id: 'sarah',
    name: 'Sarah Chen',
    title: 'Staff AI Engineer & Lead Interviewer',
    company: 'TechCorp AI',
    image: sarahImg,
    tag: 'Technical & ML'
  },
  {
    id: 'alex',
    name: 'Alex Rivera',
    title: 'Principal Systems Architect',
    company: 'CloudScale Inc.',
    image: alexImg,
    tag: 'System Design & Backend'
  },
  {
    id: 'priya',
    name: 'Priya Sharma',
    title: 'Engineering Director & Hiring Lead',
    company: 'Innovate Labs',
    image: priyaImg,
    tag: 'Full Stack & Leadership'
  },
  {
    id: 'marcus',
    name: 'Marcus Vance',
    title: 'Senior Tech Director & Architect',
    company: 'Global Enterprises',
    image: marcusImg,
    tag: 'Architecture & Behavioral'
  },
  {
    id: 'robot',
    name: 'Mockora Cyber AI',
    title: 'Adaptive Neural Interview Engine',
    company: 'Mockora Platform',
    image: null,
    tag: 'Humanoid AI'
  }
];

export default function InterviewerFace({
  status = 'idle', // 'speaking', 'listening', 'thinking', 'idle'
  selectedInterviewerId = 'sarah',
  onInterviewerChange,
  onReplayAudio
}) {
  const [currentId, setCurrentId] = useState(selectedInterviewerId || 'sarah');
  const [audioBars, setAudioBars] = useState([12, 24, 38, 20, 10, 30, 18]);
  const [isNodding, setIsNodding] = useState(false);

  // Sync external changes
  useEffect(() => {
    if (selectedInterviewerId) {
      setCurrentId(selectedInterviewerId);
    }
  }, [selectedInterviewerId]);

  // Audio equalizer oscillation when speaking
  useEffect(() => {
    if (status !== 'speaking') return;
    const interval = setInterval(() => {
      setAudioBars([
        8 + Math.floor(Math.random() * 20),
        14 + Math.floor(Math.random() * 28),
        20 + Math.floor(Math.random() * 32),
        16 + Math.floor(Math.random() * 26),
        10 + Math.floor(Math.random() * 22),
        24 + Math.floor(Math.random() * 30),
        12 + Math.floor(Math.random() * 18),
      ]);
    }, 100);
    return () => clearInterval(interval);
  }, [status]);

  // Subtle natural attentive nod when candidate is speaking (listening status)
  useEffect(() => {
    if (status === 'listening') {
      const nodInterval = setInterval(() => {
        setIsNodding(true);
        setTimeout(() => setIsNodding(false), 900);
      }, 4500);
      return () => clearInterval(nodInterval);
    }
  }, [status]);

  const currentPersona = INTERVIEWER_PERSONAS.find(p => p.id === currentId) || INTERVIEWER_PERSONAS[0];

  const handleSelectInterviewer = (id) => {
    setCurrentId(id);
    if (onInterviewerChange) {
      onInterviewerChange(id);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'speaking': return '#10b981';
      case 'listening': return '#00f0ff';
      case 'thinking': return '#a855f7';
      default: return '#38bdf8';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'speaking': return 'Interviewer Speaking';
      case 'listening': return 'Listening to You';
      case 'thinking': return 'Analyzing Response...';
      default: return 'Interviewer Active';
    }
  };

  return (
    <div className="cyber-card" style={{
      padding: '18px',
      background: 'radial-gradient(circle at 50% 20%, rgba(15, 23, 42, 0.95) 0%, rgba(6, 9, 19, 0.98) 100%)',
      border: `1px solid ${status === 'speaking' ? 'rgba(16, 185, 129, 0.5)' : status === 'listening' ? 'rgba(0, 240, 255, 0.5)' : 'rgba(56, 189, 248, 0.25)'}`,
      boxShadow: status === 'speaking' ? '0 0 25px rgba(16, 185, 129, 0.2)' : status === 'listening' ? '0 0 25px rgba(0, 240, 255, 0.2)' : 'none',
      transition: 'all 0.4s ease'
    }}>
      {/* Top Bar: Interviewer Title & Status Pill */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Radio size={15} color={getStatusColor()} className={status === 'speaking' || status === 'listening' ? 'animate-pulse' : ''} />
          <span style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#f8fafc' }}>
            Interviewer Live Feed
          </span>
        </div>

        {/* Live Status Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '3px 10px',
          borderRadius: '999px',
          background: 'rgba(8, 14, 28, 0.85)',
          border: `1px solid ${getStatusColor()}`,
          fontSize: '11px',
          fontWeight: '600',
          color: getStatusColor()
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: getStatusColor(),
            boxShadow: `0 0 8px ${getStatusColor()}`
          }} />
          {getStatusText()}
        </div>
      </div>

      {/* Main Interviewer Video / Face Frame */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '270px',
        borderRadius: '12px',
        overflow: 'hidden',
        background: '#020617',
        border: '1px solid rgba(56, 189, 248, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {currentPersona.id === 'robot' ? (
          <div style={{ transform: 'scale(0.92)' }}>
            <RobotAvatar status={status} size={240} showStatusBadge={false} />
          </div>
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Realistic Interviewer Face Photo with Dynamic Animations */}
            <img
              src={currentPersona.image}
              alt={currentPersona.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: isNodding ? 'scale(1.03) translateY(4px)' : status === 'speaking' ? 'scale(1.02)' : 'scale(1.0)',
                transition: 'transform 0.4s ease, filter 0.3s ease',
                filter: status === 'speaking' ? 'brightness(1.05) contrast(1.05)' : 'none'
              }}
            />

            {/* Speaking Voice Glow Overlay */}
            {status === 'speaking' && (
              <div style={{
                position: 'absolute',
                inset: 0,
                border: '2px solid rgba(16, 185, 129, 0.6)',
                borderRadius: '12px',
                boxShadow: 'inset 0 0 30px rgba(16, 185, 129, 0.3)',
                pointerEvents: 'none'
              }} />
            )}

            {/* Listening Gaze Halo */}
            {status === 'listening' && (
              <div style={{
                position: 'absolute',
                inset: 0,
                border: '2px solid rgba(0, 240, 255, 0.5)',
                borderRadius: '12px',
                boxShadow: 'inset 0 0 25px rgba(0, 240, 255, 0.25)',
                pointerEvents: 'none'
              }} />
            )}

            {/* Thinking Holographic Scan Overlay */}
            {status === 'thinking' && (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, transparent 0%, rgba(168, 85, 247, 0.15) 50%, transparent 100%)',
                animation: 'pulseGlow 2s infinite',
                pointerEvents: 'none'
              }} />
            )}
          </div>
        )}

        {/* Live Audio Equalizer Overlay when Speaking */}
        {status === 'speaking' && (
          <div style={{
            position: 'absolute',
            bottom: '48px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(2, 6, 23, 0.75)',
            backdropFilter: 'blur(8px)',
            padding: '6px 14px',
            borderRadius: '999px',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            zIndex: 10
          }}>
            <Volume2 size={13} color="#10b981" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '18px' }}>
              {audioBars.map((height, idx) => (
                <span
                  key={idx}
                  style={{
                    width: '3px',
                    height: `${height * 0.4}px`,
                    background: '#10b981',
                    borderRadius: '2px',
                    transition: 'height 0.1s ease'
                  }}
                />
              ))}
            </div>
            <span style={{ fontSize: '10px', color: '#34d399', fontWeight: '700', marginLeft: '4px', textTransform: 'uppercase' }}>
              Speaking
            </span>
          </div>
        )}

        {/* Interviewer Name Banner (Video Conference Style) */}
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '8px',
          right: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(3, 7, 18, 0.85)',
          backdropFilter: 'blur(10px)',
          padding: '6px 10px',
          borderRadius: '8px',
          border: '1px solid rgba(56, 189, 248, 0.15)',
          zIndex: 10
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#f8fafc' }}>
                {currentPersona.name}
              </span>
              <span className="badge-cyber" style={{ fontSize: '9px', padding: '1px 6px' }}>
                AI Evaluator
              </span>
            </div>
            <div style={{ fontSize: '10px', color: '#94a3b8', lineHeight: '1.2' }}>
              {currentPersona.title}
            </div>
          </div>

          {/* Replay audio button */}
          {onReplayAudio && (
            <button
              onClick={onReplayAudio}
              className="btn-secondary"
              style={{ padding: '4px 8px', fontSize: '10px', borderRadius: '4px' }}
              title="Re-play question audio"
            >
              <Volume2 size={12} color="#00f0ff" />
              Repeat
            </button>
          )}
        </div>

        {/* Cyber HUD Corner Accents */}
        <div style={{ position: 'absolute', top: '6px', left: '6px', width: '10px', height: '10px', borderTop: '2px solid #00f0ff', borderLeft: '2px solid #00f0ff' }} />
        <div style={{ position: 'absolute', top: '6px', right: '6px', width: '10px', height: '10px', borderTop: '2px solid #00f0ff', borderRight: '2px solid #00f0ff' }} />
      </div>

      {/* Switch Interviewer Face Persona Selector */}
      <div style={{ marginTop: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Select Interviewer Face
          </span>
          <span style={{ fontSize: '10px', color: '#38bdf8' }}>
            {currentPersona.tag}
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '6px'
        }}>
          {INTERVIEWER_PERSONAS.map((persona) => {
            const isSelected = persona.id === currentId;
            return (
              <button
                key={persona.id}
                onClick={() => handleSelectInterviewer(persona.id)}
                title={`${persona.name} (${persona.title})`}
                style={{
                  background: isSelected ? 'rgba(0, 240, 255, 0.15)' : 'rgba(15, 23, 42, 0.7)',
                  border: isSelected ? '2px solid #00f0ff' : '1px solid rgba(56, 189, 248, 0.15)',
                  borderRadius: '8px',
                  padding: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.2s ease'
                }}
              >
                {persona.image ? (
                  <img
                    src={persona.image}
                    alt={persona.name}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: isSelected ? '1.5px solid #00f0ff' : '1px solid #334155'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#0f172a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: isSelected ? '1.5px solid #00f0ff' : '1px solid #334155'
                  }}>
                    <Sparkles size={14} color="#00f0ff" />
                  </div>
                )}
                <span style={{
                  fontSize: '9px',
                  fontWeight: isSelected ? '700' : '500',
                  color: isSelected ? '#00f0ff' : '#94a3b8',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '100%',
                  textAlign: 'center'
                }}>
                  {persona.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
