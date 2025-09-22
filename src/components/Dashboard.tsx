import React from 'react';
import { AlertCircle, TrendingUp, Shield, Activity } from 'lucide-react';
import type { AnalysisData } from '../App';

interface DashboardProps {
  data: AnalysisData;
  activeFeature: string;
}

const Dashboard: React.FC<DashboardProps> = ({ data, activeFeature }) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'text-green-400';
      case 'MEDIUM': return 'text-yellow-400'; 
      case 'HIGH': return 'text-orange-400';
      case 'CRITICAL': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  const RiskGauge = () => {
    const circumference = 2 * Math.PI * 60;
    const strokeDashoffset = circumference - (data.riskScore / 10) * circumference;
    
    return (
      <div className="relative flex items-center justify-center">
        <svg width="140" height="140" className="transform -rotate-90">
          <circle
            cx="70"
            cy="70"
            r="60"
            fill="none"
            stroke="rgba(75, 85, 99, 0.3)"
            strokeWidth="8"
          />
          <circle
            cx="70"
            cy="70"
            r="60"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`${getRiskColor(data.riskLevel)} transition-all duration-2000`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold ${getRiskColor(data.riskLevel)}`}>
            {data.riskScore.toFixed(1)}
          </span>
          <span className="text-sm text-gray-400 uppercase tracking-wider">
            {data.riskLevel}
          </span>
        </div>
      </div>
    );
  };

  if (activeFeature === 'threat-intelligence') {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Threat Intelligence Dashboard</h1>
          <p className="text-gray-400">Real-time security analysis and threat assessment overview</p>
        </div>

        {/* Risk Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 text-center">Unified Risk Score</h3>
            <div className="flex justify-center mb-4">
              <RiskGauge />
            </div>
            <div className="text-center">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                data.riskLevel === 'HIGH' 
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}>
                <div className="w-2 h-2 bg-current rounded-full mr-2 animate-pulse"></div>
                {data.riskLevel} RISK DETECTED
              </span>
            </div>
          </div>

          <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-orange-400" />
              Executive Summary
            </h3>
            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-4 mb-4">
              <p className="text-gray-200 leading-relaxed">
                <strong className="text-orange-400">⚠️ IMMEDIATE ATTENTION REQUIRED:</strong> Current security analysis reveals a{' '}
                <strong className="text-orange-300">{data.riskScore}/10 {data.riskLevel} risk level</strong> requiring 
                executive attention. Analysis identified{' '}
                <strong className="text-blue-400">{data.totalFindings} total findings</strong> with{' '}
                <strong className="text-red-400">{data.criticalIssues} critical security issues</strong> requiring urgent remediation.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h4 className="font-semibold text-red-300 mb-2 flex items-center">
                  <span className="mr-2">🎯</span> Immediate Actions
                </h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Address {data.criticalIssues} critical vulnerabilities</li>
                  <li>• Emergency security review</li>
                  <li>• Enhance monitoring protocols</li>
                </ul>
              </div>
              
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-300 mb-2 flex items-center">
                  <span className="mr-2">📅</span> Next Steps
                </h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Security review: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</li>
                  <li>• Compliance assessment</li>
                  <li>• Risk reassessment in 7 days</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Threat Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.threats.map((threat, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-5 border border-gray-700">
              <h3 className="font-semibold text-white mb-2">{threat.type}</h3>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-3 ${
                threat.status === 'High' 
                  ? 'bg-red-800/30 text-red-400 border border-red-700'
                  : threat.status === 'Medium'
                  ? 'bg-yellow-800/30 text-yellow-400 border border-yellow-700'
                  : 'bg-green-800/30 text-green-400 border border-green-700'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
                {threat.status}
              </span>
              <p className="text-sm text-gray-400">{threat.description}</p>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/30 rounded-lg p-6 border border-blue-500/40">
            <div className="flex items-center justify-between mb-4">
              <Shield className="w-8 h-8 text-blue-400" />
              <span className="text-xs text-blue-300 bg-blue-500/30 px-2 py-1 rounded-full font-bold">
                TOTAL
              </span>
            </div>
            <p className="text-3xl font-bold text-white mb-2">{data.totalFindings}</p>
            <p className="text-blue-300 font-medium">Security Findings</p>
          </div>

          <div className="bg-gradient-to-br from-red-500/20 to-red-600/30 rounded-lg p-6 border border-red-500/40">
            <div className="flex items-center justify-between mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
              <span className="text-xs text-red-300 bg-red-500/30 px-2 py-1 rounded-full font-bold">
                URGENT
              </span>
            </div>
            <p className="text-3xl font-bold text-white mb-2">{data.criticalIssues}</p>
            <p className="text-red-300 font-medium">Critical Issues</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/30 rounded-lg p-6 border border-orange-500/40">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-orange-400" />
              <span className="text-xs text-orange-300 bg-orange-500/30 px-2 py-1 rounded-full font-bold">
                STATUS
              </span>
            </div>
            <p className="text-3xl font-bold text-white mb-2">{data.riskLevel}</p>
            <p className="text-orange-300 font-medium">Risk Level</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-600/30 rounded-lg p-6 border border-green-500/40">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-green-400" />
              <span className="text-xs text-green-300 bg-green-500/30 px-2 py-1 rounded-full font-bold">
                SYSTEM
              </span>
            </div>
            <p className="text-3xl font-bold text-white mb-2">ONLINE</p>
            <p className="text-green-300 font-medium">Platform Status</p>
          </div>
        </div>
      </div>
    );
  }

  // Other feature views can be added here
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h1 className="text-3xl font-bold text-white mb-4 capitalize">
        {activeFeature.replace(/-/g, ' ')}
      </h1>
      <p className="text-gray-400">
        Detailed analysis for {activeFeature.replace(/-/g, ' ')} will appear here.
      </p>
    </div>
  );
};

export default Dashboard;
