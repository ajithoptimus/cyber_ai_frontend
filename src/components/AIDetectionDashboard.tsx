import React, { useState, useEffect } from 'react';
import { Brain, Target, TrendingUp, Zap, CheckCircle, AlertTriangle, Activity } from 'lucide-react';

interface DetectionMetrics {
  total_detections: number;
  successful_detections: number;
  false_positives: number;
  detection_rate: number;
  avg_detection_time_ms: number;
  model_accuracy: number;
  models_deployed: number;
  active_learning: boolean;
}

const AIDetectionDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DetectionMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated data - replace with actual API call
    const mockData: DetectionMetrics = {
      total_detections: 1247,
      successful_detections: 1189,
      false_positives: 12,
      detection_rate: 95.3,
      avg_detection_time_ms: 0.42,
      model_accuracy: 98.5,
      models_deployed: 7,
      active_learning: true
    };
    
    setTimeout(() => {
      setMetrics(mockData);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI Detection Dashboard</h1>
            <p className="text-gray-400">Machine learning model performance & detection metrics</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/30 rounded-lg p-6 border border-purple-500/40">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-purple-400" />
            <span className="text-xs text-purple-300 bg-purple-500/30 px-2 py-1 rounded-full font-bold">
              DETECTIONS
            </span>
          </div>
          <p className="text-3xl font-bold text-white mb-2">{metrics.total_detections.toLocaleString()}</p>
          <p className="text-purple-300 font-medium">Total Detections</p>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-green-600/30 rounded-lg p-6 border border-green-500/40">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
            <span className="text-xs text-green-300 bg-green-500/30 px-2 py-1 rounded-full font-bold">
              ACCURACY
            </span>
          </div>
          <p className="text-3xl font-bold text-white mb-2">{metrics.model_accuracy}%</p>
          <p className="text-green-300 font-medium">Model Accuracy</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/30 rounded-lg p-6 border border-blue-500/40">
          <div className="flex items-center justify-between mb-4">
            <Zap className="w-8 h-8 text-blue-400" />
            <span className="text-xs text-blue-300 bg-blue-500/30 px-2 py-1 rounded-full font-bold">
              SPEED
            </span>
          </div>
          <p className="text-3xl font-bold text-white mb-2">{metrics.avg_detection_time_ms}ms</p>
          <p className="text-blue-300 font-medium">Detection Time</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/30 rounded-lg p-6 border border-orange-500/40">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-orange-400" />
            <span className="text-xs text-orange-300 bg-orange-500/30 px-2 py-1 rounded-full font-bold">
              RATE
            </span>
          </div>
          <p className="text-3xl font-bold text-white mb-2">{metrics.detection_rate}%</p>
          <p className="text-orange-300 font-medium">Detection Rate</p>
        </div>
      </div>

      {/* Detection Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-purple-400" />
            Detection Performance
          </h3>
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
              <span className="text-gray-300">Detection Rate</span>
              <span className="text-blue-400 font-bold">{metrics.detection_rate}%</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-blue-400" />
            ML Models Status
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-900/20 border border-green-500/20 rounded">
              <span className="text-gray-300">Models Deployed</span>
              <span className="text-green-400 font-bold">{metrics.models_deployed} Active</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-900/20 border border-purple-500/20 rounded">
              <span className="text-gray-300">Active Learning</span>
              <span className="text-purple-400 font-bold">
                {metrics.active_learning ? '✅ ENABLED' : '⏸️ DISABLED'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-900/20 border border-blue-500/20 rounded">
              <span className="text-gray-300">Model Accuracy</span>
              <span className="text-blue-400 font-bold">{metrics.model_accuracy}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detection Models */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">🤖 Deployed Detection Models</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Malware Classifier', accuracy: 99.1, status: 'active' },
            { name: 'Anomaly Detector', accuracy: 97.8, status: 'active' },
            { name: 'Phishing Detector', accuracy: 98.2, status: 'active' },
            { name: 'DDoS Identifier', accuracy: 96.5, status: 'active' },
            { name: 'Ransomware Scanner', accuracy: 99.3, status: 'active' },
            { name: 'Zero-Day Hunter', accuracy: 94.7, status: 'training' },
            { name: 'APT Detector', accuracy: 95.8, status: 'active' }
          ].map((model, idx) => (
            <div key={idx} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-semibold text-sm">{model.name}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  model.status === 'active' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {model.status.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Accuracy</span>
                <span className="text-sm text-blue-400 font-bold">{model.accuracy}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIDetectionDashboard;
