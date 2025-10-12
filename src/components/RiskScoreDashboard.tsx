// src/components/RiskScoreDashboard.tsx - COMPLETE WITH PDF DOWNLOAD
import React, { useEffect, useState } from 'react';
import { riskScoreApi } from '../services/riskScoreApi';
import { RiskScoreCard } from './RiskScoreCard';
import { CompoundRisksPanel } from './CompoundRisksPanel';
import { RiskTrendChart } from './RiskTrendChart';
import { FindingsTable } from './FindingsTable';
import { ScanHistoryTable } from './ScanHistoryTable';
import { PDFDownloadButton } from './PDFDownloadButton';
import type { RiskScoreData, CompoundRisk } from '../types/riskScore.types';

export const RiskScoreDashboard: React.FC = () => {
  const [riskData, setRiskData] = useState<RiskScoreData | null>(null);
  const [compoundRisks, setCompoundRisks] = useState<CompoundRisk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [riskScore, compounds] = await Promise.all([
        riskScoreApi.getCurrentRiskScore(),
        riskScoreApi.getCompoundRisks('active'),
      ]);

      setRiskData(riskScore);
      setCompoundRisks(compounds.compound_risks);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !riskData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading risk score dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md">
          <svg className="w-12 h-12 text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-600 font-semibold mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!riskData) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header with PDF Download Button */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">
                🛡️ Infrastructure Risk Score Dashboard
              </h1>
              <p className="text-blue-100">
                Real-time security risk analysis powered by AI • Last updated: {new Date(riskData.last_updated).toLocaleString()}
              </p>
            </div>
            
            {/* PDF Download Button */}
            <div className="ml-6">
              <PDFDownloadButton 
                variant="secondary"
                filename="Cyber_AI_Security_Audit"
                className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg"
              />
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="mt-6 grid grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{riskData.risk_score.toFixed(1)}</div>
              <div className="text-xs text-blue-100">Risk Score</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-red-300">{riskData.critical_issues}</div>
              <div className="text-xs text-blue-100">Critical</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-orange-300">{riskData.high_issues}</div>
              <div className="text-xs text-blue-100">High</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{riskData.total_findings}</div>
              <div className="text-xs text-blue-100">Total Findings</div>
            </div>
          </div>
        </div>

        {/* Row 1: Risk Score Card + Compound Risks Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RiskScoreCard data={riskData} />
          <CompoundRisksPanel risks={compoundRisks} />
        </div>

        {/* Row 2: Risk Trend Chart */}
        <RiskTrendChart days={7} />

        {/* Row 3: Findings Table */}
        <FindingsTable />

        {/* Row 4: Scan History */}
        <ScanHistoryTable />

        {/* Footer */}
        <div className="bg-white rounded-lg shadow p-4 text-center text-sm text-gray-600">
          <p>
            Powered by <strong>Cyber.AI v2.1</strong> • AI-Powered Security Analysis Platform
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Auto-refreshes every 30 seconds • {riskData.scans_analyzed} scans analyzed
          </p>
        </div>
      </div>
    </div>
  );
};
