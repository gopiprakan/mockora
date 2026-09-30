import React, { useState, useEffect } from 'react';
import { Award, ArrowRight, Calendar, Clock, BarChart2, CheckCircle, Sparkles, FileText, TrendingUp } from 'lucide-react';
import { listAllReports } from '../services/api';

export default function DashboardPage({ onStartNewInterview, onViewReport }) {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      setIsLoading(true);
      try {
        const data = await listAllReports();
        setReports(data);
      } catch (err) {
        console.error('Failed to load dashboard reports:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadReports();
  }, []);

  const totalInterviews = reports.length;
  const avgScore = totalInterviews > 0
    ? Math.round(reports.reduce((acc, r) => acc + (r.overall_score !== undefined ? r.overall_score : 0), 0) / totalInterviews)
    : 0;
  const maxScore = totalInterviews > 0
    ? Math.max(...reports.map(r => r.overall_score !== undefined ? r.overall_score : 0))
    : 0;

  return (
    <div className="container" style={{ padding: '36px 20px 80px', maxWidth: '1080px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '18px',
        marginBottom: '36px'
      }}>
        <div>
          <span className="badge-cyber" style={{ marginBottom: '10px' }}>
            <Sparkles size={13} />
            Student Dashboard
          </span>
          <h1 style={{ fontSize: '32px', color: '#f8fafc', letterSpacing: '-0.02em' }}>
            Your Practice Performance History
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '15px', marginTop: '4px' }}>
            Track your interview practice milestones and monitor score improvements over time.
          </p>
        </div>

        <button
          onClick={onStartNewInterview}
          className="btn-primary"
          style={{ padding: '13px 26px' }}
        >
          <Sparkles size={16} />
          Start New Interview
        </button>
      </div>

      {/* Analytics KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div className="cyber-card" style={{ padding: '26px' }}>
          <div className="hud-corner-tl" />
          <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '700' }}>
            Interviews Completed
          </div>
          <div style={{ fontSize: '38px', fontWeight: '900', color: '#00f0ff', marginTop: '6px', fontFamily: 'var(--font-heading)' }}>
            {totalInterviews > 0 ? totalInterviews : 1}
          </div>
          <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={13} />
            Consistent Practice Rhythm
          </div>
        </div>

        <div className="cyber-card" style={{ padding: '26px' }}>
          <div className="hud-corner-tl" />
          <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '700' }}>
            Average Practice Score
          </div>
          <div style={{ fontSize: '38px', fontWeight: '900', color: '#38bdf8', marginTop: '6px', fontFamily: 'var(--font-heading)' }}>
            {avgScore}<span style={{ fontSize: '18px', color: '#64748b' }}>/100</span>
          </div>
          <div style={{ fontSize: '12px', color: '#38bdf8', marginTop: '4px' }}>
            Solid technical foundation
          </div>
        </div>

        <div className="cyber-card" style={{ padding: '26px' }}>
          <div className="hud-corner-tl" />
          <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '700' }}>
            Highest Score Achieved
          </div>
          <div style={{ fontSize: '38px', fontWeight: '900', color: '#10b981', marginTop: '6px', fontFamily: 'var(--font-heading)' }}>
            {maxScore}<span style={{ fontSize: '18px', color: '#64748b' }}>/100</span>
          </div>
          <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>
            Top percentile readiness
          </div>
        </div>

        <div className="cyber-card" style={{ padding: '26px' }}>
          <div className="hud-corner-tl" />
          <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '700' }}>
            Primary Focus Domain
          </div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#a855f7', marginTop: '12px' }}>
            {reports[0]?.role || "Software Engineering"}
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
            Adaptive resume coverage
          </div>
        </div>
      </div>

      {/* Reports Table / Card List */}
      <section>
        <h2 style={{ fontSize: '22px', color: '#f8fafc', marginBottom: '18px' }}>
          Recent Interview Sessions
        </h2>

        {isLoading ? (
          <div className="cyber-card" style={{ padding: '50px', textAlign: 'center', color: '#94a3b8' }}>
            Loading interview history...
          </div>
        ) : reports.length === 0 ? (
          <div className="cyber-card" style={{ padding: '50px 30px', textAlign: 'center' }}>
            <FileText size={44} color="#38bdf8" style={{ margin: '0 auto 14px' }} />
            <h3 style={{ fontSize: '20px', color: '#f8fafc', marginBottom: '8px' }}>No Saved Interviews Yet</h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', maxWidth: '420px', margin: '0 auto 24px' }}>
              Complete your first simulated AI mock interview to generate your comprehensive assessment report.
            </p>
            <button onClick={onStartNewInterview} className="btn-primary">
              Take Your First Interview
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {reports.map((r, idx) => (
              <div
                key={r.id || idx}
                className="cyber-card cyber-card-interactive"
                style={{
                  padding: '22px 28px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '18px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <h3 style={{ fontSize: '18px', color: '#f8fafc', fontWeight: '700' }}>
                      {r.role} Mock Interview
                    </h3>
                    <span className="badge-cyber" style={{ fontSize: '11px' }}>
                      {r.duration_minutes || 15} Min
                    </span>
                  </div>

                  <div style={{ fontSize: '13px', color: '#94a3b8', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                    <span>Candidate: <strong style={{ color: '#cbd5e1' }}>{r.candidate_name}</strong></span>
                    <span>&bull;</span>
                    <span>Date: {r.created_at ? new Date(r.created_at).toLocaleDateString() : 'Recent Session'}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Score</div>
                    <div style={{ fontSize: '26px', fontWeight: '900', color: '#00f0ff', fontFamily: 'var(--font-heading)' }}>
                      {r.overall_score}<span style={{ fontSize: '14px', color: '#64748b' }}>/100</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onViewReport(r)}
                    className="btn-secondary"
                    style={{ padding: '9px 18px', fontSize: '13px' }}
                  >
                    View Report
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
