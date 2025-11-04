// src/App.tsx

import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  useNavigate, 
  useLocation
} from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AIAssistant from './components/AIAssistant';
import LandingScreen from './components/LandingScreen';
import InfrastructureAnalysis from './components/InfrastructureAnalysis';
import SmartRiskDashboard from './components/SmartRiskDashboard';
import AIPerformanceAnalytics from './components/AIPerformanceAnalytics';
import ThreatIntelligenceDashboard from './components/ThreatIntelligenceDashboard';
import AIDetectionDashboard from './components/AIDetectionDashboard';
import SIEMIntegrationDashboard from './components/SIEMIntegrationDashboard';
import PredictiveAnalyticsDashboard from './components/PredictiveAnalyticsDashboard';
import ComplianceDashboard from './pages/Compliance/ComplianceDashboard';
import IncidentResponseDashboard from './pages/IncidentResponse/IncidentResponseDashboard';
import AIReportsDashboard from './components/AIReportsDashboard';
import LoggedOutPage from './pages/LoggedOutPage';
import GithubRepoList from './pages/GithubRepoList';
import AuthCallbackPage from './pages/AuthCallbackPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import WelcomePage from './pages/WelcomePage';
import { useAuth } from './contexts/AuthContext';

// NEW: Admin Users Page
import AdminUsersPage from './pages/AdminUsersPage';

export interface AnalysisData {
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  totalFindings: number;
  criticalIssues: number;
  threats: Array<{
    type: string;
    status: string;
    description: string;
  }>;
  lastUpdated: string;
  overall_risk_score?: number;
  summary?: string;
  prioritized_findings?: any[];
}

const PUBLIC_FEATURES = [
  'threat-intelligence',
  'whois-lookup',
  'dns-records',
  'ip-lookup',
  'threat-check'
];

const PREMIUM_FEATURES = [
  'github-integration',
  'breach-check',
  'file-analysis',
  'infrastructure-analysis',
  'smart-risk-analysis',
  'ai-detection',
  'siem-integration',
  'predictive-analytics',
  'threat-intel-live',
  'ai-performance',
  'compliance-governance',
  'incident-response',
  'ai-reports'
];

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, isLoggedIn } = useAuth();
  const [hasAnalysis, setHasAnalysis] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [activeFeature, setActiveFeature] = useState('threat-intelligence');

  // --- UPDATED: Include /github-repos <-> github-integration ---
  const urlToFeatureMap: Record<string, string> = {
    '/threat-intelligence': 'threat-intelligence',
    '/whois-lookup': 'whois-lookup',
    '/dns-records': 'dns-records',
    '/ip-lookup': 'ip-lookup',
    '/threat-check': 'threat-check',
    '/breach-check': 'breach-check',
    '/file-analysis': 'file-analysis',
    '/github': 'github-integration',
    '/github-repos': 'github-integration', // <-- The correct alias
    '/infrastructure': 'infrastructure-analysis',
    '/risk': 'smart-risk-analysis',
    '/ai-detection': 'ai-detection',
    '/siem': 'siem-integration',
    '/predictive': 'predictive-analytics',
    '/live-threats': 'threat-intel-live',
    '/ai-performance': 'ai-performance',
    '/compliance': 'compliance-governance',
    '/incident-response': 'incident-response',
    '/ai-reports': 'ai-reports'
  };

  const featureToUrlMap: Record<string, string> = {
    'threat-intelligence': '/threat-intelligence',
    'whois-lookup': '/whois-lookup',
    'dns-records': '/dns-records',
    'ip-lookup': '/ip-lookup',
    'threat-check': '/threat-check',
    'breach-check': '/breach-check',
    'file-analysis': '/file-analysis',
    'github-integration': '/github-repos', // <-- This is the canonical route now
    'infrastructure-analysis': '/infrastructure',
    'smart-risk-analysis': '/risk',
    'ai-detection': '/ai-detection',
    'siem-integration': '/siem',
    'predictive-analytics': '/predictive',
    'threat-intel-live': '/live-threats',
    'ai-performance': '/ai-performance',
    'compliance-governance': '/compliance',
    'incident-response': '/incident-response',
    'ai-reports': '/ai-reports'
  };

  useEffect(() => {
    const feature = urlToFeatureMap[location.pathname];
    if (feature && feature !== activeFeature) {
      setActiveFeature(feature);
    }
  }, [location.pathname, activeFeature, urlToFeatureMap]);

  const handleAnalysisComplete = (data: AnalysisData) => {
    setAnalysisData(data);
    setHasAnalysis(true);
  };

  const handleReset = () => {
    setHasAnalysis(false);
    setAnalysisData(null);
    setActiveFeature('threat-intelligence');
    navigate('/threat-intelligence');
  };

  const handleFeatureSelect = (feature: string) => {
    if (PREMIUM_FEATURES.includes(feature) && !isLoggedIn) {
      navigate('/login');
      return;
    }
    setActiveFeature(feature);
    const url = featureToUrlMap[feature] || '/threat-intelligence';
    if (location.pathname !== url) {
      navigate(url);
    }
  };

  const alwaysAvailableFeatures = [...PUBLIC_FEATURES, ...PREMIUM_FEATURES];
  const isFeatureAlwaysAvailable = alwaysAvailableFeatures.includes(activeFeature);
  const shouldShowDashboard = hasAnalysis || isFeatureAlwaysAvailable;

  const demoScanAnalysis: AnalysisData = {
    riskScore: 7.2,
    riskLevel: 'HIGH',
    totalFindings: 1,
    criticalIssues: 1,
    threats: [],
    lastUpdated: new Date().toISOString(),
    overall_risk_score: 7.2,
    summary: "Test Scan: critical vulnerability found in config.js (demo mode)",
    prioritized_findings: [
      {
        title: "Hardcoded Password",
        severity: "CRITICAL",
        file: "config.js",
        line: 11,
        description: "Password found directly in code.",
        solution_summary: "Use environment variable.",
        suggested_fix: {
          type: "REPLACE_LINE",
          file: "config.js",
          start_line: 11,
          end_line: 11,
          new_content: "const password = process.env.DB_PASSWORD;"
        }
      }
    ]
  };

  const renderActiveFeature = () => {
    switch (activeFeature) {
      case 'infrastructure-analysis':
        return <InfrastructureAnalysis />;
      case 'smart-risk-analysis':
        return <SmartRiskDashboard />;
      case 'ai-performance':
        return <AIPerformanceAnalytics />;
      case 'threat-intel-live':
        return <ThreatIntelligenceDashboard />;
      case 'ai-detection':
        return <AIDetectionDashboard />;
      case 'siem-integration':
        return <SIEMIntegrationDashboard />;
      case 'predictive-analytics':
        return <PredictiveAnalyticsDashboard />;
      case 'compliance-governance':
        return <ComplianceDashboard />;
      case 'incident-response':
        return <IncidentResponseDashboard />;
      case 'ai-reports':
        return <AIReportsDashboard />;
      case 'github-integration': // <-- Show GithubRepoList for this feature
        return <GithubRepoList />;
      case 'file-analysis':
        const scanData =
          analysisData && analysisData.prioritized_findings && analysisData.prioritized_findings.length > 0
            ? analysisData
            : demoScanAnalysis;
        return (
          <Dashboard
            activeFeature={activeFeature}
            data={scanData}
          />
        );
      default:
        return (
          <Dashboard
            activeFeature={activeFeature}
            data={analysisData || {
              riskScore: 0,
              riskLevel: 'LOW',
              totalFindings: 0,
              criticalIssues: 0,
              threats: [],
              lastUpdated: new Date().toISOString()
            }}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header onReset={handleReset} onLogout={logout} />
      <div className="flex h-[calc(100vh-64px)]">
        <div className="w-80 bg-gray-800 border-r border-gray-700 overflow-y-auto scrollbar-hide">
          <Sidebar
            activeFeature={activeFeature}
            onFeatureSelect={handleFeatureSelect}
            disabled={!hasAnalysis}
          />
        </div>
        <div className="flex h-full flex-1">
          <div className="flex-1 p-6 overflow-y-auto scrollbar-hide">
            {shouldShowDashboard ? (
              renderActiveFeature()
            ) : (
              <LandingScreen onAnalysisComplete={handleAnalysisComplete} />
            )}
          </div>
          <div className="w-96 bg-gray-800 border-l border-gray-700 overflow-y-auto scrollbar-hide">
            <AIAssistant
              disabled={!hasAnalysis && !isFeatureAlwaysAvailable}
              dashboardContext={{
                riskScore: analysisData?.riskScore || 72,
                complianceLevel: 85,
                openIncidents: 1,
                criticalFindings: analysisData?.criticalIssues || 3,
                currentPage: activeFeature
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        Loading session...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Welcome/Home Page (First Visit) */}
        <Route path="/" element={
          <div className="min-h-screen bg-gray-900">
            <Header onReset={() => {}} onLogout={() => {}} />
            <WelcomePage />
          </div>
        } />

        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        {/* Dashboard & Features */}
        <Route path="/threat-intelligence" element={<AppContent />} />
        <Route path="/whois-lookup" element={<AppContent />} />
        <Route path="/dns-records" element={<AppContent />} />
        <Route path="/ip-lookup" element={<AppContent />} />
        <Route path="/threat-check" element={<AppContent />} />
        <Route path="/breach-check" element={<AppContent />} />
        <Route path="/file-analysis" element={<AppContent />} />
        <Route path="/github" element={<AppContent />} />
        <Route path="/github-repos" element={<AppContent />} /> {/* Canonical route */}
        <Route path="/infrastructure" element={<AppContent />} />
        <Route path="/risk" element={<AppContent />} />
        <Route path="/ai-detection" element={<AppContent />} />
        <Route path="/siem" element={<AppContent />} />
        <Route path="/predictive" element={<AppContent />} />
        <Route path="/live-threats" element={<AppContent />} />
        <Route path="/ai-performance" element={<AppContent />} />
        <Route path="/compliance" element={<AppContent />} />
        <Route path="/incident-response" element={<AppContent />} />
        <Route path="/ai-reports" element={<AppContent />} />
        <Route path="/logged-out" element={<LoggedOutPage />} />
        
        {/* Admin Users Dashboard */}
        <Route path="/admin/users" element={<AdminUsersPage />} />
      </Routes>
    </Router>
  );
}

export default App;
