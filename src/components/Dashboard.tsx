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
}

interface DashboardProps {
  data: AnalysisData;
  activeFeature: string;
}

const Dashboard: React.FC<DashboardProps> = ({ data, activeFeature }) => {
  const [backendData, setBackendData] = useState<BackendDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // DEBUG: Log active feature
  console.log('🔍 Dashboard rendered with activeFeature:', activeFeature);

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

    if (activeFeature === 'threat-intelligence') {
      fetchDashboardData();
      const interval = setInterval(fetchDashboardData, 300000);
      return () => clearInterval(interval);
    }
  }, [activeFeature]);

  const displayData = backendData
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
    console.log('📄 Rendering File Analysis');
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
    console.log('🔗 Rendering GitHub Integration');
    return <GitHubIntegration />;
  }

  if (activeFeature === 'whois-lookup') {
    console.log('🌐 Rendering WHOIS Lookup');
    return <WhoisLookup />;
  }

  if (activeFeature === 'dns-records') {
    console.log('📡 Rendering DNS Lookup');
    return <DNSLookup />;
  }

  if (activeFeature === 'ip-lookup') {
    console.log('🔍 Rendering IP Lookup');
    return <IPLookup />;
  }

  if (activeFeature === 'threat-check') {
    console.log('⚠️ Rendering Threat Check');
    return <ThreatCheck />;
  }

  if (activeFeature === 'breach-check') {
    console.log('🔓 Rendering Breach Check');
    return <BreachCheck />;
  }

  // AI PERFORMANCE - ADD THIS BEFORE AI REPORTS
  if (activeFeature === 'ai-performance') {
    console.log('🤖 Rendering AI Performance Analytics');
    return <AIPerformanceAnalytics />;
  }

  if (activeFeature === 'ai-reports') {
    console.log('📊 Rendering AI Reports');
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
    console.log('🛡️ Rendering Threat Intelligence');
    return (
      <div className="space-y-6">
        {/* ... YOUR EXISTING THREAT INTELLIGENCE CODE ... */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Threat Intelligence Dashboard</h1>
          <p className="text-gray-400">
            Real-time security analysis and threat assessment overview
            {backendData ? ' (Live Data)' : ' (Demo Data)'}
          </p>
        </div>
        {/* ... rest of threat intelligence dashboard ... */}
      </div>
    );
  }

  console.log('❓ Rendering fallback for feature:', activeFeature);
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
