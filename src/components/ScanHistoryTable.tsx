// src/components/ScanHistoryTable.tsx
import React, { useEffect, useState } from 'react';
import { riskScoreApi } from '../services/riskScoreApi';
import type { ScanHistory } from '../types/riskScore.types';

export const ScanHistoryTable: React.FC = () => {
  const [scans, setScans] = useState<ScanHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScanHistory();
  }, []);

  const loadScanHistory = async () => {
    try {
      setLoading(true);
      const response = await riskScoreApi.getScanHistory(20);
      setScans(response.scan_history);
    } catch (error) {
      console.error('Failed to load scan history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score: number): string => {
    if (score >= 80) return 'text-red-600 font-bold';
    if (score >= 60) return 'text-orange-600 font-semibold';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-800">📋 Scan History</h3>
        <p className="text-sm text-gray-600">{scans.length} recent scans</p>
      </div>

      {/* Table */}
      {scans.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No scans performed yet. Upload a file to begin scanning.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  File
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                  Findings
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                  Risk Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Scanned
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {scans.map((scan) => (
                <tr key={scan.scan_id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{scan.filename}</div>
                    <div className="text-xs text-gray-500">{formatFileSize(scan.file_size_bytes)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                      {scan.file_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="text-sm font-semibold text-gray-900">
                      {scan.findings_count}
                    </div>
                    <div className="flex justify-center gap-1 mt-1 text-xs">
                      {scan.critical_findings > 0 && (
                        <span className="text-red-600 font-semibold">
                          {scan.critical_findings}C
                        </span>
                      )}
                      {scan.high_findings > 0 && (
                        <span className="text-orange-600">
                          {scan.high_findings}H
                        </span>
                      )}
                      {scan.medium_findings > 0 && (
                        <span className="text-yellow-600">
                          {scan.medium_findings}M
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className={`text-lg font-bold ${getRiskColor(scan.file_risk_score)}`}>
                      {scan.file_risk_score.toFixed(1)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(scan.scanned_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center text-xs text-gray-500">
                    {scan.scan_duration_ms}ms
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
