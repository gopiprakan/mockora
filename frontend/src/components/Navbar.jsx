import React from 'react';
import { Cpu, Award, Sparkles, Activity, Layers, Terminal } from 'lucide-react';

export default function Navbar({ currentView, onNavigate }) {
  return (
    <header style={{
      width: '100%',
      borderBottom: '1px solid rgba(56, 189, 248, 0.18)',
      background: 'rgba(5, 8, 19, 0.88)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px'
      }}>
        {/* Brand Logo & Telemetry Indicator */}
        <div
          onClick={() => onNavigate('landing')}
          style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
        >
          <div style={{
            position: 'relative',
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #00f0ff 0%, #0284c7 60%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.45)'
          }}>
            <Cpu size={24} color="#040813" />
            <span style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#10b981',
              border: '2px solid #050813',
              boxShadow: '0 0 8px #10b981'
            }} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '22px',
                fontWeight: '900',
                letterSpacing: '0.08em',
                background: 'linear-gradient(90deg, #f8fafc 0%, #38bdf8 50%, #00f0ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textTransform: 'uppercase'
              }}>
                MOCKORA
              </span>
              <span className="badge-cyber" style={{ fontSize: '9px', padding: '1px 7px' }}>
                AI COACH
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '-2px' }}>
              Adaptive Neural Interviewer
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            display: 'none',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '999px',
            background: 'rgba(10, 16, 30, 0.7)',
            border: '1px solid rgba(56, 189, 248, 0.15)',
            fontSize: '12px',
            color: '#94a3b8',
            marginRight: '8px'
          }} className="nav-telemetry">
            <Activity size={13} color="#10b981" />
            <span>Neural Engine: <strong style={{ color: '#10b981' }}>Active</strong></span>
          </div>

          <button
            onClick={() => onNavigate('landing')}
            className={currentView === 'landing' ? 'btn-secondary' : 'btn-secondary'}
            style={{
              padding: '8px 16px',
              fontSize: '13px',
              borderColor: currentView === 'landing' ? 'rgba(0, 240, 255, 0.5)' : 'transparent',
              color: currentView === 'landing' ? '#00f0ff' : '#94a3b8',
              background: currentView === 'landing' ? 'rgba(0, 240, 255, 0.1)' : 'transparent'
            }}
          >
            Home
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className={currentView === 'dashboard' ? 'btn-primary' : 'btn-secondary'}
            style={{
              padding: '8px 18px',
              fontSize: '13px'
            }}
          >
            <Award size={15} />
            Dashboard
          </button>

          <button
            onClick={() => onNavigate('setup')}
            className={currentView === 'setup' ? 'btn-primary' : 'btn-primary'}
            style={{
              padding: '9px 20px',
              fontSize: '13px',
              background: 'linear-gradient(135deg, #00f0ff 0%, #0284c7 100%)'
            }}
          >
            <Sparkles size={14} />
            Start Interview
          </button>
        </nav>
      </div>
    </header>
  );
}
