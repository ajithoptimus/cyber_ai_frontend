// File: src/services/threatIntelApi.ts
import type { Threat, ThreatStatistics } from '../types/threatIntel';

const API_BASE_URL = 'http://localhost:8000/api/v1/threat-intel';

export class ThreatIntelApiService {
  private async fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  }

  async getActiveThreats(): Promise<Threat[]> {
    return this.fetchApi<Threat[]>('/threats/active');
  }

  async getStatistics(): Promise<ThreatStatistics> {
    return this.fetchApi<ThreatStatistics>('/threats/statistics');
  }

  async generateTestThreat(): Promise<{ success: boolean; threat: Threat }> {
    return this.fetchApi('/threats/generate', { method: 'POST' });
  }

  async clearOldThreats(): Promise<{ success: boolean; message: string }> {
    return this.fetchApi('/threats/clear', { method: 'DELETE' });
  }

  async getStatus(): Promise<{ status: string; version: string }> {
    return this.fetchApi('/status');
  }
}

export const threatIntelApi = new ThreatIntelApiService();
