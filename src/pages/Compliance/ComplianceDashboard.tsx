import React, { useState, useEffect } from 'react';
import { Activity, Shield, AlertTriangle, FileText, TrendingUp } from 'lucide-react';
import ComplianceScoreGauge from '../../components/Compliance/ComplianceScoreGauge';
import FrameworkProgressBar from '../../components/Compliance/FrameworkProgressBar';
import PolicyViolationHeatmap from '../../components/Compliance/PolicyViolationHeatmap';
import AuditTimeline from '../../components/Compliance/AuditTimeline';
import RiskMatrix from '../../components/Compliance/RiskMatrix';
import ComplianceSummaryCard from '../../components/Compliance/ComplianceSummaryCard';

interface Framework {
  id: number;
  name: string;
  version: string;
  compliance_score: number;
  implemented_controls: number;
  total_controls: number;
  status: string;
  last_assessment: string | null;
}

interface DashboardSummary {
  frameworks: Framework[];
  policy_compliance_rate: number;
  open_violations: number;
  audit_statistics: {
    total_events: number;
    by_category: Record<string, number>;
    by_severity: Record<string, number>;
    failed_authentication_attempts: number;
  };
  timestamp: string;
}

const ComplianceDashboard: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:8000/compliance/dashboard/summary');
      if (!response.ok) throw new Error('Failed to fetch compliance data');
      const data = await response.json();
      setSummary(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <Activity className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-300 text-lg">Loading compliance data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const overallScore = summary?.frameworks.length
    ? summary.frameworks.reduce((acc, f) => acc + f.compliance_score, 0) / summary.frameworks.length
    : 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Compliance & Governance
            </h1>
            <p className="text-gray-400">
              Real-time compliance monitoring and policy enforcement
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Activity className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <ComplianceSummaryCard
          title="Overall Compliance"
          value={`${overallScore.toFixed(1)}%`}
          icon={<Shield className="w-8 h-8" />}
          trend={overallScore >= 80 ? 'up' : 'down'}
          trendValue={`${summary?.frameworks.length || 0} frameworks`}
          color="blue"
        />
        <ComplianceSummaryCard
          title="Policy Compliance"
          value={`${summary?.policy_compliance_rate.toFixed(1)}%`}
          icon={<FileText className="w-8 h-8" />}
          trend={summary && summary.policy_compliance_rate >= 90 ? 'up' : 'down'}
          trendValue={`${summary?.open_violations || 0} violations`}
          color="green"
        />
        <ComplianceSummaryCard
          title="Open Violations"
          value={summary?.open_violations.toString() || '0'}
          icon={<AlertTriangle className="w-8 h-8" />}
          trend={summary && summary.open_violations > 0 ? 'down' : 'up'}
          trendValue="Requires attention"
          color="red"
        />
        <ComplianceSummaryCard
          title="Audit Events"
          value={summary?.audit_statistics.total_events.toString() || '0'}
          icon={<TrendingUp className="w-8 h-8" />}
          trend="up"
          trendValue="Last 30 days"
          color="purple"
        />
      </div>

      {/* Compliance Score Gauges */}
      {summary && summary.frameworks.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Framework Compliance Scores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {summary.frameworks.map((framework) => (
              <ComplianceScoreGauge
                key={framework.id}
                framework={framework}
              />
            ))}
          </div>
        </div>
      )}

      {/* Framework Progress Bars */}
      {summary && summary.frameworks.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Control Implementation Progress</h2>
          <div className="bg-gray-800 rounded-lg p-6 space-y-4 border border-gray-700">
            {summary.frameworks.map((framework) => (
              <FrameworkProgressBar
                key={framework.id}
                framework={framework}
              />
            ))}
          </div>
        </div>
      )}

      {/* Grid Layout for Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Policy Violations Heatmap */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">Policy Violations Heatmap</h2>
          <PolicyViolationHeatmap openViolations={summary?.open_violations || 0} />
        </div>

        {/* Risk Matrix */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">Risk Matrix</h2>
          <RiskMatrix />
        </div>
      </div>

      {/* Audit Timeline */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold mb-4">Recent Audit Events</h2>
        <AuditTimeline statistics={summary?.audit_statistics} />
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        Last updated: {summary ? new Date(summary.timestamp).toLocaleString() : 'Never'}
      </div>
    </div>
  );
};

export default ComplianceDashboard;
