import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
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
import { RiskScoreDashboard } from './components/RiskScoreDashboard';


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
}


function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hasAnalysis, setHasAnalysis] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [activeFeature, setActiveFeature] = useState('threat-intelligence');


  console.log('🔍 App.tsx - activeFeature:', activeFeature);
  console.log('🌐 Current URL:', location.pathname);


  // URL to feature mapping
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


  // Feature to URL mapping (reverse)
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


  // Sync activeFeature with URL on mount and URL change
  useEffect(() => {
    const feature = urlToFeatureMap[location.pathname];
    if (feature && feature !== activeFeature) {
      console.log('📍 URL changed, setting feature:', feature);
      setActiveFeature(feature);
    }
  }, [location.pathname]);


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


  // Handle feature selection from sidebar
  const handleFeatureSelect = (feature: string) => {
    console.log('🔘 Feature selected:', feature);
    setActiveFeature(feature);
    
    // Update URL
    const url = featureToUrlMap[feature] || '/';
    if (location.pathname !== url) {
      navigate(url);
    }
  };


  // Always available features
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


  const renderActiveFeature = () => {
    console.log('🎯 Rendering feature:', activeFeature);


    switch (activeFeature) {
      case 'infrastructure-analysis':
        return <InfrastructureAnalysis />;


      case 'smart-risk-analysis':
        return <SmartRiskDashboard />;


      case 'ai-performance':
        console.log('🤖 Rendering AI Performance Analytics');
        return <AIPerformanceAnalytics />;


      case 'threat-intel-live':
        console.log('🛡️ Rendering Threat Intelligence Dashboard');
        return <ThreatIntelligenceDashboard />;


      case 'ai-detection':
        console.log('🎯 Rendering AI Detection Dashboard');
        return <AIDetectionDashboard />;


      case 'siem-integration':
        console.log('🔗 Rendering SIEM Integration Dashboard');
        return <SIEMIntegrationDashboard />;


      case 'predictive-analytics':
        console.log('🔮 Rendering Predictive Analytics Dashboard');
        return <PredictiveAnalyticsDashboard />;


      case 'compliance-governance':
        console.log('📋 Rendering Compliance & Governance Dashboard');
        return <ComplianceDashboard />;


      case 'incident-response':
        console.log('🚨 Rendering Incident Response Dashboard');
        return <IncidentResponseDashboard />;


      case 'ai-reports':
        console.log('📊 Rendering AI Reports Dashboard');
        return <AIReportsDashboard />;


      default:
        console.log('📊 Rendering Dashboard for feature:', activeFeature);
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
      <Header onReset={handleReset} />


      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Sidebar */}
        <div className="w-80 bg-gray-800 border-r border-gray-700">
          <Sidebar
            activeFeature={activeFeature}
            onFeatureSelect={handleFeatureSelect}
            disabled={!hasAnalysis}
          />
        </div>


        {/* Main Content + AI Assistant Container */}
        <div className="flex h-full flex-1">
          {/* Main Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            {shouldShowDashboard ? (
              renderActiveFeature()
            ) : (
              <LandingScreen onAnalysisComplete={handleAnalysisComplete} />
            )}
          </div>


          {/* Right AI Assistant Panel */}
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


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </Router>
  );
}


export default App;

// app.tsx


