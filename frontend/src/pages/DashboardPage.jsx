import React, { useState, useEffect } from 'react';
import { Award, ArrowRight, Calendar, Clock, BarChart2, CheckCircle, Sparkles, FileText } from 'lucide-react';
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
    ? Math.round(reports.reduce((acc, r) => acc + (r.overall_score || 0), 0) / totalInterviews)
    : 78;

  return (
    <div className="container" style={{ padding: '30px 20px 80px', maxWidth: '1040px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div>
          <span className="badge-cyber" style={{ marginBottom: '8px' }}>
            <Sparkles size={13} />
            Student Dashboard
          </span>
          <h1 style={{ fontSize: '30px', color: '#f8fafc', letterSpacing: '-0.02em' }}>
            Your Interview Performance History
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>
            Track your interview practice milestones and monitor score improvements over time.
          </p>
        </div>

        <button
          onClick={onStartNewInterview}
          className="btn-primary"
          style={{ padding: '12px 24px' }}
        >
          <Sparkles size={16} />
          Start New Interview
        </button>
      </div>

      {/* Analytics KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '36px'
      }}>
        <div className="cyber-card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Interviews Completed
          </div>
          <div style={{ fontSize: '36px', fontWeight: '800', color: '#00f0ff', marginTop: '6px' }}>
            {totalInterviews > 0 ? totalInterviews : 1}
          </div>
          <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>
            &uarr; Consistent practice
          </div>
        </div>

        <div className="cyber-card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Average Practice Score
          </div>
          <div style={{ fontSize: '36px', fontWeight: '800', color: '#38bdf8', marginTop: '6px' }}>
            {avgScore}<span style={{ fontSize: '18px', color: '#64748b' }}>/100</span>
          </div>
          <div style={{ fontSize: '12px', color: '#38bdf8', marginTop: '4px' }}>
            Strong technical foundation
          </div>
        </div>

        <div className="cyber-card" style={{ padding: '24px' }}>
          <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Primary Focus Domain
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#a855f7', marginTop: '12px' }}>
            {reports[0]?.role || "Software Engineering"}
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>
            Adaptive resume coverage
          </div>
        </div>
      </div>

      {/* Reports Table / Card List */}
      <section>
        <h2 style={{ fontSize: '20px', color: '#f8fafc', marginBottom: '16px' }}>
          Recent Interview Sessions
        </h2>

        {isLoading ? (
          <div className="cyber-card" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
            Loading interview history...
          </div>
        ) : reports.length === 0 ? (
          <div className="cyber-card" style={{ padding: '40px', textAlign: 'center' }}>
            <FileText size={40} color="#38bdf8" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '18px', color: '#f8fafc', marginBottom: '8px' }}>No Saved Interviews Yet</h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>
              Complete your first AI mock interview to generate an assessment report.
            </p>
            <button onClick={onStartNewInterview} className="btn-primary">
              Take Your First Interview
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {reports.map((r, idx) => (
              <div
                key={r.id || idx}
                className="cyber-card"
                style={{
                  padding: '20px 24px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '17px', color: '#f8fafc', fontWeight: '600' }}>
                      {r.role} Mock Interview
                    </h3>
                    <span className="badge-cyber" style={{ fontSize: '11px' }}>
                      {r.duration_minutes || 15} Min
                    </span>
                  </div>

                  <div style={{ fontSize: '13px', color: '#94a3b8', display: 'flex', gap: '16px' }}>
                    <span>Candidate: {r.candidate_name}</span>
                    <span>&bull;</span>
                    <span>Date: {r.created_at ? new Date(r.created_at).toLocaleDateString() : 'Recent'}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Score</div>
                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#00f0ff' }}>
                      {r.overall_score}<span style={{ fontSize: '14px', color: '#64748b' }}>/100</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onViewReport(r)}
                    className="btn-secondary"
                    style={{ padding: '8px 16px', fontSize: '13px' }}
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
