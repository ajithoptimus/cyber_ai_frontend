import React, { useState } from 'react';
import { Upload, Shield, Zap, Eye } from 'lucide-react';
import type { AnalysisData } from '../App';

interface LandingScreenProps {
  onAnalysisComplete: (data: AnalysisData) => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onAnalysisComplete }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [dragOver, setDragOver] = useState(false);

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

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome to <span className="text-blue-400">Cyber.AI</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl">
          Executive Security Platform for Real-time Threat Intelligence and Risk Analysis
        </p>
      </div>

      <div className="grid grid-cols-3 gap-8 mb-8">
        <div className="text-center">
          <Shield className="w-12 h-12 text-blue-400 mx-auto mb-3" />
          <h3 className="font-semibold text-white">Threat Detection</h3>
          <p className="text-sm text-gray-400">Advanced AI-powered security analysis</p>
        </div>
        <div className="text-center">
          <Eye className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <h3 className="font-semibold text-white">Real-time Monitoring</h3>
          <p className="text-sm text-gray-400">Continuous security posture assessment</p>
        </div>
        <div className="text-center">
          <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
          <h3 className="font-semibold text-white">Instant Analysis</h3>
          <p className="text-sm text-gray-400">Immediate threat intelligence reports</p>
        </div>
      </div>

      <div className="w-full max-w-2xl space-y-6">
        {/* File Upload Area */}
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            dragOver 
              ? 'border-blue-400 bg-blue-400/10' 
              : 'border-gray-600 bg-gray-800/50'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            {selectedFile ? selectedFile.name : 'Upload Security Data'}
          </h3>
          <p className="text-gray-400 mb-4">
            Drag and drop your security files here, or click to browse
          </p>
          <input
            type="file"
            className="hidden"
            id="file-upload"
            onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
            accept=".json,.csv,.log,.txt"
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg cursor-pointer transition-colors"
          >
            <Upload className="w-5 h-5 mr-2" />
            Select File
          </label>
        </div>

        {/* Analysis Button */}
        <button
          onClick={startAnalysis}
          disabled={!selectedFile || analyzing}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
        >
          {analyzing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
              Analyzing Security Data...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Shield className="w-6 h-6 mr-3" />
              Start Security Analysis
            </div>
          )}
        </button>
      </div>

      {analyzing && (
        <div className="text-center space-y-2">
          <div className="text-blue-400 font-semibold">Analysis Progress</div>
          <div className="w-96 bg-gray-700 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse" style={{width: '75%'}}></div>
          </div>
          <div className="text-sm text-gray-400">Processing threat intelligence data...</div>
        </div>
      )}
    </div>
  );
};

export default LandingScreen;
