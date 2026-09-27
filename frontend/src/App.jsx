import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import SetupPage from './pages/SetupPage';
import ResumeAnalysisPage from './pages/ResumeAnalysisPage';
import InterviewRoomPage from './pages/InterviewRoomPage';
import FinalReportPage from './pages/FinalReportPage';
import DashboardPage from './pages/DashboardPage';
import { startInterviewSession } from './services/api';

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [setupConfig, setSetupConfig] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [initialQuestion, setInitialQuestion] = useState(null);
  const [finalReport, setFinalReport] = useState(null);

  // 1. Navigation from Landing to Setup
  const handleStartFromLanding = () => {
    setCurrentView('setup');
  };

  // 2. Setup -> Resume Analysis
  const handleProceedToAnalysis = (config) => {
    setSetupConfig(config);
    setCurrentView('analysis');
  };

  // 3. Resume Analysis -> Live Interview
  const handleStartLiveInterview = async (resumeData) => {
    try {
      const payload = {
        candidate_name: setupConfig.candidateName,
        candidate_email: setupConfig.candidateEmail,
        role: setupConfig.role,
        interview_type: setupConfig.interviewType,
        difficulty: setupConfig.difficulty,
        duration_minutes: setupConfig.durationMinutes,
        resume_data: resumeData
      };

      const res = await startInterviewSession(payload);
      setSessionData(res.session);
      setInitialQuestion(res.question);
      setCurrentView('interview');
    } catch (err) {
      console.warn('Backend start endpoint fallback, creating local interview session:', err);
      // Local fallback session
      const fallbackSession = {
        id: 'sess_' + Date.now(),
        candidate_name: setupConfig.candidateName,
        candidate_email: setupConfig.candidateEmail,
        role: setupConfig.role,
        interview_type: setupConfig.interviewType,
        difficulty: setupConfig.difficulty,
        duration_minutes: setupConfig.durationMinutes
      };
      const primaryProject = resumeData?.projects?.[0]?.name || "AI Smart Traffic Management System";
      const fallbackQuestion = {
        id: 'q_1',
        interview_id: fallbackSession.id,
        question_number: 1,
        question_text: `Welcome to your Intervexa mock interview! To get started, I was reviewing your resume and noticed your project '${primaryProject}'. Could you walk me through the problem it solves and your core technical architecture?`,
        category: setupConfig.interviewType || 'Technical',
        context_note: `Exploration of resume project: ${primaryProject}`
      };
      setSessionData(fallbackSession);
      setInitialQuestion(fallbackQuestion);
      setCurrentView('interview');
    }
  };

  // 4. Interview Finished -> Final Report
  const handleInterviewFinished = (report) => {
    setFinalReport(report);
    setCurrentView('report');
  };

  // 5. Practice Again
  const handlePracticeAgain = () => {
    setCurrentView('setup');
  };

  // 6. View Specific Report from Dashboard
  const handleViewReport = (report) => {
    setFinalReport(report);
    setCurrentView('report');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar currentView={currentView} onNavigate={setCurrentView} />

      <main style={{ flex: 1 }}>
        {currentView === 'landing' && (
          <LandingPage onStartInterview={handleStartFromLanding} />
        )}

        {currentView === 'setup' && (
          <SetupPage onProceedToAnalysis={handleProceedToAnalysis} />
        )}

        {currentView === 'analysis' && (
          <ResumeAnalysisPage
            setupConfig={setupConfig}
            onStartLiveInterview={handleStartLiveInterview}
          />
        )}

        {currentView === 'interview' && sessionData && (
          <InterviewRoomPage
            sessionData={sessionData}
            initialQuestion={initialQuestion}
            onInterviewFinished={handleInterviewFinished}
          />
        )}

        {currentView === 'report' && (
          <FinalReportPage
            report={finalReport}
            onPracticeAgain={handlePracticeAgain}
            onNavigateDashboard={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardPage
            onStartNewInterview={() => setCurrentView('setup')}
            onViewReport={handleViewReport}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(56, 189, 248, 0.1)',
        padding: '24px 0',
        background: 'rgba(6, 9, 19, 0.95)',
        textAlign: 'center',
        color: '#64748b',
        fontSize: '13px'
      }}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Intervexa AI Interview Coach. Built for college students & freshers.</p>
        </div>
      </footer>
    </div>
  );
}
