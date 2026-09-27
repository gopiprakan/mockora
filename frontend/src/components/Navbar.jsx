import React from 'react';
import { Cpu, Award, BookOpen, Sparkles } from 'lucide-react';

export default function Navbar({ currentView, onNavigate }) {
  return (
    <header style={{
      width: '100%',
      borderBottom: '1px solid rgba(56, 189, 248, 0.15)',
      background: 'rgba(6, 9, 19, 0.85)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px'
      }}>
        {/* Brand Logo */}
        <div
          onClick={() => onNavigate('landing')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #00f0ff 0%, #0284c7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(0, 240, 255, 0.4)'
          }}>
            <Cpu size={22} color="#060913" />
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '20px',
              fontWeight: '800',
              letterSpacing: '0.08em',
              background: 'linear-gradient(90deg, #f8fafc 0%, #38bdf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'uppercase'
            }}>
              MOCKORA
            </div>
            <div style={{ fontSize: '10px', color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '-3px' }}>
              AI Interview Coach
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => onNavigate('setup')}
            className={currentView === 'setup' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 18px', fontSize: '13px' }}
          >
            <Sparkles size={14} />
            Start Interview
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className={currentView === 'dashboard' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 18px', fontSize: '13px' }}
          >
            <Award size={14} />
            Dashboard
          </button>
        </nav>
      </div>
    </header>
  );
}
