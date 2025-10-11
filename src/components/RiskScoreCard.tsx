// src/components/RiskScoreCard.tsx
import React from 'react';
import type { RiskScoreData } from '../types/riskScore.types';

interface RiskScoreCardProps {
  data: RiskScoreData;
}

const getRiskLevelColor = (level: string): string => {
  switch (level) {
    case 'CRITICAL': return '#dc2626'; // red-600
    case 'HIGH': return '#ea580c';     // orange-600
    case 'MEDIUM': return '#f59e0b';   // amber-500
    case 'LOW': return '#10b981';      // emerald-500
    case 'INFO': return '#3b82f6';     // blue-500
    default: return '#6b7280';         // gray-500
  }
};

export const RiskScoreCard: React.FC<RiskScoreCardProps> = ({ data }) => {
  const riskColor = getRiskLevelColor(data.risk_level);
  const scorePercentage = (data.risk_score / 100) * 100;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-l-4" style={{ borderLeftColor: riskColor }}>
      {/* Risk Score Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Risk Score</h2>
          <p className="text-sm text-gray-500">Last updated: {new Date(data.last_updated).toLocaleString()}</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold" style={{ color: riskColor }}>
            {data.risk_score.toFixed(1)}
          </div>
          <div className="text-lg font-semibold" style={{ color: riskColor }}>
            {data.risk_level}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="h-3 rounded-full transition-all duration-500"
            style={{ 
              width: `${scorePercentage}%`,
              backgroundColor: riskColor 
            }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-600 uppercase">Total Findings</div>
          <div className="text-2xl font-bold text-gray-800">{data.total_findings}</div>
        </div>

        <div className="bg-red-50 rounded-lg p-3">
          <div className="text-xs text-red-600 uppercase">Critical</div>
          <div className="text-2xl font-bold text-red-700">{data.critical_issues}</div>
        </div>

        <div className="bg-orange-50 rounded-lg p-3">
          <div className="text-xs text-orange-600 uppercase">High</div>
          <div className="text-2xl font-bold text-orange-700">{data.high_issues}</div>
        </div>

        <div className="bg-purple-50 rounded-lg p-3">
          <div className="text-xs text-purple-600 uppercase">Compound Risks</div>
          <div className="text-2xl font-bold text-purple-700">{data.compound_risks}</div>
        </div>
      </div>

      {/* Finding Types */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between text-sm">
        <div>
          <span className="text-gray-600">IaC Findings:</span>
          <span className="ml-2 font-semibold text-gray-800">{data.iac_findings}</span>
        </div>
        <div>
          <span className="text-gray-600">IAM Findings:</span>
          <span className="ml-2 font-semibold text-gray-800">{data.iam_findings}</span>
        </div>
        <div>
          <span className="text-gray-600">Scans:</span>
          <span className="ml-2 font-semibold text-gray-800">{data.scans_analyzed}</span>
        </div>
      </div>
    </div>
  );
};
