import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: 'up' | 'down';
  trendValue: string;
  color: 'blue' | 'green' | 'red' | 'purple';
}

const ComplianceSummaryCard: React.FC<Props> = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  color
}) => {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
  };

  return (
    <div className={`bg-gray-800 rounded-lg p-6 border ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className="flex items-center space-x-1">
          {trend === 'up' ? (
            <TrendingUp className="w-4 h-4 text-green-400" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-400" />
          )}
        </div>
      </div>
      <h3 className="text-gray-400 text-sm mb-2">{title}</h3>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-xs text-gray-500">{trendValue}</p>
    </div>
  );
};

export default ComplianceSummaryCard;
