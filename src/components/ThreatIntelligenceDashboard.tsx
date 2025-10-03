import React, { useState, useEffect } from 'react';
import { Shield, Activity, AlertCircle, Clock, Globe, Zap } from 'lucide-react';
import { threatIntelApi } from '../services/threatIntelApi';
import { useWebSocket } from '../hooks/useWebSocket';
import type { Threat, ThreatStatistics, WebSocketThreatMessage } from '../types/threatIntel';

const ThreatIntelligenceDashboard: React.FC = () => {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [statistics, setStatistics] = useState<ThreatStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  // WebSocket connection for live threats
  const { isConnected } = useWebSocket<WebSocketThreatMessage>({
    url: 'ws://localhost:8000/ws/threat-intel/live',
    onMessage: (message) => {
      console.log('📡 Threat Intel Message:', message);
      
      if (message.type === 'initial_threats' && message.threats) {
        setThreats(message.threats);
      } else if (message.type === 'new_threat' && message.threat) {
        setThreats(prev => [message.threat!, ...prev].slice(0, 20));
      } else if (message.type === 'statistics_update' && message.statistics) {
        setStatistics(message.statistics);
      }
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [threatsData, statsData] = await Promise.all([
          threatIntelApi.getActiveThreats(),
          threatIntelApi.getStatistics()
        ]);
        setThreats(threatsData);
        setStatistics(statsData);
      } catch (error) {
        console.error('Failed to fetch threat data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'HIGH': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'LOW': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      malware: '🦠',
      ddos: '💥',
      phishing: '🎣',
      ransomware: '🔒',
      apt: '🎯',
      brute_force: '🔨',
      sql_injection: '💉',
      xss: '⚠️',
      zero_day: '💣'
    };
    return icons[category] || '🛡️';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
          <div className="text-gray-400">Loading threat intelligence...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Real-Time Threat Intelligence</h1>
            <p className="text-gray-400 flex items-center">
              Live threat detection and monitoring
              {isConnected && <span className="ml-2 text-green-400">● LIVE</span>}
            </p>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-red-500/20 to-red-600/30 rounded-lg p-6 border border-red-500/40">
            <div className="flex items-center justify-between mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
              <span className="text-xs text-red-300 bg-red-500/30 px-2 py-1 rounded-full font-bold">
                TOTAL
              </span>
            </div>
            <p className="text-3xl font-bold text-white mb-2">{statistics.total_threats}</p>
            <p className="text-red-300 font-medium">Total Threats</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/30 rounded-lg p-6 border border-orange-500/40">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-orange-400" />
              <span className="text-xs text-orange-300 bg-orange-500/30 px-2 py-1 rounded-full font-bold">
                ACTIVE
              </span>
            </div>
            <p className="text-3xl font-bold text-white mb-2">{statistics.active_threats}</p>
            <p className="text-orange-300 font-medium">Active Threats</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-600/30 rounded-lg p-6 border border-green-500/40">
            <div className="flex items-center justify-between mb-4">
              <Shield className="w-8 h-8 text-green-400" />
              <span className="text-xs text-green-300 bg-green-500/30 px-2 py-1 rounded-full font-bold">
                BLOCKED
              </span>
            </div>
            <p className="text-3xl font-bold text-white mb-2">{statistics.blocked_threats}</p>
            <p className="text-green-300 font-medium">Threats Blocked</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/30 rounded-lg p-6 border border-blue-500/40">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-blue-400" />
              <span className="text-xs text-blue-300 bg-blue-500/30 px-2 py-1 rounded-full font-bold">
                SPEED
              </span>
            </div>
            <p className="text-3xl font-bold text-white mb-2">
              {statistics.avg_response_time_ms.toFixed(1)}ms
            </p>
            <p className="text-blue-300 font-medium">Avg Response</p>
          </div>
        </div>
      )}

      {/* Live Threat Feed */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-semibold text-white">Live Threat Feed</h2>
            {isConnected && <span className="text-xs text-green-400">● STREAMING</span>}
          </div>
          <span className="text-sm text-gray-400">{threats.length} threats</span>
        </div>

        <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
          {threats.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No active threats detected
            </div>
          ) : (
            threats.map((threat) => (
              <div
                key={threat.id}
                className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getCategoryIcon(threat.category)}</span>
                    <div>
                      <h3 className="text-white font-semibold">{threat.title}</h3>
                      <p className="text-sm text-gray-400">{threat.description}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full border ${getSeverityColor(threat.severity)}`}>
                    {threat.severity}
                  </span>
                </div>

                <div className="flex items-center space-x-4 text-xs text-gray-400 mt-3">
                  <div className="flex items-center space-x-1">
                    <Globe className="w-3 h-3" />
                    <span>{threat.source.country || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(threat.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Activity className="w-3 h-3" />
                    <span>{(threat.ai_confidence * 100).toFixed(1)}% confidence</span>
                  </div>
                  <div className={`px-2 py-1 rounded ${
                    threat.status === 'blocked' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {threat.status.toUpperCase()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ThreatIntelligenceDashboard;
