import React from 'react';
import { Shield, Eye, Zap, Upload, Github } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleGitHubSignIn = () => {
    window.location.href = 'http://localhost:8000/api/v1/auth/login/github';
  };

  return (
    <div className="min-h-screen bg-[#1a2332] text-white flex flex-col items-center justify-center p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">
          Welcome to <span className="text-blue-400">Cyber.AI</span>
        </h1>
        <p className="text-xl text-gray-400">
          Executive Security Platform for Real-time Threat Intelligence and Risk Analysis
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-3 gap-8 mb-16 max-w-4xl">
        <div className="text-center">
          <Shield className="w-12 h-12 text-blue-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-2">Threat Detection</h3>
          <p className="text-sm text-gray-400">Advanced AI-powered security analysis</p>
        </div>
        <div className="text-center">
          <Eye className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-2">Real-time Monitoring</h3>
          <p className="text-sm text-gray-400">Continuous security posture assessment</p>
        </div>
        <div className="text-center">
          <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-2">Instant Analysis</h3>
          <p className="text-sm text-gray-400">Immediate threat intelligence reports</p>
        </div>
      </div>

      {/* Main CTAs */}
      <div className="grid grid-cols-2 gap-8 max-w-6xl w-full">
        {/* Quick File Scan */}
        <div className="bg-[#233447] rounded-lg p-8 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Upload className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-semibold">Quick File Scan</h2>
          </div>
          <p className="text-gray-400 mb-6">
            Upload individual security files like logs, reports, or code snippets for a quick, one-off analysis.
          </p>

          <div className="border-2 border-dashed border-gray-600 rounded-lg p-12 text-center mb-6 hover:border-blue-500 transition-colors cursor-pointer">
            <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-white font-medium mb-2">Drag and drop your files here</p>
            <p className="text-blue-400 text-sm">or click to browse</p>
          </div>

          <button
            onClick={() => navigate('/file-analysis')}
            className="w-full py-3 px-6 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors font-medium"
          >
            Start Security Analysis
          </button>
        </div>

        {/* Full Platform Access */}
        <div className="bg-[#233447] rounded-lg p-8 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Github className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-semibold">Full Platform Access</h2>
          </div>
          <p className="text-gray-400 mb-6">
            Sign in with your GitHub account to unlock the full suite of tools, including continuous repository scanning, dashboard analytics, and automated security monitoring.
          </p>

          <div className="bg-[#1a2332] rounded-lg p-12 mb-6 flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              <Github className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500">Connect your GitHub account</p>
            </div>
          </div>

          <button
            onClick={handleGitHubSignIn}
            className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Github className="w-5 h-5" />
            Sign in with GitHub
          </button>
        </div>
      </div>

      {/* Public Features Link */}
      <div className="mt-12 text-center">
        <p className="text-gray-400 mb-4">
          Or explore our free security tools without signing in
        </p>
        <button
          onClick={() => navigate('/threat-intelligence')}
          className="text-blue-400 hover:text-blue-300 underline"
        >
          Browse Public Security Tools →
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
