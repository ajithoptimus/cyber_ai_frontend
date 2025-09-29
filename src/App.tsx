import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AIAssistant from './components/AIAssistant';
import LandingScreen from './components/LandingScreen';
import InfrastructureAnalysis from './components/InfrastructureAnalysis';
import SmartRiskDashboard from './components/SmartRiskDashboard';
// Add missing imports
import ThreatIntelligence from './components/ThreatCheck'; // Assuming ThreatCheck is ThreatIntelligence
import WhoLookup from './components/WhoLookup';
import DNSLookup from './components/DNSLookup';
import IPLookup from './components/IPLookup';
import ThreatCheck from './components/ThreatCheck';
import BreachCheck from './components/BreachCheck';
import FileUpload from './components/FileUpload';
import GitHubIntegration from './components/GitHubIntegration';

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
    setActiveFeature('threat-intelligence');
  };

  // Updated: Infrastructure Analysis and AI Risk Intelligence are always available
  const alwaysAvailableFeatures = [
    'github-integration',
    'infrastructure-analysis',
    'smart-risk-analysis',  // NEW: Added AI Risk Intelligence
    'whois-lookup', 
    'dns-records',
    'ip-lookup',
    'threat-check',
    'breach-check',
    'file-analysis'
  ];

  const isFeatureAlwaysAvailable = alwaysAvailableFeatures.includes(activeFeature);
  const shouldShowDashboard = hasAnalysis || isFeatureAlwaysAvailable;

  // UPDATED: Complete renderActiveFeature with SmartRiskDashboard
  const renderActiveFeature = () => {
    switch (activeFeature) {
      case 'threat-intelligence':
        return <ThreatIntelligence />;
      case 'whois-lookup':
        return <WhoLookup />;
      case 'dns-records':
        return <DNSLookup />;
      case 'ip-lookup':
        return <IPLookup />;
      case 'threat-check':
        return <ThreatCheck />;
      case 'breach-check':
        return <BreachCheck />;
      case 'file-analysis':
        return <FileUpload />;
      case 'github-integration':
        return <GitHubIntegration />;
      case 'infrastructure-analysis':
        return <InfrastructureAnalysis />;
      case 'smart-risk-analysis':  // NEW: AI Risk Intelligence
        return <SmartRiskDashboard />;
      case 'ai-reports':
        return <AIAssistant />;
      default:
        return <LandingScreen onAnalysisComplete={handleAnalysisComplete} />;
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
            onFeatureSelect={setActiveFeature}
            disabled={!hasAnalysis}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* UPDATED: Use renderActiveFeature for feature-specific components */}
          <div className="flex-1 p-6">
            {shouldShowDashboard ? (
              // Show specific feature component
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
