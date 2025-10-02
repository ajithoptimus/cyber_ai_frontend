// File: src/services/analyticsApi.ts
import type {
  ThreatAnalytics,
  AIPerformanceMetrics,
  AutonomousAIStats,
  SecurityPostureScore,
  ExecutiveAnalytics
} from '../types/analytics';

const API_BASE_URL = 'http://localhost:8000/api/v1/analytics';


export class AnalyticsApiService {
  private async fetchApi<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  }

  async getRealtimeThreats() { return this.fetchApi<ThreatAnalytics>('/threats/realtime'); }
  async getAIPerformance() { return this.fetchApi<AIPerformanceMetrics>('/ai/performance'); }
  async getAutonomousAIStats() { return this.fetchApi<AutonomousAIStats>('/ai/autonomous'); }
  async getSecurityScore() { return this.fetchApi<SecurityPostureScore>('/security/score'); }
  async getExecutiveDashboard() { return this.fetchApi<ExecutiveAnalytics>('/executive/dashboard'); }
}

export const analyticsApi = new AnalyticsApiService();


