import React, { useState, useEffect } from 'react';
import { AlertCircle, TrendingUp, Shield, Activity } from 'lucide-react';
import FileUpload from './FileUpload';
import WhoisLookup from './WhoisLookup';
import IPLookup from './IPLookup';
import DNSLookup from './DNSLookup';
import ThreatCheck from './ThreatCheck';
import BreachCheck from './BreachCheck';
import GitHubIntegration from './GitHubIntegration';
import AIPerformanceAnalytics from './AIPerformanceAnalytics';
import ScanResultsDisplay from './ScanResultsDisplay';

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
    domain_reputation: { status: string; message: string };
    ip_address_reputation: { status: string; message: string };
    whois_lookup: { status: string; message: string };
    dns_records: { status: string; message: string };
  };
  system_status: string;
}

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
  overall_risk_score?: number;
  summary?: string;
  prioritized_findings?: any[];
}

interface DashboardProps {
  data: AnalysisData;
  activeFeature: string;
}

const Dashboard: React.FC<DashboardProps> = ({ data, activeFeature }) => {
  const [backendData, setBackendData] = useState<BackendDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setError(error instanceof Error ? error.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    if (activeFeature === 'threat-intelligence') {
      fetchDashboardData();
      const interval = setInterval(fetchDashboardData, 300000);
      return () => clearInterval(interval);
    }
  }, [activeFeature]);

  // Safe data access with fallback
  const displayData = backendData?.reputation_cards
    ? {
        riskScore: backendData.unified_risk_score,
        riskLevel: backendData.risk_level,
        totalFindings: backendData.total_findings,
        criticalIssues: backendData.critical_issues,
        threats: [
          {
            type: 'Domain Reputation',
            status: backendData.reputation_cards.domain_reputation.status,
            description: backendData.reputation_cards.domain_reputation.message,
          },
          {
            type: 'IP Address Reputation',
            status: backendData.reputation_cards.ip_address_reputation.status,
            description: backendData.reputation_cards.ip_address_reputation.message,
          },
          {
            type: 'WHOIS Lookup',
            status: backendData.reputation_cards.whois_lookup.status,
            description: backendData.reputation_cards.whois_lookup.message,
          },
          {
            type: 'DNS Records',
            status: backendData.reputation_cards.dns_records.status,
            description: backendData.reputation_cards.dns_records.message,
          },
        ],
      }
    : data;

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
          <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(75, 85, 99, 0.3)" strokeWidth="8" />
          <circle cx="70" cy="70" r="60" fill="none" stroke="currentColor" strokeWidth="8"
            strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
            className={`${getRiskColor(displayData.riskLevel)} transition-all duration-2000`} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold ${getRiskColor(displayData.riskLevel)}`}>
            {displayData.riskScore.toFixed(1)}
          </span>
          <span className="text-sm text-gray-400 uppercase tracking-wider">{displayData.riskLevel}</span>
        </div>
      </div>
    );
  };

  // === FEATURE ROUTING ===
  
  if (activeFeature === 'file-analysis') {
    // Demo/test object if real findings array missing or empty
    const demoAnalysis = {
      overall_risk_score: 7.5,
      summary: "Demo scan complete. Critical finding requires attention.",
      prioritized_findings: [
        {
          title: "Hardcoded Secret Token",
          severity: "CRITICAL",
          file: "src/config.js",
          line: 45,
          description: "A secret token is committed in code.",
          solution_summary: "Move it to ENV and revoke the token.",
          suggested_fix: {
            type: "REPLACE_LINE",
            file: "src/config.js",
            start_line: 45,
            end_line: 45,
            new_content: "const TOKEN = process.env.TOKEN;"
          }
        }
      ]
    };

    const showScan =
      data.prioritized_findings && Array.isArray(data.prioritized_findings) && data.prioritized_findings.length > 0;

    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">File Analysis</h1>
          <p className="text-gray-400">Upload files for comprehensive security analysis</p>
        </div>
        <FileUpload />
        <div className="mt-8">
          {/* This now always shows the ScanResultsDisplay,
              using demoAnalysis if there is no real data */}
          <ScanResultsDisplay analysis={showScan ? data : demoAnalysis} />
        </div>
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
  if (activeFeature === 'ai-performance') {
    return <AIPerformanceAnalytics />;
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
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Overall Risk Score</h2>
              <p className="text-gray-400">
                Comprehensive security analysis based on {displayData.totalFindings} findings
              </p>
            </div>
            <RiskGauge />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Findings</p>
                <p className="text-3xl font-bold text-white mt-2">{displayData.totalFindings}</p>
              </div>
              <Activity className="w-12 h-12 text-blue-400" />
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Critical Issues</p>
                <p className="text-3xl font-bold text-red-400 mt-2">{displayData.criticalIssues}</p>
              </div>
              <AlertCircle className="w-12 h-12 text-red-400" />
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Risk Level</p>
                <p className={`text-3xl font-bold mt-2 ${getRiskColor(displayData.riskLevel)}`}>
                  {displayData.riskLevel}
                </p>
              </div>
              <Shield className="w-12 h-12 text-yellow-400" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayData.threats.map((threat, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{threat.type}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  threat.status === 'CLEAN' ? 'bg-green-500/20 text-green-400' :
                  threat.status === 'VERIFIED' ? 'bg-blue-500/20 text-blue-400' :
                  threat.status === 'CONFIGURED' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {threat.status}
                </span>
              </div>
              <p className="text-gray-400 text-sm">{threat.description}</p>
            </div>
          ))}
        </div>
        {error && (
          <div className="bg-red-900/20 border border-red-500 p-4 rounded-lg">
            <p className="text-red-400">Error loading data: {error}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h1 className="text-3xl font-bold text-white mb-4 capitalize">{activeFeature.replace(/-/g, ' ')}</h1>
      <p className="text-gray-400">Detailed analysis for {activeFeature.replace(/-/g, ' ')} will appear here.</p>
      <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg">
        <p className="text-blue-400">🚧 Feature under development - Coming soon!</p>
      </div>
    </div>
  );
};

export default Dashboard;
