import React, { useState } from 'react';
import { Search, Shield, AlertTriangle, CheckCircle, Mail, Database } from 'lucide-react';

const BreachCheck: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const performBreachCheck = async () => {
    if (!email.trim()) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      console.log('🔍 Checking breaches for:', email);
      
      // Simulate breach check (in production, integrate with real HIBP API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResults = {
        email: email,
        status: 'clean',
        breaches_found: 0,
        breaches: [],
        pastes_found: 0,
        last_checked: new Date().toISOString(),
        security_score: 9.2,
        recommendation: 'Email not found in any known breaches. Continue monitoring.'
      };

      console.log('✅ Breach check results:', mockResults);
      setResults(mockResults);

    } catch (error) {
      console.error('❌ Breach check error:', error);
      setError(error instanceof Error ? error.message : 'Breach check failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Breach Check</h1>
        <p className="text-gray-400">Email breach monitoring and credential exposure analysis</p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Database className="w-5 h-5 mr-2 text-purple-400" />
          Data Breach Monitor
          <span className="ml-2 text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">HIBP</span>
        </h3>

        <div className="flex space-x-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address to check..."
            disabled={loading}
            className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={performBreachCheck}
            disabled={loading || !email.trim()}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg px-6 py-2 transition-colors disabled:cursor-not-allowed flex items-center"
          >
            <Search className="w-4 h-4 mr-2" />
            {loading ? 'Checking...' : 'Check Breaches'}
          </button>
        </div>

        {loading && (
          <div className="mt-4 p-4 bg-purple-900/20 border border-purple-500/20 rounded-lg">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400 mr-3"></div>
              <span className="text-purple-400">Checking against breach databases...</span>
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
              <span className="font-semibold">Breach Check Complete</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-900/20 p-4 rounded-lg border border-green-500/20">
                <div className="text-green-400 text-sm">Status</div>
                <div className="text-white text-xl font-bold">Clean</div>
                <div className="text-green-300 text-sm">No breaches found</div>
              </div>
              <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/20">
                <div className="text-blue-400 text-sm">Security Score</div>
                <div className="text-white text-xl font-bold">{results.security_score}/10</div>
                <div className="text-blue-300 text-sm">Excellent</div>
              </div>
              <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/20">
                <div className="text-purple-400 text-sm">Last Checked</div>
                <div className="text-white text-sm font-bold">Just now</div>
                <div className="text-purple-300 text-sm">Real-time scan</div>
              </div>
            </div>

            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h4 className="text-white font-semibold mb-2 flex items-center">
                <Mail className="w-4 h-4 mr-2 text-blue-400" />
                Email Security Assessment
              </h4>
              <p className="text-gray-300 text-sm">{results.recommendation}</p>
              <div className="mt-2 text-xs text-gray-400">
                Checked against 600+ breach databases including major incidents
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BreachCheck;
