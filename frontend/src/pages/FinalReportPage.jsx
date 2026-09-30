import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import EmailModal from '../components/EmailModal';
import { 
  Award, Mail, Printer, RotateCcw, CheckCircle2, AlertTriangle, 
  BookOpen, MessageSquare, Sparkles, ChevronDown, ChevronUp, BarChart2, Check, ArrowRight, ShieldCheck
} from 'lucide-react';

export default function FinalReportPage({ report, onPracticeAgain, onNavigateDashboard }) {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState({});

  useEffect(() => {
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 }
    });
  }, []);

  const toggleQuestion = (idx) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const overallScore = report?.overall_score || 82;
  const categories = report?.category_scores || {
    "Technical Knowledge": 84,
    "Problem Solving": 85,
    "Communication & Fluency": 78,
    "Answer Relevance": 88,
    "Answer Structure": 76
  };
  const strengths = report?.strengths || [
    "Good understanding of programming concepts and architectural components",
    "Relevant project explanations tied directly to the problem domain",
    "Logical problem-solving approach to edge case handling"
  ];
  const improvements = report?.areas_to_improve || [
    "Give more real-world quantitative examples and production trade-offs",
    "Structure complex answers using the STAR method (Situation, Task, Action, Result)",
    "Deepen explanation of database query optimization and error recovery"
  ];
  const topics = report?.recommended_topics || [
    "SQL Indexing & Query Plans",
    "OOP & SOLID Principles",
    "REST API Caching",
    "Distributed Data Consistency"
  ];
  const commSummary = report?.communication_summary || {
    camera_engagement: "Good",
    long_pauses: 2,
    filler_words: 4,
    average_response_time: "3.8 seconds"
  };
  const questionsAnalysis = report?.questions_analysis || [];

  return (
    <div className="container" style={{ padding: '36px 20px 80px', maxWidth: '1080px' }}>
      {/* Top Banner & Action Buttons */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        marginBottom: '32px',
        borderBottom: '1px solid rgba(56, 189, 248, 0.18)',
        paddingBottom: '24px'
      }}>
        <div>
          <span className="badge-cyber" style={{ marginBottom: '10px' }}>
            <Award size={13} />
            Performance Assessment
          </span>
          <h1 style={{
            fontSize: 'clamp(26px, 4.2vw, 38px)',
            color: '#f8fafc',
            letterSpacing: '0.04em',
            textTransform: 'uppercase'
          }}>
            MOCKORA INTERVIEW REPORT
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '15px', marginTop: '6px' }}>
            Candidate: <strong style={{ color: '#f8fafc' }}>{report?.candidate_name || 'Candidate'}</strong> &nbsp;&bull;&nbsp;
            Role: <strong style={{ color: '#00f0ff' }}>{report?.role || 'Software Developer'}</strong> &nbsp;&bull;&nbsp;
            Duration: <strong style={{ color: '#f8fafc' }}>{report?.duration_minutes || 15} minutes</strong>
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <button
            onClick={() => setShowEmailModal(true)}
            className="btn-primary"
            style={{ padding: '11px 22px', fontSize: '14px' }}
          >
            <Mail size={16} />
            Email Report
          </button>

          <button
            onClick={() => window.print()}
            className="btn-secondary"
            style={{ padding: '11px 20px', fontSize: '14px' }}
          >
            <Printer size={16} />
            Print / PDF
          </button>

          <button
            onClick={onPracticeAgain}
            className="btn-secondary"
            style={{ padding: '11px 20px', fontSize: '14px' }}
          >
            <RotateCcw size={16} />
            Practice Again
          </button>
        </div>
      </div>

      {/* Hero Score Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '26px',
        marginBottom: '36px'
      }}>
        {/* Overall Practice Score Gauge */}
        <div className="cyber-card" style={{
          padding: '38px 24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at 50% 40%, rgba(13, 22, 42, 0.98) 0%, rgba(6, 9, 19, 0.99) 100%)',
          border: '1px solid rgba(0, 240, 255, 0.4)',
          boxShadow: '0 0 40px rgba(0, 240, 255, 0.18)',
          position: 'relative'
        }}>
          <div className="hud-corner-tl" />
          <div className="hud-corner-tr" />
          <div className="hud-corner-bl" />
          <div className="hud-corner-br" />

          <div style={{ fontSize: '13px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '800', marginBottom: '8px' }}>
            Overall Practice Score
          </div>

          <div style={{
            fontSize: '72px',
            fontFamily: 'var(--font-heading)',
            fontWeight: '900',
            lineHeight: '1',
            background: 'linear-gradient(135deg, #00f0ff 0%, #38bdf8 50%, #a855f7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '12px 0'
          }}>
            {overallScore}<span style={{ fontSize: '26px', color: '#64748b' }}>/100</span>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <span className={overallScore >= 80 ? "badge-green" : overallScore >= 60 ? "badge-cyber" : "badge-amber"} style={{ fontSize: '12px', padding: '4px 14px' }}>
              {overallScore >= 80 ? '✓ Placement Ready' : overallScore >= 60 ? 'Competent Foundation' : 'Needs Practice'}
            </span>
          </div>

          <p style={{ fontSize: '13px', color: '#94a3b8', maxWidth: '300px', lineHeight: '1.5' }}>
            AI-calibrated score measuring technical domain mastery, problem-solving flow, and articulate delivery.
          </p>
        </div>

        {/* Category Breakdown Progress Bars */}
        <div className="cyber-card" style={{ padding: '32px', position: 'relative' }}>
          <div className="hud-corner-tl" />
          <div className="hud-corner-tr" />

          <h3 style={{ fontSize: '17px', color: '#f8fafc', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Skill Evaluation Breakdown
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Object.entries(categories).map(([catName, scoreVal]) => (
              <div key={catName}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ color: '#cbd5e1', fontWeight: '600' }}>{catName}</span>
                  <span style={{ color: '#00f0ff', fontWeight: '800', fontFamily: 'var(--font-mono)' }}>{scoreVal}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#0a0f1e', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(56, 189, 248, 0.18)' }}>
                  <div style={{
                    width: `${scoreVal}%`,
                    height: '100%',
                    background: catName.includes('Technical')
                      ? 'linear-gradient(90deg, #0284c7, #00f0ff)'
                      : catName.includes('Problem')
                      ? 'linear-gradient(90deg, #8b5cf6, #c084fc)'
                      : catName.includes('Relevance')
                      ? 'linear-gradient(90deg, #059669, #34d399)'
                      : 'linear-gradient(90deg, #0284c7, #38bdf8)',
                    borderRadius: '4px',
                    transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strengths & Areas to Improve */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '26px',
        marginBottom: '36px'
      }}>
        {/* Strengths */}
        <div className="cyber-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <CheckCircle2 size={22} color="#10b981" />
            <h3 style={{ fontSize: '18px', color: '#10b981' }}>Key Strengths</h3>
          </div>
          <ul style={{ paddingLeft: '20px', margin: 0, color: '#cbd5e1', fontSize: '14px', lineHeight: '1.7' }}>
            {strengths.map((str, idx) => (
              <li key={idx} style={{ marginBottom: '8px' }}>{str}</li>
            ))}
          </ul>
        </div>

        {/* Areas to Improve */}
        <div className="cyber-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <AlertTriangle size={22} color="#f59e0b" />
            <h3 style={{ fontSize: '18px', color: '#f59e0b' }}>Areas to Improve</h3>
          </div>
          <ul style={{ paddingLeft: '20px', margin: 0, color: '#cbd5e1', fontSize: '14px', lineHeight: '1.7' }}>
            {improvements.map((imp, idx) => (
              <li key={idx} style={{ marginBottom: '8px' }}>{imp}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommended Topics & Communication Signals */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '26px',
        marginBottom: '40px'
      }}>
        {/* Recommended Topics */}
        <div className="cyber-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <BookOpen size={22} color="#38bdf8" />
            <h3 style={{ fontSize: '18px', color: '#f8fafc' }}>Recommended Topics</h3>
          </div>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '14px' }}>
            Focus your revision on these core concepts to excel in your upcoming technical rounds:
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
        <div className="cyber-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <MessageSquare size={22} color="#a855f7" />
            <h3 style={{ fontSize: '18px', color: '#f8fafc' }}>Communication Observations</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '12px 14px', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Camera Engagement</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#38bdf8', marginTop: '3px' }}>
                {commSummary.camera_engagement}
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '12px 14px', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Long Pauses</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc', marginTop: '3px' }}>
                {commSummary.long_pauses}
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '12px 14px', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Filler Words</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#f59e0b', marginTop: '3px' }}>
                {commSummary.filler_words}
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '12px 14px', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Avg Response Time</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#10b981', marginTop: '3px' }}>
                {commSummary.average_response_time}
              </div>
            </div>
          </div>
          <p style={{ fontSize: '11px', color: '#64748b', marginTop: '12px' }}>
            * Speech pacing, pauses, and filler words assess conversational fluidity under interview conditions.
          </p>
        </div>
      </div>

      {/* Question-by-Question Deep Analysis */}
      <section>
        <div style={{ marginBottom: '22px' }}>
          <h2 style={{ fontSize: '24px', color: '#f8fafc', marginBottom: '6px' }}>
            Question-by-Question Analysis
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>
            Review your answers, AI critique, and benchmark model responses.
          </p>
        </div>

        {questionsAnalysis.length === 0 ? (
          <div className="cyber-card" style={{ padding: '28px', textAlign: 'center', color: '#94a3b8' }}>
            No question-level transcript recorded.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {questionsAnalysis.map((item, idx) => {
              const isExpanded = expandedQuestions[idx] !== false;
              return (
                <div key={idx} className="cyber-card" style={{ padding: '26px' }}>
                  {/* Question Header Bar */}
                  <div
                    onClick={() => toggleQuestion(idx)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className="badge-cyber" style={{ fontSize: '12px' }}>
                        Q{item.question_number || idx + 1}
                      </span>
                      <h4 style={{ fontSize: '17px', color: '#f8fafc', fontWeight: '700' }}>
                        {item.question}
                      </h4>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span className="badge-green" style={{ fontSize: '13px' }}>
                        Score: {item.score}
                      </span>
                      {isExpanded ? <ChevronUp size={20} color="#94a3b8" /> : <ChevronDown size={20} color="#94a3b8" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={{ marginTop: '22px', paddingTop: '18px', borderTop: '1px solid rgba(56, 189, 248, 0.14)' }}>
                      {/* Candidate Answer */}
                      <div style={{ marginBottom: '18px' }}>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
                          Candidate's Answer
                        </div>
                        <p style={{
                          background: 'rgba(8, 14, 28, 0.85)',
                          padding: '14px 18px',
                          borderRadius: '10px',
                          border: '1px solid rgba(56, 189, 248, 0.15)',
                          color: '#cbd5e1',
                          fontSize: '14px',
                          lineHeight: '1.6'
                        }}>
                          "{item.student_answer}"
                        </p>
                      </div>

                      {/* AI Feedback */}
                      <div style={{ marginBottom: '18px' }}>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: '#38bdf8', textTransform: 'uppercase', marginBottom: '6px' }}>
                          AI Coach Feedback
                        </div>
                        <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.55' }}>
                          {item.ai_feedback}
                        </p>
                      </div>

                      {/* Improved Answer */}
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: '#10b981', textTransform: 'uppercase', marginBottom: '6px' }}>
                          Senior Engineer Model Answer
                        </div>
                        <p style={{
                          background: 'rgba(16, 185, 129, 0.09)',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          padding: '14px 18px',
                          borderRadius: '10px',
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
