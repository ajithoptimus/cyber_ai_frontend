import React from 'react';

interface Framework {
  id: number;
  name: string;
  compliance_score: number;
  implemented_controls: number;
  total_controls: number;
  status: string;
}

interface Props {
  framework: Framework;
}

const FrameworkProgressBar: React.FC<Props> = ({ framework }) => {
  const { name, compliance_score, implemented_controls, total_controls } = framework;

  const getProgressColor = () => {
    if (compliance_score >= 90) return 'bg-green-500';
    if (compliance_score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white">{name}</span>
        <span className="text-sm text-gray-400">
          {implemented_controls} / {total_controls} controls
        </span>
      </div>
      
      <div className="relative">
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full ${getProgressColor()} transition-all duration-1000 rounded-full`}
            style={{ width: `${compliance_score}%` }}
          >
            <div className="h-full w-full bg-gradient-to-r from-transparent to-white/20"></div>
          </div>
        </div>
        <span className="absolute right-2 top-0 text-xs font-semibold text-white">
          {compliance_score.toFixed(1)}%
        </span>
      </div>
    </div>
  );
};

export default FrameworkProgressBar;

