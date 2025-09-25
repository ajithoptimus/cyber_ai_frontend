import React, { useState } from 'react';
import { Search, Globe, Calendar, Shield, AlertCircle, CheckCircle } from 'lucide-react';

interface WhoisResult {
  domain: string;
  status: string;
  data: any;
  analysis_time: string;
}

const WhoisLookup: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<WhoisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const performWhoisLookup = async () => {
    if (!domain.trim()) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      console.log('🌐 Performing WHOIS lookup for:', domain);

      const response = await fetch('http://localhost:8000/api/v1/osint/whois', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain: domain.trim() }),
      });

      if (!response.ok) {
        throw new Error(`WHOIS lookup failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ WHOIS results:', data);
      setResults(data);

    } catch (error) {
      console.error('❌ WHOIS lookup error:', error);
      setError(error instanceof Error ? error.message : 'WHOIS lookup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performWhoisLookup();
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">WHOIS Lookup</h1>
        <p className="text-gray-400">Domain registration and ownership information</p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Globe className="w-5 h-5 mr-2 text-blue-400" />
          Domain Analysis
          <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">LIVE</span>
        </h3>

        <div className="flex space-x-2">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter domain (e.g., example.com)"
            disabled={loading}
            className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={performWhoisLookup}
            disabled={loading || !domain.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg px-6 py-2 transition-colors disabled:cursor-not-allowed flex items-center"
          >
            <Search className="w-4 h-4 mr-2" />
            {loading ? 'Analyzing...' : 'Lookup'}
          </button>
        </div>

        {loading && (
          <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-3"></div>
              <span className="text-blue-400">Performing WHOIS lookup...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-900/20 border border-red-500/20 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
              <span className="text-red-400">{error}</span>
            </div>
          </div>
        )}

        {results && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center text-green-400">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-semibold">WHOIS Analysis Complete</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-2 flex items-center">
                  <Globe className="w-4 h-4 mr-2 text-blue-400" />
                  Registration Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-400">Domain:</span>
                    <span className="text-white ml-2 font-mono">{results.data.domain}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Registrar:</span>
                    <span className="text-white ml-2">{results.data.registrar}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Country:</span>
                    <span className="text-white ml-2">{results.data.country}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Organization:</span>
                    <span className="text-white ml-2">{results.data.org}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-green-400" />
                  Timeline
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-400">Created:</span>
                    <span className="text-white ml-2">{results.data.creation_date}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Updated:</span>
                    <span className="text-white ml-2">{results.data.last_updated}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Expires:</span>
                    <span className="text-white ml-2">{results.data.expiration_date}</span>
                  </div>
                </div>
              </div>
            </div>

            {results.data.security_analysis && (
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-2 flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-orange-400" />
                  Security Analysis
                </h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-400">Risk Level:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      results.data.security_analysis.risk_level === 'Low' 
                        ? 'bg-green-500/20 text-green-400'
                        : results.data.security_analysis.risk_level === 'Medium'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {results.data.security_analysis.risk_level}
                    </span>
                  </div>
                  {results.data.security_analysis.risk_factors.length > 0 && (
                    <div>
                      <span className="text-gray-400">Risk Factors:</span>
                      <ul className="ml-4 mt-1">
                        {results.data.security_analysis.risk_factors.map((factor: string, idx: number) => (
                          <li key={idx} className="text-orange-300 text-sm">• {factor}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {results.data.name_servers && results.data.name_servers.length > 0 && (
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-2">Name Servers</h4>
                <div className="space-y-1">
                  {results.data.name_servers.map((ns: string, idx: number) => (
                    <div key={idx} className="text-gray-300 text-sm font-mono">{ns}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WhoisLookup;
