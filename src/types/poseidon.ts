export type ReplayPhase = 'IDLE' | 'SAFE' | 'ANOMALY' | 'ALERT' | 'OUTCOME';

export interface FloodMetrics {
  waterDepth: number;           // from API water_depth — dynamic
  timeToPeak: string;           // hardcoded '14h' — not in API
  flowVelocity: number;         // hardcoded 2.3 — not in API
  confidencePct: number;        // hardcoded 87 — not in API
  dangerLevel: 'SAFE' | 'WARNING' | 'CRITICAL';
  simulatedCusecs: number;      // from API simulated_cusecs
}

export interface ChainRecord {
  predictionHash: string;    // full hex string
  blockNumber: number;
  network: string;
  timestamp: string;         // ISO 8601
}
