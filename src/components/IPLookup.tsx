import React, { useState } from 'react';
import { Search, Wifi, MapPin, Shield, AlertTriangle, CheckCircle, Globe } from 'lucide-react';

interface IPResult {
  status: string;
  ip_address: string;
  data: any;
  analysis_time: string;
}

const IPLookup: React.FC = () => {
  const [ipAddress, setIpAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<IPResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const performIPLookup = async () => {
    if (!ipAddress.trim()) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      console.log('🔍 Performing IP lookup for:', ipAddress);

      const response = await fetch('http://localhost:8000/api/v1/osint/ip-lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ip_address: ipAddress.trim() }),
      });

      if (!response.ok) {
        throw new Error(`IP lookup failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ IP lookup results:', data);
      setResults(data);

    } catch (error) {
      console.error('❌ IP lookup error:', error);
      setError(error instanceof Error ? error.message : 'IP lookup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performIPLookup();
    }
  };

  const validateIP = (ip: string) => {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    return ipv4Regex.test(ip);
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">IP Address Lookup</h1>
        <p className="text-gray-400">Geolocation, network analysis, and security assessment</p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Wifi className="w-5 h-5 mr-2 text-blue-400" />
          IP Intelligence Analysis
          <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">LIVE</span>
        </h3>

        <div className="flex space-x-2">
          <input
            type="text"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter IP address (e.g., 8.8.8.8)"
            disabled={loading}
            className={`flex-1 bg-gray-900 border rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 ${
              ipAddress && !validateIP(ipAddress) ? 'border-red-500' : 'border-gray-600'
            }`}
          />
          <button
            onClick={performIPLookup}
            disabled={loading || !ipAddress.trim() || !validateIP(ipAddress)}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg px-6 py-2 transition-colors disabled:cursor-not-allowed flex items-center"
          >
            <Search className="w-4 h-4 mr-2" />
            {loading ? 'Analyzing...' : 'Lookup'}
          </button>
        </div>

        {ipAddress && !validateIP(ipAddress) && (
          <div className="mt-2 text-red-400 text-sm">
            Please enter a valid IPv4 address
          </div>
        )}

        {loading && (
          <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-3"></div>
              <span className="text-blue-400">Performing IP intelligence analysis...</span>
            </div>
            <div className="text-blue-300 text-sm mt-2 ml-7">
              <p>• Geolocation lookup</p>
              <p>• Network reputation check</p>
              <p>• Security assessment</p>
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
          <div className="mt-6 space-y-6">
            <div className="flex items-center text-green-400">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-semibold">IP Analysis Complete</span>
              <span className="ml-4 text-gray-400 text-sm">
                {results.ip_address} • {results.data.network_info?.ip_type}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Geolocation Card */}
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-3 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-green-400" />
                  Geographic Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Country:</span>
                    <span className="text-white">{results.data.geolocation?.country || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Region:</span>
                    <span className="text-white">{results.data.geolocation?.region || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">City:</span>
                    <span className="text-white">{results.data.geolocation?.city || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Timezone:</span>
                    <span className="text-white">{results.data.geolocation?.timezone || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Coordinates:</span>
                    <span className="text-white font-mono">
                      {results.data.geolocation?.latitude}, {results.data.geolocation?.longitude}
                    </span>
                  </div>
                </div>
              </div>

              {/* Network Information Card */}
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-3 flex items-center">
                  <Globe className="w-4 h-4 mr-2 text-blue-400" />
                  Network Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Hostname:</span>
                    <span className="text-white font-mono text-xs">{results.data.hostname}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">ISP:</span>
                    <span className="text-white">{results.data.geolocation?.isp || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">ASN:</span>
                    <span className="text-white">{results.data.geolocation?.asn || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">IP Type:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      results.data.network_info?.is_private 
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                      {results.data.network_info?.ip_type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Scan Risk:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      results.data.network_info?.port_scan_risk === 'High'
                        ? 'bg-red-500/20 text-red-400'
                        : results.data.network_info?.port_scan_risk === 'Medium'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                      {results.data.network_info?.port_scan_risk}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Assessment Card */}
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h4 className="text-white font-semibold mb-3 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-orange-400" />
                Security Assessment
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Reputation:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      results.data.security_assessment?.reputation_status === 'Clean'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {results.data.security_assessment?.reputation_status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Confidence:</span>
                    <span className="text-white">{results.data.security_assessment?.confidence_score}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Malicious:</span>
                    <span className="text-green-400">{results.data.security_assessment?.last_seen_malicious}</span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Recommendation:</span>
                  <p className="text-white text-sm mt-1">
                    {results.data.security_assessment?.recommendation}
                  </p>
                </div>
              </div>

              {results.data.security_assessment?.threat_categories?.length > 0 && (
                <div className="mt-3">
                  <span className="text-gray-400 text-sm">Threat Categories:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {results.data.security_assessment.threat_categories.map((category: string, idx: number) => (
                      <span key={idx} className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h4 className="text-white font-semibold mb-2">Quick Actions</h4>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => window.open(`https://www.shodan.io/host/${results.ip_address}`, '_blank')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  View in Shodan
                </button>
                <button 
                  onClick={() => window.open(`https://www.virustotal.com/gui/ip-address/${results.ip_address}`, '_blank')}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Check VirusTotal
                </button>
                <button 
                  onClick={() => window.open(`https://www.abuseipdb.com/check/${results.ip_address}`, '_blank')}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  AbuseIPDB
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IPLookup;
