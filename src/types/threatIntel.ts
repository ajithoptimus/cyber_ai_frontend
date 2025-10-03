// File: src/types/threatIntel.ts
export enum ThreatSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum ThreatCategory {
  MALWARE = 'malware',
  DDOS = 'ddos',
  PHISHING = 'phishing',
  RANSOMWARE = 'ransomware',
  DATA_EXFILTRATION = 'data_exfiltration',
  BRUTE_FORCE = 'brute_force',
  SQL_INJECTION = 'sql_injection',
  XSS = 'xss',
  ZERO_DAY = 'zero_day',
  APT = 'apt'
}

export enum ThreatStatus {
  DETECTED = 'detected',
  ANALYZING = 'analyzing',
  BLOCKED = 'blocked',
  MITIGATED = 'mitigated',
  MONITORING = 'monitoring'
}

export interface ThreatSource {
  ip: string | null;
  country: string | null;
  city: string | null;
  organization: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface Threat {
  id: string;
  timestamp: string;
  category: ThreatCategory;
  severity: ThreatSeverity;
  status: ThreatStatus;
  title: string;
  description: string;
  source: ThreatSource;
  target: string | null;
  indicators: Record<string, any>;
  ai_confidence: number;
  response_time_ms: number;
  mitigation_actions: string[];
}

export interface ThreatStatistics {
  total_threats: number;
  active_threats: number;
  blocked_threats: number;
  critical_threats: number;
  threats_by_category: Record<string, number>;
  threats_by_severity: Record<string, number>;
  avg_response_time_ms: number;
  top_source_countries: Array<{ country: string; count: number }>;
  last_updated: string;
}

export interface WebSocketThreatMessage {
  type: 'initial_threats' | 'new_threat' | 'statistics_update' | 'keepalive';
  timestamp: string;
  threats?: Threat[];
  threat?: Threat;
  statistics?: ThreatStatistics;
}
