import React, { useState, useEffect } from 'react';
import { Brain, Zap, TrendingUp, Shield, Clock } from 'lucide-react';
import { analyticsApi } from '../services/analyticsApi';
import { useWebSocket } from '../hooks/useWebSocket';
import type { AIPerformanceMetrics } from '../types/analytics';

const AIPerformanceAnalytics: React.FC = () => {
  const [metrics, setMetrics] = useState<AIPerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  // DEBUG: Component loaded
  console.log('🎯 AIPerformanceAnalytics component loaded!');

  // Real-time WebSocket data
  const { data: liveMetrics, isConnected } = useWebSocket<AIPerformanceMetrics>({
    url: 'ws://localhost:8000/ws/analytics/ai/metrics',
    onMessage: (data) => {
      console.log('📊 WebSocket data received:', data);
      setMetrics(data);
    }
  });

  useEffect(() => {
    console.log('🔄 Fetching AI performance metrics from API...');
    (async () => {
      try {
        const data = await analyticsApi.getAIPerformance();
        console.log('✅ API data received:', data);
        setMetrics(data);
      } catch (error) {
        console.error('❌ Failed to fetch AI performance:', error);
      }
      setLoading(false);
    })();
  }, []);

  // DEBUG: Connection status
  console.log('🌐 WebSocket connected:', isConnected);
  console.log('📊 Current metrics:', metrics);

  if (loading) {
    console.log('⏳ Loading state...');
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-400">Loading AI performance metrics...</div>
      </div>
    );
  }

  if (!metrics) {
    console.log('⚠️ No metrics available');
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-red-400">No metrics available</div>
      </div>
    );
  }

  console.log('✅ Rendering AI Performance dashboard');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">AI Performance Analytics</h1>
          <p className="text-gray-400">
            Real-time autonomous AI metrics
            {isConnected && <span className="ml-2 text-green-400">● LIVE</span>}
          </p>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Accuracy Card */}
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/30 rounded-lg p-6 border border-green-500/40">
          <div className="flex items-center justify-between mb-4">
            <Shield className="w-8 h-8 text-green-400" />
            <span className="text-xs text-green-300 bg-green-500/30 px-2 py-1 rounded-full font-bold">ACCURACY</span>
          </div>
          <p className="text-3xl font-bold text-white mb-2">
            {(metrics.model_accuracy > 1 ? metrics.model_accuracy : metrics.model_accuracy * 100).toFixed(1)}%
          </p>

          <p className="text-green-300 font-medium">Detection Accuracy</p>
        </div>

        {/* Speed Card */}
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/30 rounded-lg p-6 border border-blue-500/40">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-blue-400" />
            <span className="text-xs text-blue-300 bg-blue-500/30 px-2 py-1 rounded-full font-bold">SPEED</span>
          </div>
          <p className="text-3xl font-bold text-white mb-2">{metrics.avg_analysis_time_ms.toFixed(1)}ms</p>
          <p className="text-blue-300 font-medium">Avg Response Time</p>
        </div>

        {/* Analyses Card */}
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/30 rounded-lg p-6 border border-purple-500/40">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-purple-400" />
            <span className="text-xs text-purple-300 bg-purple-500/30 px-2 py-1 rounded-full font-bold">ANALYSES</span>
          </div>
          <p className="text-3xl font-bold text-white mb-2">{metrics.total_analyses.toLocaleString()}</p>
          <p className="text-purple-300 font-medium">Threats Analyzed</p>
        </div>

        {/* Uptime Card */}
        <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/30 rounded-lg p-6 border border-yellow-500/40">
          <div className="flex items-center justify-between mb-4">
            <Zap className="w-8 h-8 text-yellow-400" />
            <span className="text-xs text-yellow-300 bg-yellow-500/30 px-2 py-1 rounded-full font-bold">UPTIME</span>
          </div>
          <p className="text-3xl font-bold text-white mb-2">{metrics.uptime_percentage.toFixed(1)}%</p>
          <p className="text-yellow-300 font-medium">System Availability</p>
        </div>
      </div>

      {/* Additional Metrics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Detection Statistics */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Detection Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded">
              <span className="text-gray-300">Successful Detections</span>
              <span className="text-green-400 font-bold">{metrics.successful_detections}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded">
              <span className="text-gray-300">False Positives</span>
              <span className="text-yellow-400 font-bold">{metrics.false_positives}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded">
              <span className="text-gray-300">Autonomous Responses</span>
              <span className="text-purple-400 font-bold">{metrics.autonomous_responses}</span>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-900/20 border border-green-500/20 rounded">
              <span className="text-gray-300">Operational Status</span>
              <span className="text-green-400 font-bold">✅ OPERATIONAL</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-900/20 border border-blue-500/20 rounded">
              <span className="text-gray-300">Last Model Update</span>
              <span className="text-blue-400 font-bold">
                {new Date(metrics.last_model_update).toLocaleDateString()}
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
    </div>
  );
};

export default AIPerformanceAnalytics;
