import type { RiskMetrics, ExecutiveSummary, CategoryRisk, TrendData } from '../types/dashboard';

const API_BASE_URL = 'http://localhost:8000/api/v1/dashboard';

export class DashboardApiService {
  private async fetchApi<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
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
    await fetch(`${API_BASE_URL}/refresh`, { method: 'POST' });
  }

  async healthCheck(): Promise<{status: string}> {
    return this.fetchApi<{status: string}>('/health');
  }
}

export const dashboardApi = new DashboardApiService();
