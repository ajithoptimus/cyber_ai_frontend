import React from 'react';
import type { ExecutiveSummary } from '../types/dashboard';

interface ExecutiveSummaryCardProps {
  summary: ExecutiveSummary;
}

export const ExecutiveSummaryCard: React.FC<ExecutiveSummaryCardProps> = ({ summary }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-xl font-semibold text-white mb-4">Executive Summary</h3>
      
      <div className="space-y-4">
        <p className="text-gray-300 leading-relaxed">{summary.summary}</p>
        
        <div>
          <h4 className="text-sm font-semibold text-gray-400 mb-2">Key Recommendations</h4>
          <ul className="space-y-2">
            {summary.keyRecommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-blue-400 mt-1">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-gray-700">
          <div>
            <span className="text-xs text-gray-500">Next Review</span>
            <p className="text-sm text-white">{summary.nextReviewDate}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500">Compliance Gaps</span>
            <p className="text-sm text-white">{summary.complianceGaps}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
