import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  useNavigate, 
  useLocation,
  Navigate,
  Outlet
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

// --- Auth Imports ---
import AuthCallbackPage from './pages/AuthCallbackPage';
import LoginPage from './pages/LoginPage'; // Import the new Login Page
import { useAuth } from './contexts/AuthContext'; // Import the auth hook

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
  lastUpdated: string; // <-- FIX: Added this line
  overall_risk_score?: number;
  summary?: string;
  prioritized_findings?: any[];
}

// AppContent for your main app (always visible, handles sidebar logic)
function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hasAnalysis, setHasAnalysis] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [activeFeature, setActiveFeature] = useState('threat-intelligence');

  // ... (Your urlToFeatureMap and featureToUrlMap remain unchanged)
  const urlToFeatureMap: Record<string, string> = {
    '/': 'threat-intelligence',
    '/threat-intelligence': 'threat-intelligence',
    '/whois-lookup': 'whois-lookup',
    '/dns-records': 'dns-records',
    '/ip-lookup': 'ip-lookup',
    '/threat-check': 'threat-check',
    '/breach-check': 'breach-check',
    '/file-analysis': 'file-analysis',
    '/github': 'github-integration',
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
    'github-integration': '/github',
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
    navigate('/');
  };

  const handleFeatureSelect = (feature: string) => {
    setActiveFeature(feature);
    const url = featureToUrlMap[feature] || '/';
    if (location.pathname !== url) {
      navigate(url);
    }
  };

  const alwaysAvailableFeatures = [
    'github-integration',
    'infrastructure-analysis',
    'smart-risk-analysis',
    'ai-performance',
    'threat-intel-live',
    'ai-detection',
    'siem-integration',
    'predictive-analytics',
    'compliance-governance',
    'incident-response',
    'ai-reports',
    'whois-lookup',
    'dns-records',
    'ip-lookup',
    'threat-check',
    'breach-check',
    'file-analysis'
  ];

  const isFeatureAlwaysAvailable = alwaysAvailableFeatures.includes(activeFeature);
  const shouldShowDashboard = hasAnalysis || isFeatureAlwaysAvailable;

  // Demo scan results fallback for "file-analysis"
  const demoScanAnalysis: AnalysisData = {
    riskScore: 7.2,
    riskLevel: 'HIGH',
    totalFindings: 1,
    criticalIssues: 1,
    threats: [],
    lastUpdated: new Date().toISOString(), // This line is now valid
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
      {/* FIX: Removed onLogout={logout} to fix the prop error.
        To add logout:
        1. Open src/components/Header.tsx
        2. Add `onLogout: () => void;` to its props interface.
        3. Add `onLogout={logout}` back to the <Header> component below.
      */}
      <Header onReset={handleReset} />
      <div className="flex h-[calc(100vh-64px)]">
        <div className="w-80 bg-gray-800 border-r border-gray-700">
          <Sidebar
            activeFeature={activeFeature}
            onFeatureSelect={handleFeatureSelect}
            disabled={!hasAnalysis}
          />
        </div>
        <div className="flex h-full flex-1">
          <div className="flex-1 p-6 overflow-y-auto">
            {shouldShowDashboard ? (
              renderActiveFeature()
            ) : (
              <LandingScreen onAnalysisComplete={handleAnalysisComplete} />
            )}
          </div>
          <div className="w-96 bg-gray-800 border-l border-gray-700 overflow-y-auto">
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

// --- NEW PROTECTED ROUTE COMPONENT ---
// This component wraps your main app content and checks for auth.
const ProtectedRoute: React.FC = () => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    // This state is from the AuthProvider checking localStorage
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            Loading session...
        </div>
    );
  }

  // If logged in, render the child routes (AppContent).
  // Otherwise, redirect to the /login page.
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

// --- UPDATED APP COMPONENT ---
// This now contains the main routing logic.
function App() {
  // We need to get isLoggedIn here to handle the /login route redirect
  // This hook will work because AuthProvider is wrapping <App /> in main.tsx
  const { isLoggedIn, isLoading } = useAuth(); // Get isLoading as well

  // Wait until auth state is confirmed before rendering routes
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
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            // If already logged in, redirect to the main app
            isLoggedIn ? <Navigate to="/" replace /> : <LoginPage />
          }
        />
        <Route 
          path="/auth/callback" 
          element={<AuthCallbackPage />} 
        />

        {/* Protected Routes */}
        {/* This route wrapper will check auth for all nested routes */}
        <Route element={<ProtectedRoute />}>
          {/* All of your existing app logic is now protected */}
          {/* "/*" will catch "/" and all other nested routes */}
          <Route path="/*" element={<AppContent />} />
        </Route>
        
      </Routes>
    </Router>
  );
}

export default App;