import React, { useState, useEffect } from 'react';
import { Brain, Zap, TrendingUp, Shield, Clock, AlertCircle, CheckCircle, Activity } from 'lucide-react';

import { analyticsApi } from '../services/analyticsApi';
import { useWebSocket } from '../hooks/useWebSocket';
import type { AIPerformanceMetrics } from '../types/analytics';

const AIPerformanceAnalytics: React.FC = () => {
  const [metrics, setMetrics] = useState<AIPerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time WebSocket data
  const { data: liveMetrics, isConnected, error: wsError } = useWebSocket<AIPerformanceMetrics>({
    url: 'ws://localhost:8000/ws/analytics/ai/metrics',
    onMessage: (data) => {
      console.log('📊 WebSocket data received:', data);
      setMetrics(data);
    }
  });

  useEffect(() => {
    console.log('🔄 Fetching AI performance metrics from API...');
    
    const fetchMetrics = async () => {
      try {
        const data = await analyticsApi.getAIPerformance();
        console.log('✅ API data received:', data);
        setMetrics(data);
        setError(null);
      } catch (err) {
        console.error('❌ Failed to fetch AI performance:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    
    // Refresh data every 30 seconds as backup to WebSocket
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Recently Updated';
      }
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Recently Updated';
    }
  };

  // Format accuracy percentage
  const formatAccuracy = (accuracy: number): string => {
    // If already in percentage form (> 1), use as is
    // If decimal (0-1), multiply by 100
    const percentValue = accuracy > 1 ? accuracy : accuracy * 100;
    return percentValue.toFixed(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
          <div className="text-gray-400">Loading AI performance metrics...</div>
        </div>
      </div>
    );
  }

  if (error && !metrics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6 max-w-md">
          <div className="flex items-center space-x-3 mb-3">
            <AlertCircle className="w-6 h-6 text-red-400" />
            <h3 className="text-lg font-semibold text-red-400">Failed to Load Metrics</h3>
          </div>
          <p className="text-gray-300">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-400">No metrics available</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI Performance Analytics</h1>
            <p className="text-gray-400 flex items-center">
              Real-time autonomous AI metrics
              {isConnected && <span className="ml-2 text-green-400 flex items-center">● LIVE</span>}
              {wsError && <span className="ml-2 text-yellow-400 flex items-center">⚠ Reconnecting...</span>}
            </p>
          </div>
        </div>
        
        {/* Refresh Indicator */}
        <div className="text-xs text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
      
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Accuracy Card */}
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/30 rounded-lg p-6 border border-green-500/40 hover:border-green-500/60 transition-all">
          <div className="flex items-center justify-between mb-4">
            <Shield className="w-8 h-8 text-green-400" />
            <span className="text-xs text-green-300 bg-green-500/30 px-2 py-1 rounded-full font-bold">
              ACCURACY
            </span>
          </div>
          <p className="text-3xl font-bold text-white mb-2">
            {formatAccuracy(metrics.model_accuracy)}%
          </p>
          <p className="text-green-300 font-medium">Detection Accuracy</p>
          <p className="text-xs text-green-200 mt-2 opacity-75">Industry-leading precision</p>
        </div>

        {/* Speed Card */}
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/30 rounded-lg p-6 border border-blue-500/40 hover:border-blue-500/60 transition-all">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-blue-400" />
            <span className="text-xs text-blue-300 bg-blue-500/30 px-2 py-1 rounded-full font-bold">
              SPEED
            </span>
          </div>
          <p className="text-3xl font-bold text-white mb-2">
            {metrics.avg_analysis_time_ms.toFixed(1)}ms
          </p>
          <p className="text-blue-300 font-medium">Avg Response Time</p>
          <p className="text-xs text-blue-200 mt-2 opacity-75">Lightning-fast analysis</p>
        </div>

        {/* Analyses Card */}
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/30 rounded-lg p-6 border border-purple-500/40 hover:border-purple-500/60 transition-all">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-purple-400" />
            <span className="text-xs text-purple-300 bg-purple-500/30 px-2 py-1 rounded-full font-bold">
              ANALYSES
            </span>
          </div>
          <p className="text-3xl font-bold text-white mb-2">
            {metrics.total_analyses.toLocaleString()}
          </p>
          <p className="text-purple-300 font-medium">Threats Analyzed</p>
          <p className="text-xs text-purple-200 mt-2 opacity-75">Comprehensive coverage</p>
        </div>

        {/* Uptime Card */}
        <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/30 rounded-lg p-6 border border-yellow-500/40 hover:border-yellow-500/60 transition-all">
          <div className="flex items-center justify-between mb-4">
            <Zap className="w-8 h-8 text-yellow-400" />
            <span className="text-xs text-yellow-300 bg-yellow-500/30 px-2 py-1 rounded-full font-bold">
              UPTIME
            </span>
          </div>
          <p className="text-3xl font-bold text-white mb-2">
            {metrics.uptime_percentage.toFixed(1)}%
          </p>
          <p className="text-yellow-300 font-medium">System Availability</p>
          <p className="text-xs text-yellow-200 mt-2 opacity-75">Always monitoring</p>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Detection Statistics */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Detection Statistics</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded hover:bg-gray-700/70 transition-colors">
              <span className="text-gray-300">Successful Detections</span>
              <span className="text-green-400 font-bold text-lg">
                {metrics.successful_detections.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded hover:bg-gray-700/70 transition-colors">
              <span className="text-gray-300">False Positives</span>
              <span className="text-yellow-400 font-bold text-lg">
                {metrics.false_positives.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded hover:bg-gray-700/70 transition-colors">
              <span className="text-gray-300">Autonomous Responses</span>
              <span className="text-purple-400 font-bold text-lg">
                {metrics.autonomous_responses.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center space-x-2 mb-4">
            <Activity className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">System Status</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-900/20 border border-green-500/20 rounded">
              <span className="text-gray-300">Operational Status</span>
              <span className="text-green-400 font-bold flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                OPERATIONAL
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-900/20 border border-blue-500/20 rounded">
              <span className="text-gray-300">Last Model Update</span>
              <span className="text-blue-400 font-bold text-sm">
                {formatDate(metrics.last_model_update)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-900/20 border border-purple-500/20 rounded">
              <span className="text-gray-300">WebSocket Connection</span>
              <span className={`font-bold ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                {isConnected ? '● CONNECTED' : '○ DISCONNECTED'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Comparison */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-orange-400" />
          🏆 Industry Comparison
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Metric</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Your AI</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Darktrace</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">CrowdStrike</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">SentinelOne</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-700/50">
                <td className="py-3 px-4 text-white font-medium">Response Time</td>
                <td className="py-3 px-4 text-green-400 font-bold">
                  {metrics.avg_analysis_time_ms.toFixed(1)}ms ✨
                </td>
                <td className="py-3 px-4 text-gray-400">~500ms</td>
                <td className="py-3 px-4 text-gray-400">~300ms</td>
                <td className="py-3 px-4 text-gray-400">~400ms</td>
              </tr>
              <tr className="border-b border-gray-700/50">
                <td className="py-3 px-4 text-white font-medium">Accuracy</td>
                <td className="py-3 px-4 text-green-400 font-bold">
                  {formatAccuracy(metrics.model_accuracy)}% ✨
                </td>
                <td className="py-3 px-4 text-gray-400">~95%</td>
                <td className="py-3 px-4 text-gray-400">~96%</td>
                <td className="py-3 px-4 text-gray-400">~94%</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-white font-medium">Uptime</td>
                <td className="py-3 px-4 text-green-400 font-bold">
                  {metrics.uptime_percentage.toFixed(1)}% ✨
                </td>
                <td className="py-3 px-4 text-gray-400">99.9%</td>
                <td className="py-3 px-4 text-gray-400">99.5%</td>
                <td className="py-3 px-4 text-gray-400">99.7%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          ✨ = Industry-leading performance • Data updated in real-time
        </p>
      </div>
    </div>
  );
};

export default AIPerformanceAnalytics;
