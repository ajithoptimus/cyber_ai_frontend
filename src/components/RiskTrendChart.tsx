// src/components/RiskTrendChart.tsx
import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { riskScoreApi } from '../services/riskScoreApi';
import type { RiskTrend } from '../types/riskScore.types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface RiskTrendChartProps {
  days?: number;
}

export const RiskTrendChart: React.FC<RiskTrendChartProps> = ({ days = 7 }) => {
  const [trends, setTrends] = useState<RiskTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(days);

  useEffect(() => {
    loadTrends();
  }, [timeRange]);

  const loadTrends = async () => {
    try {
      setLoading(true);
      const response = await riskScoreApi.getRiskTrends(timeRange);
      setTrends(response.trends);
    } catch (error) {
      console.error('Failed to load trends:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: trends.map(t => new Date(t.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })),
    datasets: [
      {
        label: 'Risk Score',
        data: trends.map(t => t.risk_score),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Critical Findings',
        data: trends.map(t => t.critical_count * 10), // Scale for visibility
        borderColor: 'rgb(234, 88, 12)',
        backgroundColor: 'rgba(234, 88, 12, 0.1)',
        fill: false,
        tension: 0.4,
        pointRadius: 3,
        borderDash: [5, 5],
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Risk Score Trend Analysis',
        font: {
          size: 16,
          weight: 'bold' as const,
        }
      },
      tooltip: {
        callbacks: {
          afterLabel: function(context: any) {
            const index = context.dataIndex;
            const trend = trends[index];
            return [
              `Total Findings: ${trend.total_findings}`,
              `Critical: ${trend.critical_count}`,
              `High: ${trend.high_count}`,
              `Compound Risks: ${trend.compound_risks}`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Risk Score'
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (trends.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📈 Risk Trend Analysis</h3>
        <p className="text-gray-500 text-center py-8">No trend data available. Upload files to see trends.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header with Time Range Selector */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">📈 Risk Trend Analysis</h3>
        <div className="flex gap-2">
          {[7, 14, 30].map(d => (
            <button
              key={d}
              onClick={() => setTimeRange(d)}
              className={`px-3 py-1 text-sm rounded ${
                timeRange === d
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>

      {/* Stats Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-xs text-gray-600">Average</div>
          <div className="text-lg font-bold text-gray-800">
            {(trends.reduce((sum, t) => sum + t.risk_score, 0) / trends.length).toFixed(1)}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-600">Peak</div>
          <div className="text-lg font-bold text-red-600">
            {Math.max(...trends.map(t => t.risk_score)).toFixed(1)}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-600">Lowest</div>
          <div className="text-lg font-bold text-green-600">
            {Math.min(...trends.map(t => t.risk_score)).toFixed(1)}
          </div>
        </div>
      </div>
    </div>
  );
};
