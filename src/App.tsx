import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AIAssistant from './components/AIAssistant';
import LandingScreen from './components/LandingScreen';

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

  const handleAnalysisComplete = (data: AnalysisData) => {
    setAnalysisData(data);
    setHasAnalysis(true);
  };

  const handleReset = () => {
    setHasAnalysis(false);
    setAnalysisData(null);
    setActiveFeature('threat-intelligence'); // Reset to default feature
  };

  // NEW: Features that don't require analysis
  const alwaysAvailableFeatures = [
    'github-integration',
    'whois-lookup', 
    'dns-records',
    'ip-lookup',
    'threat-check',
    'breach-check',
    'file-analysis'
  ];

  // NEW: Check if current feature is always available
  const isFeatureAlwaysAvailable = alwaysAvailableFeatures.includes(activeFeature);

  // NEW: Better condition for showing dashboard
  const shouldShowDashboard = hasAnalysis || isFeatureAlwaysAvailable;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header onReset={handleReset} />
      
      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Sidebar */}
        <div className="w-80 bg-gray-800 border-r border-gray-700">
          <Sidebar 
            activeFeature={activeFeature} 
            onFeatureSelect={setActiveFeature}
            disabled={!hasAnalysis} // Still disabled for analysis-dependent features
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Dashboard/Landing Area */}
          <div className="flex-1 p-6">
            {shouldShowDashboard ? (
              <Dashboard 
                data={analysisData || {
                  riskScore: 0,
                  riskLevel: 'LOW',
                  totalFindings: 0,
                  criticalIssues: 0,
                  threats: [],
                  lastUpdated: new Date().toISOString()
                }} 
                activeFeature={activeFeature}
              />
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
