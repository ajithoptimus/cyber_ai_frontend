import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  const [hasAnalysis, setHasAnalysis] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [activeFeature, setActiveFeature] = useState('threat-intelligence');

  console.log('🔍 App.tsx - activeFeature:', activeFeature);

  const handleAnalysisComplete = (data: AnalysisData) => {
    setAnalysisData(data);
    setHasAnalysis(true);
  };

  const handleReset = () => {
    setHasAnalysis(false);
    setAnalysisData(null);
    setActiveFeature('threat-intelligence');
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
      
      case 'ai-reports':
        return <AIAssistant />;
      
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
            onFeatureSelect={(feature) => {
              console.log('🔘 Feature selected:', feature);
              setActiveFeature(feature);
            }}
            disabled={!hasAnalysis}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex">
          <div className="flex-1 p-6">
            {shouldShowDashboard ? (
              renderActiveFeature()
            ) : (
              <LandingScreen onAnalysisComplete={handleAnalysisComplete} />
            )}
          </div>

          {/* Right AI Assistant Panel */}
          <div className="w-96 bg-gray-800 border-l border-gray-700">
            <AIAssistant disabled={!hasAnalysis && !isFeatureAlwaysAvailable} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;


// app.tsx