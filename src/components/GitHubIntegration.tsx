import React, { useState, useEffect } from 'react';
import { GitBranch, Shield, AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react';

interface GitHubAnalysis {
  id: number;
  repository: string;
  ref_sha: string;
  event_type: string;
  total_findings: number;
  critical_issues: number;
  unified_risk_score: number;
  timestamp: string;
  status: string;
  top_risks: any[];
  severity_distribution: any;
}

const GitHubIntegration: React.FC = () => {
  const [analyses, setAnalyses] = useState<GitHubAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGitHubAnalyses();
    // Refresh every 10 seconds for real-time updates
    const interval = setInterval(fetchGitHubAnalyses, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchGitHubAnalyses = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/dashboard/github/analyses/recent');
      if (response.ok) {
        const data = await response.json();
        setAnalyses(data.analyses || []);
        setError(null);
      } else {
        throw new Error('Failed to fetch analyses');
      }
    } catch (error) {
      console.error('Failed to fetch GitHub analyses:', error);
      setError('Unable to load GitHub analyses');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 8) return 'text-red-400 bg-red-900/20 border-red-500/20';
    if (score >= 6) return 'text-orange-400 bg-orange-900/20 border-orange-500/20';
    if (score >= 3) return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/20';
    return 'text-green-400 bg-green-900/20 border-green-500/20';
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">GitHub Security Integration</h1>
        <p className="text-gray-400">Real-time code analysis with ML-powered threat detection</p>
      </div>

      {/* Real-time Status */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-blue-400" />
          Live Security Pipeline
          <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">ACTIVE</span>
        </h3>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading recent analyses...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-4">
            {analyses.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <GitBranch className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No recent GitHub analyses found</p>
                <p className="text-sm mt-2">Push code to trigger security analysis</p>
              </div>
            ) : (
              <div className="space-y-4">
                {analyses.map((analysis) => (
                  <div key={analysis.id} className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <GitBranch className="w-4 h-4 text-blue-400 mr-2" />
                        <span className="text-white font-medium">{analysis.repository}</span>
                        <span className="text-gray-400 text-sm ml-2">#{analysis.id}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(analysis.unified_risk_score)}`}>
                          Risk: {analysis.unified_risk_score}/10
                        </span>
                        <span className="text-gray-400 text-xs">
                          {new Date(analysis.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="text-center">
                        <div className="text-blue-400 font-bold text-lg">{analysis.total_findings}</div>
                        <div className="text-gray-400 text-xs">Total Findings</div>
                      </div>
                      <div className="text-center">
                        <div className="text-red-400 font-bold text-lg">{analysis.critical_issues}</div>
                        <div className="text-gray-400 text-xs">Critical Issues</div>
                      </div>
                      <div className="text-center">
                        <div className="text-green-400 font-bold text-lg">
                          {analysis.severity_distribution?.high || 0}
                        </div>
                        <div className="text-gray-400 text-xs">High Severity</div>
                      </div>
                    </div>

                    {analysis.top_risks && analysis.top_risks.length > 0 && (
                      <div className="border-t border-gray-600 pt-3">
                        <h4 className="text-white text-sm font-medium mb-2">Top Security Risks:</h4>
                        <div className="space-y-1">
                          {analysis.top_risks.slice(0, 3).map((risk, idx) => (
                            <div key={idx} className="flex items-center text-sm">
                              <AlertTriangle className="w-3 h-3 text-orange-400 mr-2" />
                              <span className="text-gray-300">{risk.rule_id}:</span>
                              <span className="text-gray-400 ml-1 truncate">{risk.message}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                      <span>SHA: {analysis.ref_sha?.substring(0, 8)}</span>
                      <span>ML Confidence: 85%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHubIntegration;
