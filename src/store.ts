import { create } from 'zustand';
import { ReplayPhase, FloodMetrics, ChainRecord } from './types/poseidon';
import { PoseidonPayload } from './lib/types/poseidon';
import { MOCK_PAYLOAD as API_MOCK } from './lib/mockPayload';

export type DangerLevel = 'STABLE' | 'MODERATE' | 'CRITICAL';

export interface FloodPayload {
  metadata: {
    timestamp: string;
    model_version: string;
    trigger_event: string;
  };
  prediction: {
    location: string;
    danger_level: string;
    metrics: FloodMetrics;
  };
  spatial_data: {
    grid_resolution: string;
    bounding_box: number[];
    actual_flood_geojson?: any;
  };
  chainRecord: ChainRecord;
}

export type DemoStep = 'CALM' | 'TRIGGER' | 'OUTCOME';

export type ActiveView = 'dashboard' | 'fno' | 'onchain' | 'broadcast' | 'settings';

export interface LogEntry {
  id: string;
  timestamp: string;
  text: string;
  type: 'inference' | 'blockchain' | 'alert' | 'system' | 'error';
}

const INITIAL_LOGS: LogEntry[] = [
  { id: '1', timestamp: '06:14:28', text: 'ZK proof verified on Polygon Amoy #19284712',         type: 'blockchain' },
  { id: '2', timestamp: '06:14:26', text: 'Bengali TTS audio generated (bn-IN-Wavenet-A)',        type: 'alert'      },
  { id: '3', timestamp: '06:14:24', text: 'Gemini 2.0 Flash alert text generated',               type: 'alert'      },
  { id: '4', timestamp: '06:14:22', text: 'ZK proof anchored to Polygon Amoy',                   type: 'blockchain' },
  { id: '5', timestamp: '06:14:21', text: 'FNO inference complete — depth 6.24m · CRITICAL',     type: 'inference'  },
  { id: '6', timestamp: '06:14:19', text: 'DVC discharge input received — 150,000 cusecs',       type: 'inference'  },
  { id: '7', timestamp: '06:14:15', text: 'Panchet discharge anomaly — 150,000 cusecs',          type: 'alert'      },
  { id: '8', timestamp: '06:14:12', text: 'Simulation trigger received via REST API',            type: 'system'     },
  { id: '9', timestamp: '06:14:10', text: 'System monitoring active — Damodar basin',            type: 'system'     },
];

interface PoseidonState {
  currentStep: DemoStep;
  replayPhase: ReplayPhase;
  activeView: ActiveView;
  replaySpeed: number;
  showScanlines: boolean;
  reducedMotion: boolean;
  alertPlaying: boolean;
  autoReplayOnLoad: boolean;
  
  // Animation Triggers
  metricsAnimating: boolean;
  confidenceAnimating: boolean;
  floodPolygonVisible: boolean;
  bengaliAlertVisible: boolean;
  audioPulse: boolean;
  hashTypewriting: boolean;
  verifiedVisible: boolean;
  damPulse: boolean;

  payload: FloodPayload;
  logs: LogEntry[];
  setStep: (step: DemoStep) => void;
  setReplayPhase: (phase: ReplayPhase) => void;
  setActiveView: (view: ActiveView) => void;
  setReplaySpeed: (speed: number) => void;
  setShowScanlines: (show: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  setAlertPlaying: (playing: boolean) => void;
  setAutoReplayOnLoad: (auto: boolean) => void;
  
  setAnimationFlags: (flags: Partial<{
    metricsAnimating: boolean;
    confidenceAnimating: boolean;
    floodPolygonVisible: boolean;
    bengaliAlertVisible: boolean;
    audioPulse: boolean;
    hashTypewriting: boolean;
    verifiedVisible: boolean;
    damPulse: boolean;
  }>) => void;
  
  addLog: (text: string, type: LogEntry['type']) => void;
}

const MOCK_PAYLOAD: FloodPayload = {
  metadata: API_MOCK.metadata,
  prediction: {
    location: API_MOCK.prediction.location,
    danger_level: API_MOCK.prediction.danger_level,
    metrics: {
      waterDepth: API_MOCK.prediction.water_depth,
      timeToPeak: '—',
      flowVelocity: 0.4,
      confidencePct: 0,
      dangerLevel: 'SAFE',
      simulatedCusecs: 0
    }
  },
  spatial_data: {
    grid_resolution: API_MOCK.spatial_data.grid_resolution,
    bounding_box: API_MOCK.spatial_data.bounding_box,
  },
  chainRecord: {
    predictionHash: "0x4f3e8a2c1d9b7e5f0a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f",
    blockNumber: 19284712,
    network: "Polygon Amoy",
    timestamp: "2021-08-17T06:14:28Z"
  }
};

export const useStore = create<PoseidonState>((set) => ({
  currentStep: 'CALM',
  replayPhase: 'IDLE',
  activeView: 'dashboard',
  replaySpeed: 1,
  showScanlines: true,
  reducedMotion: false,
  alertPlaying: false,
  autoReplayOnLoad: false,
  
  metricsAnimating: false,
  confidenceAnimating: false,
  floodPolygonVisible: false,
  bengaliAlertVisible: false,
  audioPulse: false,
  hashTypewriting: false,
  verifiedVisible: false,
  damPulse: false,

  payload: MOCK_PAYLOAD,
  logs: INITIAL_LOGS,
  setStep: (step) => set({ currentStep: step }),
  setReplayPhase: (phase) => set({ replayPhase: phase }),
  setActiveView: (view) => set({ activeView: view }),
  setReplaySpeed: (speed) => set({ replaySpeed: speed }),
  setShowScanlines: (show) => set({ showScanlines: show }),
  setReducedMotion: (reduced) => set({ reducedMotion: reduced }),
  setAlertPlaying: (playing) => set({ alertPlaying: playing }),
  setAutoReplayOnLoad: (auto) => set({ autoReplayOnLoad: auto }),
  
  setAnimationFlags: (flags) => set((state) => ({ ...state, ...flags })),
  
  addLog: (text, type) => set((state) => ({
    logs: [
      {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString().slice(11, 19),
        text,
        type
      },
      ...state.logs.slice(0, 39)
    ]
  })),
}));
