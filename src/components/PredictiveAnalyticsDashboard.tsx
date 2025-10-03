import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, Brain, Target, Lightbulb, BarChart3, Activity } from 'lucide-react';

interface Prediction {
  threat_type: string;
  probability: number;
  timeframe: string;
  severity: string;
  impact: string;
}

interface PredictiveMetrics {
  predictions_generated: number;
  accuracy_rate: number;
  threats_prevented: number;
  risk_score_trend: string;
  upcoming_predictions: Prediction[];
  recommendations: string[];
}

const PredictiveAnalyticsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<PredictiveMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated data - replace with actual API call
    const mockData: PredictiveMetrics = {
      predictions_generated: 847,
      accuracy_rate: 94.3,
      threats_prevented: 156,
      risk_score_trend: 'decreasing',
      upcoming_predictions: [
        { threat_type: 'DDoS Attack', probability: 78, timeframe: 'Next 24 hours', severity: 'HIGH', impact: 'Service Disruption' },
        { threat_type: 'Phishing Campaign', probability: 65, timeframe: 'Next 48 hours', severity: 'MEDIUM', impact: 'Credential Theft' },
        { threat_type: 'Ransomware', probability: 42, timeframe: 'Next 7 days', severity: 'CRITICAL', impact: 'Data Encryption' },
        { threat_type: 'Data Exfiltration', probability: 38, timeframe: 'Next 3 days', severity: 'HIGH', impact: 'Data Breach' },
        { threat_type: 'SQL Injection', probability: 25, timeframe: 'Next 5 days', severity: 'MEDIUM', impact: 'Database Compromise' }
      ],
      recommendations: [
        'Increase DDoS protection capacity by 30% for next 48 hours',
        'Deploy additional email filtering rules to counter predicted phishing campaign',
        'Update backup systems and test ransomware recovery procedures',
        'Enable enhanced data loss prevention (DLP) monitoring',
        'Patch identified SQL injection vulnerabilities in web applications'
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
      </div>
    );
  }

  if (!metrics) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'HIGH': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'LOW': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Predictive Analytics Dashboard</h1>
            <p className="text-gray-400">AI-powered threat forecasting & risk prediction</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/30 rounded-lg p-6 border border-green-500/40">
          <div className="flex items-center justify-between mb-4">
            <Brain className="w-8 h-8 text-green-400" />
            <span className="text-xs text-green-300 bg-green-500/30 px-2 py-1 rounded-full font-bold">
              PREDICTIONS
            </span>
          </div>
          <p className="text-3xl font-bold text-white mb-2">{metrics.predictions_generated}</p>
          <p className="text-green-300 font-medium">Total Predictions</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/30 rounded-lg p-6 border border-blue-500/40">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-blue-400" />
            <span className="text-xs text-blue-300 bg-blue-500/30 px-2 py-1 rounded-full font-bold">
              ACCURACY
            </span>
          </div>
          <p className="text-3xl font-bold text-white mb-2">{metrics.accuracy_rate}%</p>
          <p className="text-blue-300 font-medium">Prediction Accuracy</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/30 rounded-lg p-6 border border-purple-500/40">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="w-8 h-8 text-purple-400" />
            <span className="text-xs text-purple-300 bg-purple-500/30 px-2 py-1 rounded-full font-bold">
              PREVENTED
            </span>
          </div>
          <p className="text-3xl font-bold text-white mb-2">{metrics.threats_prevented}</p>
          <p className="text-purple-300 font-medium">Threats Prevented</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/30 rounded-lg p-6 border border-orange-500/40">
          <div className="flex items-center justify-between mb-4">
            <Activity className="w-8 h-8 text-orange-400" />
            <span className="text-xs text-orange-300 bg-orange-500/30 px-2 py-1 rounded-full font-bold">
              TREND
            </span>
          </div>
          <p className="text-3xl font-bold text-white mb-2">
            {metrics.risk_score_trend === 'decreasing' ? '📉' : '📈'}
          </p>
          <p className="text-orange-300 font-medium capitalize">{metrics.risk_score_trend}</p>
        </div>
      </div>

      {/* Upcoming Threat Predictions */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-green-400" />
          🔮 Upcoming Threat Predictions
        </h3>
        <div className="space-y-4">
          {metrics.upcoming_predictions.map((prediction, idx) => (
            <div key={idx} className="bg-gray-700/50 rounded-lg p-5 border border-gray-600 hover:border-gray-500 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-white font-semibold text-lg">{prediction.threat_type}</h4>
                    <span className={`text-xs px-2 py-1 rounded border ${getSeverityColor(prediction.severity)}`}>
                      {prediction.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">⏰ {prediction.timeframe}</p>
                  <p className="text-sm text-gray-300">💥 Impact: {prediction.impact}</p>
                </div>
                
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-400">{prediction.probability}%</div>
                  <div className="text-xs text-gray-400 mt-1">Probability</div>
                </div>
              </div>

              {/* Probability Bar */}
              <div className="mt-3">
                <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      prediction.probability > 70 ? 'bg-red-500' : 
                      prediction.probability > 50 ? 'bg-orange-500' : 
                      prediction.probability > 30 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${prediction.probability}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
          💡 AI-Powered Recommendations
        </h3>
        <div className="space-y-3">
          {metrics.recommendations.map((recommendation, idx) => (
            <div key={idx} className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-lg p-4 hover:border-blue-500/40 transition-all">
              <div className="flex items-start space-x-3">
                <span className="text-blue-400 font-bold text-lg">{idx + 1}.</span>
                <p className="text-gray-300 flex-1">{recommendation}</p>
                <span className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full whitespace-nowrap">
                  Priority {idx + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Forecast Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-purple-400" />
            Risk Score Forecast
          </h3>
          <div className="space-y-3">
            {['Today', 'Tomorrow', 'Next 3 Days', 'Next Week', 'Next Month'].map((period, idx) => {
              const riskScores = [75, 68, 62, 55, 48];
              const score = riskScores[idx];
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">{period}</span>
                    <span className={`font-bold ${
                      score > 70 ? 'text-red-400' : 
                      score > 60 ? 'text-orange-400' : 
                      score > 50 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {score}/100
                    </span>
                  </div>
                  <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        score > 70 ? 'bg-gradient-to-r from-red-500 to-red-600' : 
                        score > 60 ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 
                        score > 50 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 
                        'bg-gradient-to-r from-green-500 to-green-600'
                      }`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-green-400" />
            Prediction Performance
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-900/20 border border-green-500/20 rounded">
              <span className="text-gray-300">Successful Predictions</span>
              <span className="text-green-400 font-bold">{metrics.accuracy_rate}%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-900/20 border border-blue-500/20 rounded">
              <span className="text-gray-300">Total Forecasts</span>
              <span className="text-blue-400 font-bold">{metrics.predictions_generated}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-900/20 border border-purple-500/20 rounded">
              <span className="text-gray-300">Threats Prevented</span>
              <span className="text-purple-400 font-bold">{metrics.threats_prevented}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-orange-900/20 border border-orange-500/20 rounded">
              <span className="text-gray-300">Risk Trend</span>
              <span className="text-orange-400 font-bold capitalize">
                {metrics.risk_score_trend === 'decreasing' ? '✅ Improving' : '⚠️ Increasing'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictiveAnalyticsDashboard;
