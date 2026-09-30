import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

export default function CountdownTimer({
  initialMinutes = 15,
  onTwoMinutesRemaining,
  onTimeExpired,
  isRunning = true
}) {
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);
  const [twoMinAlertShown, setTwoMinAlertShown] = useState(false);

  useEffect(() => {
    setSecondsLeft(initialMinutes * 60);
  }, [initialMinutes]);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onTimeExpired) onTimeExpired();
          return 0;
        }

        // 2 minutes warning (120 seconds)
        if (prev === 120 && !twoMinAlertShown) {
          setTwoMinAlertShown(true);
          if (onTwoMinutesRemaining) onTwoMinutesRemaining();
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, twoMinAlertShown, onTimeExpired, onTwoMinutesRemaining]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isUrgent = secondsLeft <= 120;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '7px 16px',
        borderRadius: '999px',
        background: isUrgent ? 'rgba(239, 68, 68, 0.15)' : 'rgba(15, 23, 42, 0.85)',
        border: `1px solid ${isUrgent ? '#ef4444' : 'rgba(56, 189, 248, 0.3)'}`,
        color: isUrgent ? '#f87171' : '#38bdf8',
        boxShadow: isUrgent ? '0 0 20px rgba(239, 68, 68, 0.35)' : '0 0 10px rgba(0, 240, 255, 0.15)',
        transition: 'all 0.3s ease'
      }}
    >
      {isUrgent ? <AlertTriangle size={16} className="animate-pulse" /> : <Clock size={16} />}
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: '800', letterSpacing: '0.05em' }}>
        {formattedTime}
      </div>
      {isUrgent && (
        <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '800', color: '#f87171' }}>
          2 Min Left
        </span>
      )}
    </div>
  );
}
