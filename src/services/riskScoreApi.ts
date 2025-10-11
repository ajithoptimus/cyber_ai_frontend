// src/services/riskScoreApi.ts
import axios from 'axios';
import type { RiskScoreData, CompoundRisk, Finding, ScanHistory, RiskTrend } from '../types/riskScore.types';

const API_BASE_URL = 'http://localhost:8000/api/v1/dashboard';

export const riskScoreApi = {
  // Get current risk score
  getCurrentRiskScore: async (): Promise<RiskScoreData> => {
    const response = await axios.get(`${API_BASE_URL}/risk-score/current`);
    return response.data;
  },

  // Get risk trends
  getRiskTrends: async (days: number = 30): Promise<{ trends: RiskTrend[] }> => {
    const response = await axios.get(`${API_BASE_URL}/analytics/trends?days=${days}`);
    return response.data;
  },

  // Get compound risks
  getCompoundRisks: async (status?: string): Promise<{ compound_risks: CompoundRisk[] }> => {
    const url = status 
      ? `${API_BASE_URL}/compound-risks?status=${status}`
      : `${API_BASE_URL}/compound-risks`;
    const response = await axios.get(url);
    return response.data;
  },

  // Get findings
  getFindings: async (params?: {
    status?: string;
    severity?: string;
    limit?: number;
  }): Promise<{ findings: Finding[] }> => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.severity) queryParams.append('severity', params.severity);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const response = await axios.get(`${API_BASE_URL}/findings?${queryParams}`);
    return response.data;
  },

  // Get scan history
  getScanHistory: async (limit: number = 20): Promise<{ scan_history: ScanHistory[] }> => {
    const response = await axios.get(`${API_BASE_URL}/scan-history?limit=${limit}`);
    return response.data;
  },
};
