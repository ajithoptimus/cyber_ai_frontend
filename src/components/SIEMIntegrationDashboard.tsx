import React, { useState, useEffect } from 'react';
import { Link, CheckCircle, AlertCircle, Activity, Database, TrendingUp, Zap } from 'lucide-react';

interface SIEMPlatform {
  name: string;
  logo: string;
  status: 'connected' | 'disconnected' | 'error';
  events_forwarded: number;
  last_sync: string;
  health: number;
}

interface SIEMMetrics {
  total_platforms: number;
  connected_platforms: number;
  events_forwarded_today: number;
  avg_sync_time_ms: number;
  platforms: SIEMPlatform[];
}

const SIEMIntegrationDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<SIEMMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated data - replace with actual API call
    const mockData: SIEMMetrics = {
      total_platforms: 5,
      connected_platforms: 4,
      events_forwarded_today: 15847,
      avg_sync_time_ms: 125,
      platforms: [
        { name: 'Splunk', logo: '🔍', status: 'connected', events_forwarded: 5420, last_sync: '2 mins ago', health: 98 },
        { name: 'IBM QRadar', logo: '🔷', status: 'connected', events_forwarded: 4123, last_sync: '5 mins ago', health: 95 },
        { name: 'Microsoft Sentinel', logo: '🛡️', status: 'connected', events_forwarded: 3845, last_sync: '3 mins ago', health: 97 },
        { name: 'Elastic SIEM', logo: '📊', status: 'connected', events_forwarded: 2459, last_sync: '1 min ago', health: 99 },
        { name: 'LogRhythm', logo: '📈', status: 'disconnected', events_forwarded: 0, last_sync: 'Never', health: 0 }
      ]
    };
    
    setTimeout(() => {
      setMetrics(mockData);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <Link className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">SIEM Integration Dashboard</h1>
            <p className="text-gray-400">Multi-platform security information & event management</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/30 rounded-lg p-6 border border-blue-500/40">
          <div className="flex items-center justify-between mb-4">
            <Database className="w-8 h-8 text-blue-400" />
            <span className="text-xs text-blue-300 bg-blue-500/30 px-2 py-1 rounded-full font-bold">
              PLATFORMS
            </span>
          </div>
          <p className="text-3xl font-bold text-white mb-2">{metrics.total_platforms}</p>
          <p className="text-blue-300 font-medium">Total Integrations</p>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-green-600/30 rounded-lg p-6 border border-green-500/40">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
            <span className="text-xs text-green-300 bg-green-500/30 px-2 py-1 rounded-full font-bold">
              CONNECTED
            </span>
          </div>
          <p className="text-3xl font-bold text-white mb-2">{metrics.connected_platforms}</p>
          <p className="text-green-300 font-medium">Active Connections</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/30 rounded-lg p-6 border border-purple-500/40">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-purple-400" />
            <span className="text-xs text-purple-300 bg-purple-500/30 px-2 py-1 rounded-full font-bold">
              EVENTS
            </span>
          </div>
          <p className="text-3xl font-bold text-white mb-2">{metrics.events_forwarded_today.toLocaleString()}</p>
          <p className="text-purple-300 font-medium">Events Today</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/30 rounded-lg p-6 border border-orange-500/40">
          <div className="flex items-center justify-between mb-4">
            <Zap className="w-8 h-8 text-orange-400" />
            <span className="text-xs text-orange-300 bg-orange-500/30 px-2 py-1 rounded-full font-bold">
              SPEED
            </span>
          </div>
          <p className="text-3xl font-bold text-white mb-2">{metrics.avg_sync_time_ms}ms</p>
          <p className="text-orange-300 font-medium">Avg Sync Time</p>
        </div>
      </div>

      {/* SIEM Platforms */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Database className="w-5 h-5 mr-2 text-blue-400" />
          Connected SIEM Platforms
        </h3>
        <div className="space-y-4">
          {metrics.platforms.map((platform, idx) => (
            <div key={idx} className="bg-gray-700/50 rounded-lg p-5 border border-gray-600 hover:border-gray-500 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl">{platform.logo}</span>
                  <div>
                    <h4 className="text-white font-semibold text-lg">{platform.name}</h4>
                    <p className="text-sm text-gray-400">Last sync: {platform.last_sync}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-400">{platform.events_forwarded.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">Events Forwarded</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">{platform.health}%</p>
                    <p className="text-xs text-gray-400">Health</p>
                  </div>
                  
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                    platform.status === 'connected' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/50'
                  }`}>
                    {platform.status === 'connected' ? '✅ CONNECTED' : '❌ DISCONNECTED'}
                  </span>
                </div>
              </div>

              {/* Progress bar for health */}
              <div className="mt-4">
                <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      platform.health > 90 ? 'bg-green-500' : 
                      platform.health > 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${platform.health}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event Forwarding Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-green-400" />
            Event Distribution
          </h3>
          <div className="space-y-3">
            {metrics.platforms.filter(p => p.status === 'connected').map((platform, idx) => {
              const percentage = (platform.events_forwarded / metrics.events_forwarded_today * 100).toFixed(1);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">{platform.name}</span>
                    <span className="text-blue-400 font-bold">{percentage}%</span>
                  </div>
                  <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-purple-400" />
            Integration Health
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-900/20 border border-green-500/20 rounded">
              <span className="text-gray-300">Healthy Connections</span>
              <span className="text-green-400 font-bold">{metrics.connected_platforms}/{metrics.total_platforms}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-900/20 border border-blue-500/20 rounded">
              <span className="text-gray-300">Total Events Today</span>
              <span className="text-blue-400 font-bold">{metrics.events_forwarded_today.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-900/20 border border-purple-500/20 rounded">
              <span className="text-gray-300">Avg Sync Performance</span>
              <span className="text-purple-400 font-bold">{metrics.avg_sync_time_ms}ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SIEMIntegrationDashboard;
