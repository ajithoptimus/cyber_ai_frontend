import React, { useState, useEffect } from 'react';
import { AlertCircle, TrendingUp, Shield, Activity } from 'lucide-react';
import FileUpload from './FileUpload'; // Import your existing FileUpload component
import WhoisLookup from './WhoisLookup';
import IPLookup from './IPLookup';
import DNSLookup from './DNSLookup';
import ThreatCheck from './ThreatCheck';
import BreachCheck from './BreachCheck';
import GitHubIntegration from './GitHubIntegration';

// Add other OSINT components as we create them




// NEW: API interface for backend data
interface BackendDashboardData {
  unified_risk_score: number;
  risk_level: string;
  total_findings: number;
  critical_issues: number;
  executive_summary: {
    title: string;
    message: string;
    alert_level: string;
  };
  immediate_actions: string[];
  next_steps: string[];
  reputation_cards: {
    domain_reputation: { status: string; message: string; };
    ip_address_reputation: { status: string; message: string; };
    whois_lookup: { status: string; message: string; };
    dns_records: { status: string; message: string; };
  };
  system_status: string;
}

// Keep your existing AnalysisData interface for backward compatibility
interface AnalysisData {
  riskScore: number;
  riskLevel: string;
  totalFindings: number;
  criticalIssues: number;
  threats: Array<{
    type: string;
    status: string;
    description: string;
  }>;
}

interface DashboardProps {
  data: AnalysisData;
  activeFeature: string;
}

const Dashboard: React.FC<DashboardProps> = ({ data, activeFeature }) => {
  // NEW: State for backend data
  const [backendData, setBackendData] = useState<BackendDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // NEW: Fetch real data from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/v1/dashboard/frontend/summary');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const backendResult = await response.json();
        setBackendData(backendResult);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we're on the threat intelligence feature
    if (activeFeature === 'threat-intelligence') {
      fetchDashboardData();
      // Refresh every 5 minutes
      const interval = setInterval(fetchDashboardData, 300000);
      return () => clearInterval(interval);
    }
  }, [activeFeature]);

  // Use backend data if available, fallback to props data
  const displayData = backendData ? {
    riskScore: backendData.unified_risk_score,
    riskLevel: backendData.risk_level,
    totalFindings: backendData.total_findings,
    criticalIssues: backendData.critical_issues,
    threats: [
      {
        type: 'Domain Reputation',
        status: backendData.reputation_cards.domain_reputation.status,
        description: backendData.reputation_cards.domain_reputation.message
      },
      {
        type: 'IP Address Reputation', 
        status: backendData.reputation_cards.ip_address_reputation.status,
        description: backendData.reputation_cards.ip_address_reputation.message
      },
      {
        type: 'WHOIS Lookup',
        status: backendData.reputation_cards.whois_lookup.status,
        description: backendData.reputation_cards.whois_lookup.message
      },
      {
        type: 'DNS Records',
        status: backendData.reputation_cards.dns_records.status,
        description: backendData.reputation_cards.dns_records.message
      }
    ]
  } : data;

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
    const strokeDashoffset = circumference - (displayData.riskScore / 10) * circumference;
    
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
            className={`${getRiskColor(displayData.riskLevel)} transition-all duration-2000`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold ${getRiskColor(displayData.riskLevel)}`}>
            {displayData.riskScore.toFixed(1)}
          </span>
          <span className="text-sm text-gray-400 uppercase tracking-wider">
            {displayData.riskLevel}
          </span>
        </div>
      </div>
    );
  };

  // NEW: Handle File Analysis feature
  if (activeFeature === 'file-analysis') {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">File Analysis</h1>
          <p className="text-gray-400">Upload files for comprehensive security analysis</p>
        </div>
        <FileUpload />
      </div>
    );
  }

  if (activeFeature === 'github-integration') {
  return <GitHubIntegration />;
  }

  if (activeFeature === 'whois-lookup') {
  return <WhoisLookup />;
  }

  

  if (activeFeature === 'dns-records') {
  return <DNSLookup />;
  }
  
  if (activeFeature === 'ip-lookup') {
  return <IPLookup />;
  }
  if (activeFeature === 'threat-check') {
  return <ThreatCheck />;
  }

  if (activeFeature === 'breach-check') {
  return <BreachCheck />;
  }

  if (activeFeature === 'ai-reports') {
    return (
      <div className="bg-gray-800 p-6 rounded-lg">
        <h1 className="text-3xl font-bold text-white mb-4">AI Reports</h1>
        <p className="text-gray-400">AI-generated security reports and insights will appear here.</p>
        <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg">
          <p className="text-blue-400">🚧 Feature under development - Coming soon!</p>
        </div>
      </div>
    );
  }

  // DEFAULT: Threat Intelligence Dashboard
  if (activeFeature === 'threat-intelligence') {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Threat Intelligence Dashboard</h1>
          <p className="text-gray-400">
            Real-time security analysis and threat assessment overview
            {backendData ? ' (Live Data)' : ' (Demo Data)'}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              <span className="ml-3 text-gray-400">Loading live security data...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-800/20 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400">
              ⚠️ Unable to connect to backend: {error}. Showing demo data.
            </p>
          </div>
        )}

        {/* Risk Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 text-center">Unified Risk Score</h3>
            <div className="flex justify-center mb-4">
              <RiskGauge />
            </div>
            <div className="text-center">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                displayData.riskLevel === 'HIGH' 
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}>
                <div className="w-2 h-2 bg-current rounded-full mr-2 animate-pulse"></div>
                {displayData.riskLevel} RISK DETECTED
              </span>
            </div>
          </div>

          <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-orange-400" />
              Executive Summary {backendData && <span className="text-xs text-green-400 ml-2">(LIVE)</span>}
            </h3>
            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-4 mb-4">
              <p className="text-gray-200 leading-relaxed">
                {backendData ? (
                  backendData.executive_summary.message
                ) : (
                  <>
                    <strong className="text-orange-400">⚠️ IMMEDIATE ATTENTION REQUIRED:</strong> Current security analysis reveals a{' '}
                    <strong className="text-orange-300">{displayData.riskScore}/10 {displayData.riskLevel} risk level</strong> requiring 
                    executive attention. Analysis identified{' '}
                    <strong className="text-blue-400">{displayData.totalFindings} total findings</strong> with{' '}
                    <strong className="text-red-400">{displayData.criticalIssues} critical security issues</strong> requiring urgent remediation.
                  </>
                )}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h4 className="font-semibold text-red-300 mb-2 flex items-center">
                  <span className="mr-2">🎯</span> Immediate Actions
                </h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  {backendData ? (
                    backendData.immediate_actions.map((action, index) => (
                      <li key={index}>• {action}</li>
                    ))
                  ) : (
                    <>
                      <li>• Address {displayData.criticalIssues} critical vulnerabilities</li>
                      <li>• Emergency security review</li>
                      <li>• Enhance monitoring protocols</li>
                    </>
                  )}
                </ul>
              </div>
              
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-300 mb-2 flex items-center">
                  <span className="mr-2">📅</span> Next Steps
                </h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  {backendData ? (
                    backendData.next_steps.map((step, index) => (
                      <li key={index}>• {step}</li>
                    ))
                  ) : (
                    <>
                      <li>• Security review: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</li>
                      <li>• Compliance assessment</li>
                      <li>• Risk reassessment in 7 days</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Threat Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayData.threats.map((threat, index) => (
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
            <p className="text-3xl font-bold text-white mb-2">{displayData.totalFindings}</p>
            <p className="text-blue-300 font-medium">Security Findings</p>
          </div>

          <div className="bg-gradient-to-br from-red-500/20 to-red-600/30 rounded-lg p-6 border border-red-500/40">
            <div className="flex items-center justify-between mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
              <span className="text-xs text-red-300 bg-red-500/30 px-2 py-1 rounded-full font-bold">
                URGENT
              </span>
            </div>
            <p className="text-3xl font-bold text-white mb-2">{displayData.criticalIssues}</p>
            <p className="text-red-300 font-medium">Critical Issues</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/30 rounded-lg p-6 border border-orange-500/40">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-orange-400" />
              <span className="text-xs text-orange-300 bg-orange-500/30 px-2 py-1 rounded-full font-bold">
                STATUS
              </span>
            </div>
            <p className="text-3xl font-bold text-white mb-2">{displayData.riskLevel}</p>
            <p className="text-orange-300 font-medium">Risk Level</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-600/30 rounded-lg p-6 border border-green-500/40">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-green-400" />
              <span className="text-xs text-green-300 bg-green-500/30 px-2 py-1 rounded-full font-bold">
                SYSTEM
              </span>
            </div>
            <p className="text-3xl font-bold text-white mb-2">
              {backendData ? backendData.system_status : 'ONLINE'}
            </p>
            <p className="text-green-300 font-medium">Platform Status</p>
          </div>
        </div>
      </div>
    );
  }

  // Fallback for any unhandled features
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h1 className="text-3xl font-bold text-white mb-4 capitalize">
        {activeFeature.replace(/-/g, ' ')}
      </h1>
      <p className="text-gray-400">
        Detailed analysis for {activeFeature.replace(/-/g, ' ')} will appear here.
      </p>
      <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg">
        <p className="text-blue-400">🚧 Feature under development - Coming soon!</p>
      </div>
    </div>
  );
};

export default Dashboard;
