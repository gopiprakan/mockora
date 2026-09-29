import React, { useState, useEffect } from 'react';
import RobotAvatar from './RobotAvatar';
import { Volume2, Sparkles, Radio, Cpu, Activity } from 'lucide-react';

export const INTERVIEWER_PERSONAS = [
  {
    id: 'robot',
    name: 'Mockora Cyber AI',
    title: 'Adaptive Neural Interview Engine',
    company: 'Mockora Platform',
    tag: 'Humanoid AI'
  }
];

export default function InterviewerFace({
  status = 'idle', // 'speaking', 'listening', 'thinking', 'idle'
  onReplayAudio
}) {
  const [audioBars, setAudioBars] = useState([12, 24, 38, 20, 10, 30, 18]);

  const currentPersona = INTERVIEWER_PERSONAS[0];

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
      default: return 'Interviewer Ready';
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
        height: '280px',
        borderRadius: '12px',
        overflow: 'hidden',
        background: '#020617',
        border: '1px solid rgba(56, 189, 248, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ transform: 'scale(0.95)' }}>
          <RobotAvatar status={status} size={250} showStatusBadge={false} />
        </div>

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
          background: 'rgba(3, 7, 18, 0.88)',
          backdropFilter: 'blur(10px)',
          padding: '6px 12px',
          borderRadius: '8px',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          zIndex: 10
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#f8fafc' }}>
                {currentPersona.name}
              </span>
              <span className="badge-cyber" style={{ fontSize: '9px', padding: '1px 6px' }}>
                {currentPersona.tag}
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

      {/* Cyber AI Telemetry Status Footer */}
      <div style={{
        marginTop: '12px',
        padding: '8px 12px',
        borderRadius: '8px',
        background: 'rgba(10, 16, 30, 0.6)',
        border: '1px solid rgba(56, 189, 248, 0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94a3b8' }}>
          <Cpu size={13} color="#00f0ff" />
          <span>Mockora Cyber AI • Neural Speech & Gaze Active</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#10b981', fontWeight: '600' }}>
          <Activity size={12} />
          <span>Online</span>
        </div>
      </div>
    </div>
  );
}
