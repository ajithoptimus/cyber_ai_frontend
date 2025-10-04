import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  openViolations: number;
}

const PolicyViolationHeatmap: React.FC<Props> = ({ openViolations }) => {
  // Sample data - in production, fetch from API
  const violationData = [
    { category: 'Access Control', count: Math.floor(openViolations * 0.3), severity: 'high' },
    { category: 'Data Protection', count: Math.floor(openViolations * 0.25), severity: 'critical' },
    { category: 'Network Security', count: Math.floor(openViolations * 0.2), severity: 'medium' },
    { category: 'Incident Response', count: Math.floor(openViolations * 0.15), severity: 'low' },
    { category: 'Physical Security', count: Math.floor(openViolations * 0.1), severity: 'medium' }
  ];

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-600',
      high: 'bg-orange-500',
      medium: 'bg-yellow-500',
      low: 'bg-blue-500'
    };
    return colors[severity] || 'bg-gray-500';
  };

  const maxCount = Math.max(...violationData.map(v => v.count), 1);

  return (
    <div className="space-y-4">
      {openViolations === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4">
            <AlertTriangle className="w-8 h-8 text-green-400" />
          </div>
          <p className="text-green-400 font-semibold">No Open Violations</p>
          <p className="text-gray-500 text-sm mt-2">All policies are being followed</p>
        </div>
      ) : (
        <>
          {violationData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">{item.category}</span>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(item.severity)}`}>
                    {item.severity}
                  </span>
                  <span className="text-sm font-bold text-white">{item.count}</span>
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full ${getSeverityColor(item.severity)} transition-all duration-500`}
                  style={{ width: `${(item.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default PolicyViolationHeatmap;
