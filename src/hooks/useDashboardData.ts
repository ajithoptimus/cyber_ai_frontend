import { useState, useEffect } from 'react';
import { dashboardApi } from '../services/dashboardApi';
import type { RiskMetrics, ExecutiveSummary, CategoryRisk, TrendData } from '../types/dashboard';

export const useDashboardData = (refreshInterval: number = 300000) => {
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics | null>(null);
  const [executiveSummary, setExecutiveSummary] = useState<ExecutiveSummary | null>(null);
  const [categories, setCategories] = useState<CategoryRisk[]>([]);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [riskData, summaryData, categoryData, trendData] = await Promise.all([
        dashboardApi.getCurrentRisk(),
        dashboardApi.getExecutiveSummary(),
        dashboardApi.getRiskCategories(),
        dashboardApi.getTrends()
      ]);

      setRiskMetrics(riskData);
      setExecutiveSummary(summaryData);
      setCategories(categoryData);
      setTrends(trendData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    
    const interval = setInterval(fetchAllData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return {
    riskMetrics,
    executiveSummary,
    categories,
    trends,
    loading,
    error,
    refresh: fetchAllData
  };
};
