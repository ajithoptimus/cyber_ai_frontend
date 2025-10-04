import React from 'react';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface Framework {
  id: number;
  name: string;
  version: string;
  compliance_score: number;
  implemented_controls: number;
  total_controls: number;
  status: string;
}

interface Props {
  framework: Framework;
}

const ComplianceScoreGauge: React.FC<Props> = ({ framework }) => {
  const { name, compliance_score, implemented_controls, total_controls, status } = framework;
  
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progress = (compliance_score / 100) * circumference;

  const getColor = () => {
    if (compliance_score >= 90) return '#10b981';
    if (compliance_score >= 70) return '#f59e0b';
    return '#ef4444';
  };

  const getStatusIcon = () => {
    if (status === 'compliant') return <CheckCircle className="w-5 h-5 text-green-400" />;
    if (status === 'in_progress') return <Clock className="w-5 h-5 text-yellow-400" />;
    return <AlertCircle className="w-5 h-5 text-red-400" />;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{name}</h3>
        {getStatusIcon()}
      </div>

      <div className="flex items-center justify-center mb-4">
        <div className="relative">
          <svg className="transform -rotate-90" width="160" height="160">
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#374151"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke={getColor()}
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: getColor() }}>
                {compliance_score.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-400 mt-1">compliance</div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-400">
          <span className="font-semibold text-white">{implemented_controls}</span>
          {' / '}
          <span>{total_controls}</span>
          {' controls'}
        </p>
        <p className="text-xs text-gray-500 mt-1 capitalize">{status.replace('_', ' ')}</p>
      </div>
    </div>
  );
};

export default ComplianceScoreGauge;
