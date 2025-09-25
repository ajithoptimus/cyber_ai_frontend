import React, { useState } from 'react';
import { Search, Shield, AlertTriangle, CheckCircle, Zap, Eye } from 'lucide-react';

interface ThreatResult {
  status: string;
  data: any;
  analysis_time: string;
}

const ThreatCheck: React.FC = () => {
  const [indicator, setIndicator] = useState('');
  const [indicatorType, setIndicatorType] = useState('ip');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ThreatResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const performThreatCheck = async () => {
    if (!indicator.trim()) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      console.log('🔍 Performing threat check for:', indicator);

      const response = await fetch('http://localhost:8000/api/v1/osint/threat-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          indicator: indicator.trim(), 
          indicator_type: indicatorType 
        }),
      });

      if (!response.ok) throw new Error(`Threat check failed: ${response.status}`);
      
      const data = await response.json();
      console.log('✅ Threat check results:', data);
      setResults(data);

    } catch (error) {
      console.error('❌ Threat check error:', error);
      setError(error instanceof Error ? error.message : 'Threat check failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Threat Intelligence Check</h1>
        <p className="text-gray-400">IOC analysis and threat reputation assessment</p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-red-400" />
          Threat Analysis Engine
          <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">LIVE</span>
        </h3>

        <div className="space-y-3">
          <div className="flex space-x-2">
            <select
              value={indicatorType}
              onChange={(e) => setIndicatorType(e.target.value)}
              disabled={loading}
              className="bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ip">IP Address</option>
              <option value="domain">Domain</option>
              <option value="hash">File Hash</option>
              <option value="url">URL</option>
            </select>
            <input
              type="text"
              value={indicator}
              onChange={(e) => setIndicator(e.target.value)}
              placeholder={`Enter ${indicatorType}...`}
              disabled={loading}
              className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={performThreatCheck}
              disabled={loading || !indicator.trim()}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg px-6 py-2 transition-colors disabled:cursor-not-allowed flex items-center"
            >
              <Search className="w-4 h-4 mr-2" />
              {loading ? 'Checking...' : 'Check Threats'}
            </button>
          </div>
        </div>

        {loading && (
          <div className="mt-4 p-4 bg-red-900/20 border border-red-500/20 rounded-lg">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400 mr-3"></div>
              <span className="text-red-400">Analyzing threat intelligence...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-900/20 border border-red-500/20 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="w-4 h-4 text-red-400 mr-2" />
              <span className="text-red-400">{error}</span>
            </div>
          </div>
        )}

        {results && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center text-green-400">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-semibold">Threat Analysis Complete</span>
            </div>

            <div className="bg-gray-700/50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-white font-semibold mb-2">Threat Status</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    results.data.threat_status === 'Clean'
                      ? 'bg-green-500/20 text-green-400'
                      : results.data.threat_status === 'Suspicious'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {results.data.threat_status}
                  </span>
                  <div className="mt-2 text-sm text-gray-300">
                    Risk Score: <span className="font-bold">{results.data.risk_score}/10</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Intelligence</h4>
                  <div className="text-sm text-gray-300 space-y-1">
                    <div>Confidence: {results.data.confidence}%</div>
                    <div>First Seen: {results.data.first_seen}</div>
                    <div>Last Seen: {results.data.last_seen}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h4 className="text-white font-semibold mb-2">Recommendation</h4>
              <p className="text-gray-300 text-sm">{results.data.recommendation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreatCheck;
