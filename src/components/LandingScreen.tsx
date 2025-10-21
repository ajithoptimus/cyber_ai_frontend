import React, { useState } from 'react';
import { Upload, Shield, Zap, Eye, Github, UploadCloud } from 'lucide-react';
import type { AnalysisData } from '../App';

interface LandingScreenProps {
  onAnalysisComplete: (data: AnalysisData) => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onAnalysisComplete }) => {
  // --- STATE FOR YOUR EXISTING FILE UPLOAD ---
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // --- HANDLERS FOR YOUR EXISTING FILE UPLOAD ---
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const startAnalysis = async () => {
    if (!selectedFile) return;
    setAnalyzing(true);
    // Simulate analysis process
    setTimeout(() => {
      const mockData: AnalysisData = {
        riskScore: 7.7,
        riskLevel: 'HIGH',
        totalFindings: 42,
        criticalIssues: 7,
        threats: [
          { type: 'Domain Reputation', status: 'High', description: 'Exhibits high risk of malicious activity' },
          { type: 'IP Address Reputation', status: 'Medium', description: 'Low volume association with malicious activity' },
          { type: 'WHOIS Lookup', status: 'Safe', description: 'Trustworthy owner record' },
          { type: 'DNS Records', status: 'Medium', description: 'Potential issues in DNS settings' }
        ],
        lastUpdated: new Date().toISOString()
      };
      setAnalyzing(false);
      onAnalysisComplete(mockData);
    }, 3000);
  };

  // --- HANDLER FOR THE NEW GITHUB LOGIN ---
  const handleLogin = () => {
    // This redirects the user to our backend endpoint, which then handles the GitHub OAuth flow
    window.location.href = 'http://localhost:8000/api/v1/auth/login/github';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8">
      <div className="text-center w-full max-w-5xl mx-auto">
        {/* Main Header */}
        <h1 className="text-5xl font-bold mb-3">
          Welcome to <span className="text-blue-400">Cyber.AI</span>
        </h1>
        <p className="text-xl text-gray-400 mb-6">
          Executive Security Platform for Real-time Threat Intelligence and Risk Analysis
        </p>

        {/* Your existing feature icons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
          <div className="text-center">
            <Shield className="w-10 h-10 text-blue-400 mx-auto mb-2" />
            <h3 className="font-semibold text-white">Threat Detection</h3>
            <p className="text-sm text-gray-400">Advanced AI-powered security analysis</p>
          </div>
          <div className="text-center">
            <Eye className="w-10 h-10 text-green-400 mx-auto mb-2" />
            <h3 className="font-semibold text-white">Real-time Monitoring</h3>
            <p className="text-sm text-gray-400">Continuous security posture assessment</p>
          </div>
          <div className="text-center">
            <Zap className="w-10 h-10 text-yellow-400 mx-auto mb-2" />
            <h3 className="font-semibold text-white">Instant Analysis</h3>
            <p className="text-sm text-gray-400">Immediate threat intelligence reports</p>
          </div>
        </div>

        {/* --- NEW Two-Column Layout for Options --- */}
        <div className="grid md:grid-cols-2 gap-10 items-stretch">
          
          {/* Column 1: File Analysis (Your complete, existing UI) */}
          <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 h-full flex flex-col text-left">
            <div className="flex items-center text-2xl font-semibold mb-4">
              <UploadCloud className="mr-3 text-cyan-400 flex-shrink-0" />
              <h2>Quick File Scan</h2>
            </div>
            <p className="text-gray-400 mb-6">
              Upload individual security files like logs, reports, or code snippets for a quick, one-off analysis.
            </p>
            <div 
              className={`flex-grow border-2 border-dashed rounded-lg p-8 text-center flex flex-col justify-center transition-all ${
                dragOver ? 'border-blue-400 bg-blue-400/10' : 'border-gray-600'
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-md font-semibold text-white mb-2 break-all">
                {selectedFile ? selectedFile.name : 'Drag and drop your files here'}
              </h3>
              <input type="file" className="hidden" id="file-upload" onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])} />
              <label htmlFor="file-upload" className="text-blue-400 hover:underline cursor-pointer">
                or click to browse
              </label>
            </div>
            <button
              onClick={startAnalysis}
              disabled={!selectedFile || analyzing}
              className="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all"
            >
              {analyzing ? 'Analyzing...' : 'Start Security Analysis'}
            </button>
          </div>

          {/* Column 2: Full Platform Access via GitHub Login */}
          <div className="bg-gray-800 p-8 rounded-lg border border-blue-500/50 h-full flex flex-col text-left">
            <div className="flex items-center text-2xl font-semibold mb-4">
              <Github className="mr-3 text-purple-400 flex-shrink-0" />
              <h2>Full Platform Access</h2>
            </div>
            <p className="text-gray-400 mb-6 flex-grow">
              Sign in with your GitHub account to unlock the full suite of tools, including continuous repository scanning, dashboard analytics, and automated security monitoring.
            </p>
            <button
              onClick={handleLogin}
              className="w-full mt-auto flex items-center justify-center px-6 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold transition-colors"
            >
              <Github className="mr-2 h-5 w-5" />
              Sign in with GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;

