import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import EmailModal from '../components/EmailModal';
import { Award, Mail, Printer, RotateCcw, CheckCircle2, AlertTriangle, BookOpen, MessageSquare, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

export default function FinalReportPage({ report, onPracticeAgain, onNavigateDashboard }) {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState({});

  useEffect(() => {
    // Trigger celebratory confetti on report load
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const toggleQuestion = (idx) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const overallScore = report?.overall_score || 78;
  const categories = report?.category_scores || {
    "Technical Knowledge": 78,
    "Communication": 74,
    "Problem Solving": 82,
    "Answer Relevance": 86,
    "Answer Structure": 72
  };
  const strengths = report?.strengths || [
    "Good understanding of programming concepts",
    "Relevant project explanations",
    "Good problem-solving approach"
  ];
  const improvements = report?.areas_to_improve || [
    "Give more real-world examples",
    "Structure answers using a clear format",
    "Improve explanation of database concepts"
  ];
  const topics = report?.recommended_topics || [
    "SQL joins",
    "OOP",
    "REST APIs",
    "Data structures"
  ];
  const commSummary = report?.communication_summary || {
    camera_engagement: "Good",
    long_pauses: 3,
    filler_words: 7,
    average_response_time: "4.2 seconds"
  };
  const questionsAnalysis = report?.questions_analysis || [];

  return (
    <div className="container" style={{ padding: '30px 20px 80px', maxWidth: '1040px' }}>
      {/* Top Banner & Action Buttons */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '28px',
        borderBottom: '1px solid rgba(56, 189, 248, 0.15)',
        paddingBottom: '20px'
      }}>
        <div>
          <span className="badge-cyber" style={{ marginBottom: '8px' }}>
            <Award size={13} />
            Performance Assessment
          </span>
          <h1 style={{
            fontSize: 'clamp(24px, 4vw, 36px)',
            color: '#f8fafc',
            letterSpacing: '0.04em',
            textTransform: 'uppercase'
          }}>
            INTERVEXA INTERVIEW REPORT
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>
            Candidate: <strong style={{ color: '#f8fafc' }}>{report?.candidate_name}</strong> &nbsp;&bull;&nbsp;
            Role: <strong style={{ color: '#00f0ff' }}>{report?.role}</strong> &nbsp;&bull;&nbsp;
            Duration: <strong style={{ color: '#f8fafc' }}>{report?.duration_minutes} minutes</strong>
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <button
            onClick={() => setShowEmailModal(true)}
            className="btn-primary"
            style={{ padding: '10px 20px', fontSize: '14px' }}
          >
            <Mail size={16} />
            Email Report
          </button>

          <button
            onClick={() => window.print()}
            className="btn-secondary"
            style={{ padding: '10px 18px', fontSize: '14px' }}
          >
            <Printer size={16} />
            Print / PDF
          </button>

          <button
            onClick={onPracticeAgain}
            className="btn-secondary"
            style={{ padding: '10px 18px', fontSize: '14px' }}
          >
            <RotateCcw size={16} />
            Practice Again
          </button>
        </div>
      </div>

      {/* Hero Score Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Overall Practice Score Gauge */}
        <div className="cyber-card" style={{
          padding: '36px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at 50% 50%, rgba(13, 21, 39, 0.95) 0%, rgba(6, 9, 19, 0.98) 100%)',
          border: '1px solid rgba(0, 240, 255, 0.35)',
          boxShadow: '0 0 35px rgba(0, 240, 255, 0.15)'
        }}>
          <div style={{ fontSize: '13px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700', marginBottom: '8px' }}>
            Overall Practice Score
          </div>

          <div style={{
            fontSize: '68px',
            fontFamily: 'var(--font-heading)',
            fontWeight: '900',
            lineHeight: '1',
            background: 'linear-gradient(135deg, #00f0ff 0%, #38bdf8 60%, #a855f7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '10px 0'
          }}>
            {overallScore}<span style={{ fontSize: '26px', color: '#64748b' }}>/100</span>
          </div>

          <p style={{ fontSize: '12px', color: '#64748b', maxWidth: '280px', lineHeight: '1.4', marginTop: '6px' }}>
            AI-generated practice assessment to gauge interview readiness and build confidence.
          </p>
        </div>

        {/* 5 Category Progress Bars */}
        <div className="cyber-card" style={{ padding: '30px' }}>
          <h3 style={{ fontSize: '16px', color: '#f8fafc', marginBottom: '18px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Skill Evaluation Breakdown
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {Object.entries(categories).map(([catName, scoreVal]) => (
              <div key={catName}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                  <span style={{ color: '#cbd5e1', fontWeight: '500' }}>{catName}</span>
                  <span style={{ color: '#00f0ff', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>{scoreVal}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#0a0f1e', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(56, 189, 248, 0.15)' }}>
                  <div style={{
                    width: `${scoreVal}%`,
                    height: '100%',
                    background: catName === 'Technical Knowledge'
                      ? 'linear-gradient(90deg, #0284c7, #00f0ff)'
                      : catName === 'Problem Solving'
                      ? 'linear-gradient(90deg, #8b5cf6, #c084fc)'
                      : catName === 'Answer Relevance'
                      ? 'linear-gradient(90deg, #059669, #34d399)'
                      : 'linear-gradient(90deg, #0284c7, #38bdf8)',
                    borderRadius: '4px'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strengths & Areas to Improve Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Strengths */}
        <div className="cyber-card" style={{ padding: '26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <CheckCircle2 size={20} color="#10b981" />
            <h3 style={{ fontSize: '18px', color: '#10b981' }}>Key Strengths</h3>
          </div>
          <ul style={{ paddingLeft: '20px', margin: 0, color: '#cbd5e1', fontSize: '14px', lineHeight: '1.7' }}>
            {strengths.map((str, idx) => (
              <li key={idx} style={{ marginBottom: '6px' }}>{str}</li>
            ))}
          </ul>
        </div>

        {/* Areas to Improve */}
        <div className="cyber-card" style={{ padding: '26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <AlertTriangle size={20} color="#f59e0b" />
            <h3 style={{ fontSize: '18px', color: '#f59e0b' }}>Areas to Improve</h3>
          </div>
          <ul style={{ paddingLeft: '20px', margin: 0, color: '#cbd5e1', fontSize: '14px', lineHeight: '1.7' }}>
            {improvements.map((imp, idx) => (
              <li key={idx} style={{ marginBottom: '6px' }}>{imp}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommended Topics & Communication Signals Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        marginBottom: '36px'
      }}>
        {/* Recommended Topics */}
        <div className="cyber-card" style={{ padding: '26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <BookOpen size={20} color="#38bdf8" />
            <h3 style={{ fontSize: '18px', color: '#f8fafc' }}>Recommended Topics</h3>
          </div>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '12px' }}>
            Focus your revision on these core concepts to excel in your next technical round:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {topics.map((t, idx) => (
              <span key={idx} className="badge-cyber" style={{ fontSize: '13px', padding: '6px 14px' }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Communication Observations */}
        <div className="cyber-card" style={{ padding: '26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <MessageSquare size={20} color="#a855f7" />
            <h3 style={{ fontSize: '18px', color: '#f8fafc' }}>Communication Observations</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px 14px', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Camera Engagement</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#38bdf8', marginTop: '2px' }}>
                {commSummary.camera_engagement}
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px 14px', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Long Pauses</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#f8fafc', marginTop: '2px' }}>
                {commSummary.long_pauses}
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px 14px', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Filler Words</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#f59e0b', marginTop: '2px' }}>
                {commSummary.filler_words}
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px 14px', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Average Response Time</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#10b981', marginTop: '2px' }}>
                {commSummary.average_response_time}
              </div>
            </div>
          </div>
          <p style={{ fontSize: '11px', color: '#64748b', marginTop: '10px' }}>
            * Note: Communication observations assess speech flow and engagement, not psychological traits.
          </p>
        </div>
      </div>

      {/* Question-by-Question Deep Analysis */}
      <section>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '22px', color: '#f8fafc', marginBottom: '6px' }}>
            Question-by-Question Analysis
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>
            Review your answers, individual criteria scores, AI coach feedback, and improved senior model responses.
          </p>
        </div>

        {questionsAnalysis.length === 0 ? (
          <div className="cyber-card" style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
            No question-level transcript recorded.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {questionsAnalysis.map((item, idx) => {
              const isExpanded = expandedQuestions[idx] !== false; // default open
              return (
                <div key={idx} className="cyber-card" style={{ padding: '24px' }}>
                  {/* Question Header Bar */}
                  <div
                    onClick={() => toggleQuestion(idx)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className="badge-cyber" style={{ fontSize: '12px' }}>
                        Q{item.question_number || idx + 1}
                      </span>
                      <h4 style={{ fontSize: '16px', color: '#f8fafc', fontWeight: '600' }}>
                        {item.question}
                      </h4>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className="badge-green" style={{ fontSize: '13px' }}>
                        Score: {item.score}
                      </span>
                      {isExpanded ? <ChevronUp size={18} color="#94a3b8" /> : <ChevronDown size={18} color="#94a3b8" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(56, 189, 248, 0.12)' }}>
                      {/* Candidate Answer */}
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>
                          Candidate's Answer
                        </div>
                        <p style={{
                          background: 'rgba(8, 13, 24, 0.8)',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          border: '1px solid rgba(56, 189, 248, 0.1)',
                          color: '#cbd5e1',
                          fontSize: '14px',
                          lineHeight: '1.6'
                        }}>
                          "{item.student_answer}"
                        </p>
                      </div>

                      {/* AI Feedback */}
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#38bdf8', textTransform: 'uppercase', marginBottom: '4px' }}>
                          AI Coach Feedback
                        </div>
                        <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.5' }}>
                          {item.ai_feedback}
                        </p>
                      </div>

                      {/* Improved Answer */}
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#10b981', textTransform: 'uppercase', marginBottom: '4px' }}>
                          Improved Model Answer
                        </div>
                        <p style={{
                          background: 'rgba(16, 185, 129, 0.08)',
                          border: '1px solid rgba(16, 185, 129, 0.25)',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          color: '#d1fae5',
                          fontSize: '14px',
                          lineHeight: '1.6'
                        }}>
                          {item.improved_answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Email Report Modal */}
      <EmailModal
        report={report}
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
      />
    </div>
  );
}
