import React, { useState, useEffect, useRef } from 'react';
import '../styles/robot.css';

/**
 * Friendly Humanoid AI Robot Interviewer Avatar
 * Features:
 * - Natural eye blinking every 3-6s
 * - Interactive gaze tracking (pupils follow cursor)
 * - Animated expressive mouth for Speaking, Listening, Thinking, and Idle
 * - Futuristic cybernetic chassis with soft friendly styling (not Tesla copycat)
 */
export default function RobotAvatar({ status = 'idle', size = 260, showStatusBadge = true }) {
  const [isBlinking, setIsBlinking] = useState(false);
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [audioBars, setAudioBars] = useState([8, 14, 20, 15, 9]);
  const containerRef = useRef(null);

  // 1. Natural Blinking interval
  useEffect(() => {
    let blinkTimer;
    const scheduleNextBlink = () => {
      const nextDelay = 2800 + Math.random() * 3200;
      blinkTimer = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleNextBlink();
        }, 160);
      }, nextDelay);
    };

    scheduleNextBlink();
    return () => clearTimeout(blinkTimer);
  }, []);

  // 2. Interactive Gaze Tracking toward user cursor
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) / (window.innerWidth / 2);
      const deltaY = (e.clientY - centerY) / (window.innerHeight / 2);

      // Clamp gaze to a subtle natural range [-6, 6] px
      const clampX = Math.max(-6, Math.min(6, deltaX * 6));
      const clampY = Math.max(-5, Math.min(5, deltaY * 5));

      setPupilOffset({ x: clampX, y: clampY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 3. Dynamic audio bar oscillation when speaking
  useEffect(() => {
    if (status !== 'speaking') return;
    const interval = setInterval(() => {
      setAudioBars([
        6 + Math.floor(Math.random() * 12),
        10 + Math.floor(Math.random() * 18),
        14 + Math.floor(Math.random() * 22),
        10 + Math.floor(Math.random() * 18),
        6 + Math.floor(Math.random() * 12),
      ]);
    }, 120);
    return () => clearInterval(interval);
  }, [status]);

  // Color schemes based on status
  const eyeColor = status === 'thinking' ? '#c084fc' : status === 'speaking' ? '#34d399' : '#00f0ff';
  const irisGlow = status === 'thinking' ? 'rgba(168, 85, 247, 0.6)' : status === 'speaking' ? 'rgba(16, 185, 129, 0.6)' : 'rgba(0, 240, 255, 0.6)';

  return (
    <div className="robot-container" ref={containerRef}>
      <div className="robot-stage" style={{ width: size, height: size * 1.1 }}>
        {/* Ambient Halo Glow */}
        <div className={`robot-ambient-glow ${status}`} />

        {/* Listening Sonic Wave Ripples */}
        {status === 'listening' && (
          <>
            <div className="robot-listening-ripple" style={{ animationDelay: '0s' }} />
            <div className="robot-listening-ripple" style={{ animationDelay: '0.8s' }} />
          </>
        )}

        {/* Thinking Quantum Orbit Rings */}
        {status === 'thinking' && (
          <>
            <div className="robot-thinking-rings" />
            <div className="robot-thinking-rings" style={{ transform: 'rotate(60deg) scale(1.1)', animationDirection: 'reverse', animationDuration: '12s' }} />
          </>
        )}

        {/* Futuristic Humanoid Robot Head SVG */}
        <div className="robot-svg-wrapper" style={{ width: size * 0.88, height: size }}>
          <svg viewBox="0 0 240 270" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Outer Shell Gradient */}
              <linearGradient id="chassisGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="40%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#090d16" />
              </linearGradient>

              {/* Visor Screen Glass */}
              <linearGradient id="visorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#060c18" />
                <stop offset="60%" stopColor="#09152b" />
                <stop offset="100%" stopColor="#040811" />
              </linearGradient>

              {/* Metallic Rim Gradient */}
              <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#00f0ff" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
              </linearGradient>

              {/* Glow Filter */}
              <filter id="cyanGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Neck Connectors & Power Conduit */}
            <path d="M95,200 L95,245 Q120,255 145,245 L145,200 Z" fill="#0d1527" stroke="#1e293b" strokeWidth="2" />
            <line x1="110" y1="205" x2="110" y2="242" stroke={eyeColor} strokeWidth="1.5" strokeOpacity="0.4" />
            <line x1="120" y1="205" x2="120" y2="244" stroke={eyeColor} strokeWidth="2" strokeOpacity="0.7" />
            <line x1="130" y1="205" x2="130" y2="242" stroke={eyeColor} strokeWidth="1.5" strokeOpacity="0.4" />

            {/* Shoulder Collar Accent */}
            <path d="M60,250 Q120,265 180,250 L195,268 Q120,285 45,268 Z" fill="#0b1322" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1.5" />

            {/* Ear Nodes / Audio Sensor Modules */}
            <rect x="22" y="100" width="14" height="42" rx="7" fill="#0f172a" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="1.5" />
            <circle cx="29" cy="121" r="3.5" fill={eyeColor} filter="url(#cyanGlow)" />
            
            <rect x="204" y="100" width="14" height="42" rx="7" fill="#0f172a" stroke="rgba(0, 240, 255, 0.4)" strokeWidth="1.5" />
            <circle cx="211" cy="121" r="3.5" fill={eyeColor} filter="url(#cyanGlow)" />

            {/* Main Cranial Shell */}
            <path
              d="M40,110 C40,48 76,22 120,22 C164,22 200,48 200,110 C200,165 170,210 120,210 C70,210 40,165 40,110 Z"
              fill="url(#chassisGrad)"
              stroke="#1e3a5f"
              strokeWidth="2.5"
            />

            {/* Subtle Forehead Sleek Inset Line */}
            <path d="M78,48 Q120,38 162,48" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="120" cy="42" r="2.5" fill={eyeColor} opacity="0.8" />

            {/* Futuristic Face Visor Display Plate */}
            <path
              d="M52,105 C52,65 80,55 120,55 C160,55 188,65 188,105 C188,150 162,185 120,185 C78,185 52,150 52,105 Z"
              fill="url(#visorGrad)"
              stroke="url(#rimGrad)"
              strokeWidth="2"
            />

            {/* Visor Scanline (Subtle in thinking mode) */}
            {status === 'thinking' && (
              <line x1="56" y1="80" x2="184" y2="80" stroke="rgba(168, 85, 247, 0.8)" strokeWidth="1.5" filter="url(#cyanGlow)">
                <animate attributeName="y1" values="60; 175; 60" dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="y2" values="60; 175; 60" dur="2.4s" repeatCount="indefinite" />
              </line>
            )}

            {/* ===================== EYES ===================== */}
            {/* Left Eye Socket */}
            <g transform={`translate(${pupilOffset.x}, ${pupilOffset.y})`}>
              <ellipse cx="86" cy="110" rx="19" ry="17" fill="#030712" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1" />
              <ellipse cx="86" cy="110" rx="14" ry="13" fill="none" stroke={irisGlow} strokeWidth="1.5" />
              <circle cx="86" cy="110" r="9" fill={eyeColor} filter="url(#cyanGlow)" />
              {/* Pupil core */}
              <circle cx="86" cy="110" r="4.5" fill="#ffffff" />
              <circle cx="89" cy="107" r="1.8" fill="#ffffff" />
            </g>

            {/* Right Eye Socket */}
            <g transform={`translate(${pupilOffset.x}, ${pupilOffset.y})`}>
              <ellipse cx="154" cy="110" rx="19" ry="17" fill="#030712" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1" />
              <ellipse cx="154" cy="110" rx="14" ry="13" fill="none" stroke={irisGlow} strokeWidth="1.5" />
              <circle cx="154" cy="110" r="9" fill={eyeColor} filter="url(#cyanGlow)" />
              {/* Pupil core */}
              <circle cx="154" cy="110" r="4.5" fill="#ffffff" />
              <circle cx="157" cy="107" r="1.8" fill="#ffffff" />
            </g>

            {/* Natural Blinking Eyelid Cover */}
            {isBlinking && (
              <>
                <ellipse cx="86" cy="110" rx="20" ry="18" fill="#090e1c" stroke="#1e293b" strokeWidth="1" />
                <line x1="68" y1="110" x2="104" y2="110" stroke={eyeColor} strokeWidth="2" strokeLinecap="round" />
                <ellipse cx="154" cy="110" rx="20" ry="18" fill="#090e1c" stroke="#1e293b" strokeWidth="1" />
                <line x1="136" y1="110" x2="172" y2="110" stroke={eyeColor} strokeWidth="2" strokeLinecap="round" />
              </>
            )}

            {/* Subtle Cheek Telemetry Accent Dots */}
            <circle cx="68" cy="138" r="1.5" fill="rgba(56, 189, 248, 0.5)" />
            <circle cx="74" cy="142" r="1.5" fill="rgba(56, 189, 248, 0.3)" />
            <circle cx="172" cy="138" r="1.5" fill="rgba(56, 189, 248, 0.5)" />
            <circle cx="166" cy="142" r="1.5" fill="rgba(56, 189, 248, 0.3)" />

            {/* ===================== MOUTH ===================== */}
            {/* 1. Speaking: Dynamic audio visualizer bars */}
            {status === 'speaking' && (
              <g transform="translate(120, 158)">
                <rect x="-24" y={-audioBars[0] / 2} width="4" height={audioBars[0]} rx="2" fill="#10b981" filter="url(#cyanGlow)" />
                <rect x="-12" y={-audioBars[1] / 2} width="4" height={audioBars[1]} rx="2" fill="#34d399" filter="url(#cyanGlow)" />
                <rect x="-2"  y={-audioBars[2] / 2} width="4" height={audioBars[2]} rx="2" fill="#00f0ff" filter="url(#cyanGlow)" />
                <rect x="8"   y={-audioBars[3] / 2} width="4" height={audioBars[3]} rx="2" fill="#34d399" filter="url(#cyanGlow)" />
                <rect x="18"  y={-audioBars[4] / 2} width="4" height={audioBars[4]} rx="2" fill="#10b981" filter="url(#cyanGlow)" />
              </g>
            )}

            {/* 2. Listening: Gentle pulsing wave line */}
            {status === 'listening' && (
              <path
                d="M96,158 Q108,152 120,158 Q132,164 144,158"
                fill="none"
                stroke="#00f0ff"
                strokeWidth="2.5"
                strokeLinecap="round"
                filter="url(#cyanGlow)"
              >
                <animate attributeName="d" values="M96,158 Q108,152 120,158 Q132,164 144,158; M96,158 Q108,164 120,158 Q132,152 144,158; M96,158 Q108,152 120,158 Q132,164 144,158" dur="1.2s" repeatCount="indefinite" />
              </path>
            )}

            {/* 3. Thinking: Holographic particle wave */}
            {status === 'thinking' && (
              <g transform="translate(120, 158)">
                <circle cx="-16" cy="0" r="2.5" fill="#a855f7" filter="url(#cyanGlow)">
                  <animate attributeName="cy" values="-3; 3; -3" dur="1s" repeatCount="indefinite" />
                </circle>
                <circle cx="0" cy="0" r="2.8" fill="#c084fc" filter="url(#cyanGlow)">
                  <animate attributeName="cy" values="3; -3; 3" dur="1s" repeatCount="indefinite" />
                </circle>
                <circle cx="16" cy="0" r="2.5" fill="#a855f7" filter="url(#cyanGlow)">
                  <animate attributeName="cy" values="-3; 3; -3" dur="1s" repeatCount="indefinite" />
                </circle>
              </g>
            )}

            {/* 4. Idle: Friendly calm micro-smile curve */}
            {status === 'idle' && (
              <path
                d="M102,158 Q120,165 138,158"
                fill="none"
                stroke="rgba(0, 240, 255, 0.75)"
                strokeWidth="2"
                strokeLinecap="round"
                filter="url(#cyanGlow)"
              />
            )}
          </svg>
        </div>
      </div>

      {/* Robot Status Pill */}
      {showStatusBadge && (
        <div className={`robot-status-pill ${status}`}>
          <span className="robot-status-dot" />
          <span>
            {status === 'listening' ? 'Listening to You' :
             status === 'thinking' ? 'Analyzing Response' :
             status === 'speaking' ? 'Interviewer Speaking' :
             'Interviewer Ready'}
          </span>
        </div>
      )}
    </div>
  );
}
