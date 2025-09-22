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
          {/* Dashboard/Landing Area */}
          <div className="flex-1 p-6">
            {hasAnalysis && analysisData ? (
              <Dashboard 
                data={analysisData} 
                activeFeature={activeFeature}
              />
            ) : (
              <LandingScreen onAnalysisComplete={handleAnalysisComplete} />
            )}
          </div>

          {/* Right AI Assistant Panel */}
          <div className="w-96 bg-gray-800 border-l border-gray-700">
            <AIAssistant disabled={!hasAnalysis} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
