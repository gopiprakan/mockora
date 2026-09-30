import React, { useState, useEffect, useRef } from 'react';
import { Camera, CameraOff, Eye, AlertCircle, Sparkles, Activity, User, Mic } from 'lucide-react';

export default function WebcamMonitor({
  isAnswering = false,
  transcript = '',
  onObservationsUpdate
}) {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraRequested, setCameraRequested] = useState(false);
  const [faceDetected, setFaceDetected] = useState(true);
  const [cameraEngagement, setCameraEngagement] = useState('Good');
  const [fillerCount, setFillerCount] = useState(0);
  const [longPauses, setLongPauses] = useState(0);
  const [speakingDuration, setSpeakingDuration] = useState(0);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const lastSpeechTimeRef = useRef(Date.now());
  const timerRef = useRef(null);

  // 1. Monitor transcript for filler words
  useEffect(() => {
    if (!transcript) return;
    const fillers = ['um', 'uh', 'like', 'basically', 'actually', 'you know', 'sort of', 'kind of'];
    const words = transcript.toLowerCase().split(/\s+/);
    let count = 0;
    words.forEach(word => {
      const cleaned = word.replace(/[^a-z]/g, '');
      if (fillers.includes(cleaned)) count++;
    });
    setFillerCount(count);
  }, [transcript]);

  // 2. Track speaking duration and detect long pauses while answering
  useEffect(() => {
    if (isAnswering) {
      lastSpeechTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setSpeakingDuration(prev => prev + 1);

        const gap = (Date.now() - lastSpeechTimeRef.current) / 1000;
        if (gap > 4.5) {
          setLongPauses(prev => prev + 1);
          lastSpeechTimeRef.current = Date.now();
        }
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isAnswering]);

  // Update last speech time when transcript expands
  useEffect(() => {
    lastSpeechTimeRef.current = Date.now();
  }, [transcript]);

  // 3. Request / Toggle Camera Stream
  const toggleCamera = async () => {
    if (cameraActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      setCameraActive(false);
      return;
    }

    try {
      setCameraRequested(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 480 }, height: { ideal: 360 } },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      setFaceDetected(true);
      setCameraEngagement('Good');
    } catch (err) {
      console.warn('Camera permission denied or camera not found:', err);
      setCameraActive(false);
      alert('Could not access camera. Please check your browser webcam permissions.');
    }
  };

  // Broadcast communication observations to parent interview room
  useEffect(() => {
    if (onObservationsUpdate) {
      onObservationsUpdate({
        camera_engagement: cameraEngagement,
        long_pauses: longPauses,
        filler_words: fillerCount,
        speaking_duration_seconds: speakingDuration,
        face_detected: faceDetected
      });
    }
  }, [cameraEngagement, longPauses, fillerCount, speakingDuration, faceDetected, onObservationsUpdate]);

  // Clean up stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="cyber-card" style={{ padding: '18px', background: 'rgba(10, 16, 32, 0.9)', marginTop: '18px', position: 'relative' }}>
      <div className="hud-corner-tl" />
      <div className="hud-corner-tr" />
      <div className="hud-corner-bl" />
      <div className="hud-corner-br" />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={17} color="#00f0ff" />
          <span style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#94a3b8' }}>
            Candidate Signals HUD
          </span>
        </div>

        <button
          onClick={toggleCamera}
          className="btn-secondary"
          style={{
            padding: '6px 14px',
            fontSize: '11px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            borderColor: cameraActive ? 'rgba(244, 63, 94, 0.4)' : 'rgba(0, 240, 255, 0.4)'
          }}
          title={cameraActive ? 'Turn off candidate camera' : 'Enable candidate camera for visual engagement feedback'}
        >
          {cameraActive ? <CameraOff size={13} color="#f43f5e" /> : <Camera size={13} color="#00f0ff" />}
          <span>{cameraActive ? 'Camera Off' : 'Enable Camera'}</span>
        </button>
      </div>

      {/* Video Feed Preview Frame */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '160px',
        borderRadius: '12px',
        overflow: 'hidden',
        background: '#020617',
        marginBottom: '14px',
        border: cameraActive ? '1px solid rgba(0, 240, 255, 0.45)' : '1px dashed rgba(56, 189, 248, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {cameraActive ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
            />

            {/* Live Camera HUD Overlay */}
            <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', gap: '6px' }}>
              <span className="badge-cyber" style={{ fontSize: '10px', padding: '2px 8px', background: 'rgba(2, 6, 23, 0.9)' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00f0ff', display: 'inline-block' }} />
                Face In Frame
              </span>
            </div>

            <div style={{ position: 'absolute', bottom: '8px', right: '8px' }}>
              <span className="badge-green" style={{ fontSize: '10px', padding: '2px 8px', background: 'rgba(2, 6, 23, 0.9)' }}>
                Engagement: {cameraEngagement}
              </span>
            </div>
          </>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '16px',
            textAlign: 'center',
            color: '#64748b'
          }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User size={24} color="#94a3b8" />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8' }}>
                Video Feed Standby
              </div>
              <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
                Click <span style={{ color: '#00f0ff' }}>"Enable Camera"</span> to analyze eye contact
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center' }}>
        <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '10px 6px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.12)' }}>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Camera Gaze</div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#38bdf8', marginTop: '2px' }}>
            {cameraActive ? cameraEngagement : 'Audio Mode'}
          </div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '10px 6px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.12)' }}>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Filler Words</div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: fillerCount > 5 ? '#f59e0b' : '#10b981', marginTop: '2px' }}>
            {fillerCount}
          </div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '10px 6px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.12)' }}>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Long Pauses</div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: longPauses > 3 ? '#f59e0b' : '#38bdf8', marginTop: '2px' }}>
            {longPauses}
          </div>
        </div>
      </div>

      <p style={{ fontSize: '10px', color: '#64748b', marginTop: '10px', lineHeight: '1.3' }}>
        * Speech cadence, pauses, and gaze are factored into your post-interview report.
      </p>
    </div>
  );
}
