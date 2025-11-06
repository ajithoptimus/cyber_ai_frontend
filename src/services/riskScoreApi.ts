import axios from 'axios';
import type { RiskScoreData, CompoundRisk, Finding, ScanHistory, RiskTrend } from '../types/riskScore.types';

const API_BASE_URL = 'http://localhost:8000/api/v1/dashboard';

const riskScoreApi = {
  getCurrentRiskScore: async (): Promise<RiskScoreData> => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/risk-score/current`, {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : undefined,
    });
    return response.data;
  },

  getRiskTrends: async (days: number = 30): Promise<{ trends: RiskTrend[] }> => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/analytics/trends?days=${days}`, {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : undefined,
    });
    return response.data;
  },

  getCompoundRisks: async (status?: string): Promise<{ compound_risks: CompoundRisk[] }> => {
    const token = localStorage.getItem('accessToken');
    const url = status
      ? `${API_BASE_URL}/compound-risks?status=${status}`
      : `${API_BASE_URL}/compound-risks`;
    const response = await axios.get(url, {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : undefined,
    });
    return response.data;
  },

  getFindings: async (params?: {
    status?: string;
    severity?: string;
    limit?: number;
  }): Promise<{ findings: Finding[] }> => {
    const token = localStorage.getItem('accessToken');
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.severity) queryParams.append('severity', params.severity);
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const response = await axios.get(`${API_BASE_URL}/findings?${queryParams}`, {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : undefined,
    });
    return response.data;
  },

  getScanHistory: async (limit: number = 20): Promise<{ scan_history: ScanHistory[] }> => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/scan-history?limit=${limit}`, {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : undefined,
    });
    return response.data;
  },

  // PDF REPORT DOWNLOAD
  downloadPDFReport: async (scanId?: string): Promise<Blob> => {
    const token = localStorage.getItem('accessToken');
    const url = scanId
      ? `${API_BASE_URL}/generate-report-pdf/${scanId}`
      : `${API_BASE_URL}/generate-report-pdf`;

    const response = await axios.post(
      url,
      {
        filename: 'security_audit',
        file_type: 'terraform'
      },
      {
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        }
      }
    );
    return response.data;
  },

  downloadPDFReportByScanId: async (scanId: string): Promise<Blob> => {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/generate-report-pdf/${scanId}`, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/pdf',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      }
    });
    return response.data;
  },
};

export { riskScoreApi };
