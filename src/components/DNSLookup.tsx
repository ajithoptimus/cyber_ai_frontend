import React, { useState } from 'react';
import { Search, Radio, Shield, AlertCircle, CheckCircle, Globe } from 'lucide-react';

interface DNSResult {
  status: string;
  domain: string;
  data: any;
  analysis_time: string;
}

const DNSLookup: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DNSResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const performDNSLookup = async () => {
    if (!domain.trim()) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      console.log('📡 Performing DNS lookup for:', domain);

      const response = await fetch('http://localhost:8000/api/v1/osint/dns-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain: domain.trim() }),
      });

      if (!response.ok) {
        throw new Error(`DNS lookup failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ DNS results:', data);
      setResults(data);

    } catch (error) {
      console.error('❌ DNS lookup error:', error);
      setError(error instanceof Error ? error.message : 'DNS lookup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performDNSLookup();
    }
  };

  const getRecordColor = (recordType: string) => {
    const colors: Record<string, string> = {
      'A': 'bg-blue-500/20 text-blue-400',
      'AAAA': 'bg-purple-500/20 text-purple-400',
      'MX': 'bg-green-500/20 text-green-400',
      'NS': 'bg-orange-500/20 text-orange-400',
      'TXT': 'bg-pink-500/20 text-pink-400',
      'CNAME': 'bg-cyan-500/20 text-cyan-400',
      'SOA': 'bg-red-500/20 text-red-400'
    };
    return colors[recordType] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">DNS Records Analysis</h1>
        <p className="text-gray-400">Comprehensive DNS configuration analysis and security assessment</p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Radio className="w-5 h-5 mr-2 text-blue-400" />
          DNS Intelligence
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
            onClick={performDNSLookup}
            disabled={loading || !domain.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg px-6 py-2 transition-colors disabled:cursor-not-allowed flex items-center"
          >
            <Search className="w-4 h-4 mr-2" />
            {loading ? 'Analyzing...' : 'Analyze DNS'}
          </button>
        </div>

        {loading && (
          <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-3"></div>
              <span className="text-blue-400">Performing comprehensive DNS analysis...</span>
            </div>
            <div className="text-blue-300 text-sm mt-2 ml-7">
              <p>• Querying A, AAAA, MX, NS, TXT, CNAME, SOA records</p>
              <p>• Security configuration analysis</p>
              <p>• Email security assessment</p>
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
          <div className="mt-6 space-y-6">
            <div className="flex items-center text-green-400">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-semibold">DNS Analysis Complete</span>
              <span className="ml-4 text-gray-400 text-sm">
                {results.domain} • {Object.keys(results.data.records).length} record types
              </span>
            </div>

            {/* DNS Records Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {Object.entries(results.data.records).map(([recordType, records]) => (
                <div key={recordType} className="bg-gray-700/50 p-4 rounded-lg">
                  <h4 className="text-white font-semibold mb-3 flex items-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium mr-2 ${getRecordColor(recordType)}`}>
                      {recordType}
                    </span>
                    {recordType} Records
                    <span className="ml-2 text-gray-400 text-sm">({(records as string[]).length})</span>
                  </h4>
                  
                  {(records as string[]).length > 0 ? (
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {(records as string[]).map((record: string, idx: number) => (
                        <div key={idx} className="bg-gray-900/50 p-2 rounded text-sm">
                          <code className="text-gray-300 break-all">{record}</code>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm italic">No {recordType} records found</div>
                  )}
                </div>
              ))}
            </div>

            {/* Security Analysis */}
            {results.data.security_analysis && (
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-3 flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-orange-400" />
                  DNS Security Assessment
                  <span className="ml-2 text-orange-400 font-bold">
                    {results.data.security_analysis.security_score}/10
                  </span>
                </h4>
                
                {results.data.security_analysis.findings.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-red-400 font-medium mb-2">🔍 Security Findings:</h5>
                    <div className="space-y-1">
                      {results.data.security_analysis.findings.map((finding: string, idx: number) => (
                        <div key={idx} className="text-red-300 text-sm">• {finding}</div>
                      ))}
                    </div>
                  </div>
                )}

                {results.data.security_analysis.recommendations.length > 0 && (
                  <div>
                    <h5 className="text-blue-400 font-medium mb-2">💡 Recommendations:</h5>
                    <div className="space-y-1">
                      {results.data.security_analysis.recommendations.map((rec: string, idx: number) => (
                        <div key={idx} className="text-blue-300 text-sm">• {rec}</div>
                      ))}
                    </div>
                  </div>
                )}

                {results.data.security_analysis.findings.length === 0 && (
                  <div className="text-green-400 text-sm flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    No security issues detected in DNS configuration
                  </div>
                )}
              </div>
            )}

            {/* DNS Summary Stats */}
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h4 className="text-white font-semibold mb-3">DNS Overview</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-blue-400 font-bold text-lg">
                    {(results.data.records.A as string[])?.length || 0}
                  </div>
                  <div className="text-gray-400">IPv4 Addresses</div>
                </div>
                <div className="text-center">
                  <div className="text-purple-400 font-bold text-lg">
                    {(results.data.records.AAAA as string[])?.length || 0}
                  </div>
                  <div className="text-gray-400">IPv6 Addresses</div>
                </div>
                <div className="text-center">
                  <div className="text-green-400 font-bold text-lg">
                    {(results.data.records.MX as string[])?.length || 0}
                  </div>
                  <div className="text-gray-400">Mail Servers</div>
                </div>
                <div className="text-center">
                  <div className="text-orange-400 font-bold text-lg">
                    {(results.data.records.NS as string[])?.length || 0}
                  </div>
                  <div className="text-gray-400">Name Servers</div>
                </div>
              </div>
            </div>

            {/* External Tools */}
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h4 className="text-white font-semibold mb-2">External DNS Tools</h4>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => window.open(`https://dnsdumpster.com/?domain=${results.domain}`, '_blank')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  DNS Dumpster
                </button>
                <button 
                  onClick={() => window.open(`https://www.whatsmydns.net/#A/${results.domain}`, '_blank')}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Global DNS Check
                </button>
                <button 
                  onClick={() => window.open(`https://mxtoolbox.com/domain/${results.domain}/`, '_blank')}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  MX Toolbox
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DNSLookup;
