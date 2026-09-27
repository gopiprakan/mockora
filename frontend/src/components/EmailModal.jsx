import React, { useState } from 'react';
import { Mail, CheckCircle2, X, Send, Sparkles, AlertCircle } from 'lucide-react';
import { sendReportEmail } from '../services/api';

export default function EmailModal({ report, isOpen, onClose }) {
  const [email, setEmail] = useState(report?.candidate_email || '');
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState(null); // 'success', 'error', null
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSending(true);
    setStatus(null);

    try {
      const res = await sendReportEmail(report.id || report.interview_id, email);
      setStatus('success');
      setStatusMessage(res.message || `Interview report sent successfully to ${email}!`);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setStatusMessage(err.message || 'Failed to dispatch email. Please check your backend SMTP credentials.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(2, 6, 18, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="cyber-card" style={{
        maxWidth: '520px',
        width: '100%',
        padding: '30px',
        background: '#0d1527',
        border: '1px solid rgba(0, 240, 255, 0.4)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'rgba(0, 240, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Mail size={20} color="#00f0ff" />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', color: '#f8fafc' }}>Send Report to Email</h3>
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>Receive your complete feedback breakdown and study guide</p>
          </div>
        </div>

        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '18px', color: '#10b981', marginBottom: '8px' }}>Email Delivered!</h4>
            <p style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '20px', lineHeight: '1.5' }}>
              {statusMessage}
            </p>
            <button onClick={onClose} className="btn-primary" style={{ width: '100%' }}>
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSend}>
            {/* Quick Summary Pill */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(56, 189, 248, 0.15)',
              borderRadius: '8px',
              padding: '14px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Candidate & Role</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#f8fafc' }}>
                  {report?.candidate_name} &bull; {report?.role}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Practice Score</div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: '#00f0ff' }}>
                  {report?.overall_score}/100
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
                Recipient Student Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@university.edu"
                className="cyber-input"
              />
            </div>

            {status === 'error' && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '8px',
                padding: '10px 14px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#f87171',
                fontSize: '13px'
              }}>
                <AlertCircle size={16} />
                <span>{statusMessage}</span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSending || !email}
                className="btn-primary"
                style={{ flex: 2 }}
              >
                {isSending ? (
                  <>
                    <span className="robot-status-dot" style={{ background: '#060913' }} />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    Send Report
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
