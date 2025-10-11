// src/components/RiskScoreDashboard.tsx - COMPLETE VERSION
import React, { useEffect, useState } from 'react';
import { riskScoreApi } from '../services/riskScoreApi';
import { RiskScoreCard } from './RiskScoreCard';
import { CompoundRisksPanel } from './CompoundRisksPanel';
import { RiskTrendChart } from './RiskTrendChart';
import { FindingsTable } from './FindingsTable';
import { ScanHistoryTable } from './ScanHistoryTable';
import type { RiskScoreData, CompoundRisk } from '../types/riskScore.types';

export const RiskScoreDashboard: React.FC = () => {
  const [riskData, setRiskData] = useState<RiskScoreData | null>(null);
  const [compoundRisks, setCompoundRisks] = useState<CompoundRisk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
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
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading risk score dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-semibold">{error}</p>
          <button
            onClick={loadDashboardData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">
            🛡️ Infrastructure Risk Score Dashboard
          </h1>
          <p className="text-blue-100">
            Real-time security risk analysis powered by AI • Last updated: {new Date(riskData.last_updated).toLocaleString()}
          </p>
        </div>

        {/* Row 1: Risk Score + Compound Risks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RiskScoreCard data={riskData} />
          <CompoundRisksPanel risks={compoundRisks} />
        </div>

        {/* Row 2: Trend Chart */}
        <RiskTrendChart days={7} />

        {/* Row 3: Findings Table */}
        <FindingsTable />

        {/* Row 4: Scan History */}
        <ScanHistoryTable />
      </div>
    </div>
  );
};
