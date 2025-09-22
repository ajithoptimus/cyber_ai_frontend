import React from 'react';

interface RiskScoreGaugeProps {
  score: number;
  level: string;
  animated?: boolean;
}

export const RiskScoreGauge: React.FC<RiskScoreGaugeProps> = ({ 
  score, 
  level, 
  animated = true 
}) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 10) * circumference;
  
  const getRiskColor = (level: string) => {
    switch (level.toUpperCase()) {
      case 'LOW': return 'text-green-500 stroke-green-500';
      case 'MEDIUM': return 'text-yellow-500 stroke-yellow-500';
      case 'HIGH': return 'text-orange-500 stroke-orange-500';
      case 'CRITICAL': return 'text-red-500 stroke-red-500';
      default: return 'text-blue-500 stroke-blue-500';
    }
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="w-32 h-32 -rotate-90 drop-shadow-lg" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-gray-700/30"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={`${getRiskColor(level)} ${animated ? 'transition-all duration-2000 ease-out' : ''}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-bold ${getRiskColor(level)}`}>
          {score.toFixed(1)}
        </span>
        <span className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
          {level}
        </span>
      </div>
    </div>
  );
};
