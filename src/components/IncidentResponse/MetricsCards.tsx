import React from 'react';
import { AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react';

interface Props {
  metrics: {
    total_incidents: number;
    response_metrics: {
      avg_mttd_minutes: number;
      avg_mttr_minutes: number;
      automation_rate: number;
    };
  };
}

const MetricsCards: React.FC<Props> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <AlertTriangle className="w-8 h-8 text-red-400 mb-2" />
        <p className="text-2xl font-bold text-white">{metrics.total_incidents}</p>
        <p className="text-sm text-gray-400">Total Incidents</p>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <Clock className="w-8 h-8 text-blue-400 mb-2" />
        <p className="text-2xl font-bold text-white">
          {metrics.response_metrics.avg_mttd_minutes.toFixed(1)}m
        </p>
        <p className="text-sm text-gray-400">Avg MTTD</p>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <CheckCircle className="w-8 h-8 text-green-400 mb-2" />
        <p className="text-2xl font-bold text-white">
          {metrics.response_metrics.avg_mttr_minutes.toFixed(1)}m
        </p>
        <p className="text-sm text-gray-400">Avg MTTR</p>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <Zap className="w-8 h-8 text-purple-400 mb-2" />
        <p className="text-2xl font-bold text-white">
          {metrics.response_metrics.automation_rate.toFixed(0)}%
        </p>
        <p className="text-sm text-gray-400">Automation</p>
      </div>
    </div>
  );
};

export default MetricsCards;
