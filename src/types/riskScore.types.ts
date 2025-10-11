// src/types/riskScore.types.ts
export interface RiskScoreData {
  risk_score: number;
  risk_level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  total_findings: number;
  critical_issues: number;
  high_issues: number;
  medium_issues: number;
  low_issues: number;
  iac_findings: number;
  iam_findings: number;
  compound_risks: number;
  risk_trend: string;
  risk_change: number;
  scans_analyzed: number;
  files_scanned: number;
  last_updated: string;
}

export interface CompoundRisk {
  id: number;
  component: string;
  base_risk_score: number;
  compound_multiplier: number;
  final_risk_score: number;
  priority: string;
  attack_scenarios: string[];
  affected_resources: number;
  status: 'active' | 'mitigated' | 'acknowledged';
  detected_at: string;
  mitigated_at?: string;
}

export interface Finding {
  id: number;
  finding_hash: string;
  type: string;
  severity: string;
  title: string;
  description: string;
  remediation: string;
  filename: string;
  line_number: number;
  code_snippet: string;
  compliance_frameworks: string[];
  first_detected: string;
  last_detected: string;
  occurrence_count: number;
  status: string;
  resolved_at?: string;
  resolved_by?: string;
}

export interface ScanHistory {
  scan_id: string;
  filename: string;
  file_type: string;
  scan_type: string;
  file_size_bytes: number;
  findings_count: number;
  critical_findings: number;
  high_findings: number;
  medium_findings: number;
  low_findings: number;
  file_risk_score: number;
  scanned_at: string;
  scan_duration_ms: number;
}

export interface RiskTrend {
  date: string;
  risk_score: number;
  risk_level: string;
  total_findings: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  compound_risks: number;
}
