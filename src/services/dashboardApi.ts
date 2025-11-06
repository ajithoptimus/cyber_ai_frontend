import type { RiskMetrics, ExecutiveSummary, CategoryRisk, TrendData } from '../types/dashboard';

const API_BASE_URL = 'http://localhost:8000/api/v1/dashboard';

// Global helper (copy to any file like this)
function getAccessToken() {
  return localStorage.getItem('accessToken');
}

export class DashboardApiService {
  private async fetchApi<T>(endpoint: string): Promise<T> {
    const token = getAccessToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers
      });
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Dashboard API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  async getCurrentRisk(): Promise<RiskMetrics> {
    return this.fetchApi<RiskMetrics>('/risk/current');
  }
  async getExecutiveSummary(): Promise<ExecutiveSummary> {
    return this.fetchApi<ExecutiveSummary>('/executive-summary');
  }
  async getRiskCategories(): Promise<CategoryRisk[]> {
    return this.fetchApi<CategoryRisk[]>('/risk/categories');
  }
  async getTrends(): Promise<TrendData[]> {
    return this.fetchApi<TrendData[]>('/trends');
  }
  async refreshData(): Promise<void> {
    const token = getAccessToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    await fetch(`${API_BASE_URL}/refresh`, { method: 'POST', headers });
  }
  async healthCheck(): Promise<{ status: string }> {
    return this.fetchApi<{ status: string }>('/health');
  }
}

export const dashboardApi = new DashboardApiService();
