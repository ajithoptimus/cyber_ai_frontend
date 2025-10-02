// File: src/types/analytics.ts
// Phase 6E: Advanced Analytics TypeScript Interfaces

export interface ThreatAnalytics {
  timestamp: string;
  threat_count: number;
  active_threats: number;
  threats_blocked: number;
  threat_types: {
    ddos: number;
    malware: number;
    phishing: number;
    data_exfiltration: number;
    ransomware: number;
    apt: number;
  };
  avg_response_time_ms: number;
  security_score: number;
}

export interface AIPerformanceMetrics {
  model_accuracy: number;
  avg_analysis_time_ms: number;
  total_analyses: number;
  successful_detections: number;
  false_positives: number;
  autonomous_responses: number;
  uptime_percentage: number;
  last_model_update: string;
}

export interface AutonomousAIStats {
  total_autonomous_actions: number;
  successful_mitigations: number;
  avg_response_time_ms: number;
  threat_prevention_rate: number;
  cost_savings_usd: number;
  incidents_prevented: number;
}

export interface SecurityPostureScore {
  overall_score: number;
  threat_detection_score: number;
  response_efficiency_score: number;
  compliance_score: number;
  vulnerability_score: number;
  trend_direction: 'improving' | 'declining' | 'stable';
  last_updated: string;
}

export interface ExecutiveAnalytics {
  executive_summary: string;
  key_metrics: Record<string, string | number>;
  risk_assessment: string;
  budget_impact: {
    annual_savings: number;
    operational_cost: number;
    roi_percentage: number;
    payback_period_months: number;
  };
  compliance_status: Record<string, string>;
  recommendations: string[];
  roi_analysis: Record<string, number>;
}

