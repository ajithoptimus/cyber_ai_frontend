// Dashboard API Response Types
export interface RiskMetrics {
  unifiedRiskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  totalFindings: number;
  criticalIssues: number;
  lastUpdated: string;
}

export interface ExecutiveSummary {
  overallRiskScore: number;
  riskLevel: string;
  summary: string;
  keyRecommendations: string[];
  nextReviewDate: string;
  complianceGaps: number;
}

export interface CategoryRisk {
  category: string;
  riskScore: number;
  criticalCount: number;
  highCount: number;
  findings: number;
}

export interface TrendData {
  timestamp: string;
  riskScore: number;
  criticalFindings: number;
  totalFindings: number;
}


