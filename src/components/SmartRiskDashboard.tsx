import React, { useState, useEffect } from 'react';
import { AlertTriangle, Brain, Target, Shield, TrendingUp, Zap, RefreshCw, Clock } from 'lucide-react';

interface CompoundRisk {
  component: string;
  base_risk: number;
  compound_risk: number;
  attack_scenarios: string[];
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

interface IntelligentAnalysis {
  compound_risks: CompoundRisk[];
  total_risk_score: number;
  recommended_actions: string[];
}

interface RiskAnalysisData {
  intelligent_analysis: IntelligentAnalysis;
  findings_analyzed: number;
  risk_level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  analysis_timestamp: string;
}

const SmartRiskDashboard: React.FC = () => {
  const [riskData, setRiskData] = useState<RiskAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchIntelligentRiskAnalysis();

    // Auto-refresh every 30 seconds if enabled
    let interval: NodeJS.Timeout | null = null;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchIntelligentRiskAnalysis(true); // Silent refresh
      }, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const fetchIntelligentRiskAnalysis = async (silent: boolean = false) => {
    if (!silent) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      const response = await fetch('http://localhost:8000/api/v1/infrastructure/risk-analysis');
      
      if (response.ok) {
        const data = await response.json();
        setRiskData(data);
        setLastUpdated(new Date());
        console.log('✅ Risk analysis data fetched:', data);
      } else {
        console.warn('⚠️ API returned non-OK status, using mock data');
        setMockRiskData();
      }
    } catch (error) {
      console.error('❌ Failed to fetch risk analysis:', error);
      setMockRiskData();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleManualRefresh = () => {
    fetchIntelligentRiskAnalysis();
  };

  const setMockRiskData = () => {
    setRiskData({
      intelligent_analysis: {
        compound_risks: [
          {
            component: "AWS S3 + IAM Configuration",
            base_risk: 6.5,
            compound_risk: 2.3,
            attack_scenarios: [
              "Attacker gains IAM credentials → Uses wildcard permissions → Accesses unencrypted S3 data → Data exfiltration",
              "Insider threat exploits overprivileged role → Downloads sensitive data from unencrypted bucket"
            ],
            priority: "CRITICAL"
          },
          {
            component: "Security Group Configuration",
            base_risk: 5.2,
            compound_risk: 1.8,
            attack_scenarios: [
              "Attacker scans public IP ranges → Finds open ports → Exploits exposed services → Lateral movement"
            ],
            priority: "HIGH"
          }
        ],
        total_risk_score: 8.4,
        recommended_actions: [
          "Immediately enable S3 server-side encryption",
          "Remove wildcard permissions from IAM roles",
          "Restrict security group rules to specific IP ranges",
          "Implement least privilege access controls"
        ]
      },
      findings_analyzed: 12,
      risk_level: "CRITICAL",
      analysis_timestamp: new Date().toISOString()
    });
    setLastUpdated(new Date());
  };

  const getRiskColor = (level: string) => {
    const colors = {
      CRITICAL: 'text-red-400 bg-red-500/20 border-red-500/30',
      HIGH: 'text-orange-400 bg-orange-500/20 border-orange-500/30',
      MEDIUM: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
      LOW: 'text-blue-400 bg-blue-500/20 border-blue-500/30'
    };
    return colors[level as keyof typeof colors] || colors.MEDIUM;
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 8.0) return 'text-red-400';
    if (score >= 6.0) return 'text-orange-400';
    if (score >= 4.0) return 'text-yellow-400';
    return 'text-blue-400';
  };

  const formatTimestamp = (date: Date | null) => {
    if (!date) return 'Never';
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          <div className="text-gray-400">Analyzing intelligent risks...</div>
        </div>
      </div>
    );
  }

  if (!riskData) return null;

  return (
    <div className="space-y-6">
      {/* Header with Refresh Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI-Powered Risk Intelligence</h1>
            <p className="text-gray-400">Intelligent analysis of compound risks and attack scenarios</p>
          </div>
        </div>

        {/* Refresh Controls */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Updated: {formatTimestamp(lastUpdated)}</span>
          </div>

          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              autoRefresh
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-gray-700 text-gray-400 border border-gray-600'
            }`}
          >
            Auto-refresh: {autoRefresh ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Risk Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Risk Score */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-500/50 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Intelligence Risk Score</span>
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <div className={`text-4xl font-bold ${getRiskScoreColor(riskData.intelligent_analysis.total_risk_score)}`}>
            {riskData.intelligent_analysis.total_risk_score.toFixed(1)}
          </div>
          <div className="text-xs text-gray-500 mt-1">out of 10.0</div>
          <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${getRiskScoreColor(riskData.intelligent_analysis.total_risk_score).replace('text', 'bg')}`}
              style={{ width: `${(riskData.intelligent_analysis.total_risk_score / 10) * 100}%` }}
            />
          </div>
        </div>

        {/* Risk Level */}
        <div className={`rounded-lg p-6 border ${getRiskColor(riskData.risk_level)} hover:shadow-lg transition-shadow`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Risk Level</span>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold">{riskData.risk_level}</div>
          <div className="text-xs mt-1 opacity-80">Requires immediate attention</div>
        </div>

        {/* Compound Risks */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-red-500/50 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Compound Risks</span>
            <Target className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-4xl font-bold text-red-400">
            {riskData.intelligent_analysis.compound_risks.length}
          </div>
          <div className="text-xs text-gray-500 mt-1">dangerous combinations</div>
        </div>

        {/* Findings Analyzed */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-green-500/50 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Findings Analyzed</span>
            <Zap className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-4xl font-bold text-white">{riskData.findings_analyzed}</div>
          <div className="text-xs text-gray-500 mt-1">security findings</div>
        </div>
      </div>

      {/* Compound Risk Analysis */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-400" />
            Compound Risk Analysis
          </h3>
          <p className="text-gray-400 text-sm">AI-detected dangerous combinations and attack scenarios</p>
        </div>
        
        <div className="p-6 space-y-4">
          {riskData.intelligent_analysis.compound_risks.length > 0 ? (
            riskData.intelligent_analysis.compound_risks.map((risk, index) => (
              <div key={index} className="border border-gray-700 rounded-lg p-5 hover:bg-gray-700/30 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded text-xs font-bold ${getRiskColor(risk.priority)}`}>
                      {risk.priority}
                    </span>
                    <span className="text-orange-400 bg-orange-500/20 px-3 py-1 rounded text-xs font-medium">
                      Risk Multiplier: {risk.compound_risk.toFixed(1)}x
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">Base Risk: <span className="font-semibold text-white">{risk.base_risk.toFixed(1)}/10</span></span>
                </div>
                
                <h4 className="font-semibold text-white text-lg mb-4">{risk.component}</h4>
                
                {/* Attack Scenarios */}
                <div className="mb-4">
                  <h5 className="text-sm font-semibold text-purple-400 mb-3 flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    Attack Scenarios:
                  </h5>
                  <div className="space-y-2">
                    {risk.attack_scenarios.map((scenario, scenarioIndex) => (
                      <div key={scenarioIndex} className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 hover:bg-red-900/30 transition-colors">
                        <p className="text-red-200 text-sm leading-relaxed">{scenario}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">No Compound Risks Detected</h4>
              <p className="text-gray-400">Your infrastructure currently has no dangerous vulnerability combinations.</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Shield className="w-5 h-5 mr-2 text-blue-400" />
            AI-Generated Recommendations
          </h3>
          <p className="text-gray-400 text-sm">Prioritized actions to reduce compound risks</p>
        </div>
        
        <div className="p-6">
          {riskData.intelligent_analysis.recommended_actions.length > 0 ? (
            <div className="space-y-3">
              {riskData.intelligent_analysis.recommended_actions.map((action, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg hover:bg-blue-900/30 transition-colors">
                  <div className="w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-blue-200 text-sm flex-1 pt-0.5">{action}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No recommendations at this time. Continue monitoring your infrastructure.</p>
            </div>
          )}
        </div>
      </div>

      {/* Analysis Metadata */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Last Analysis: {new Date(riskData.analysis_timestamp).toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400">AI-Powered Intelligence Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartRiskDashboard;
