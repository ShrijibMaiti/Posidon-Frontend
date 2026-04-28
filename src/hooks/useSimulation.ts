'use client';

import { useState, useCallback } from 'react';
import type { SimulationRequest, SimulationResponse } from '../lib/types/poseidon';
import type { FloodMetrics } from '../types/poseidon';

const SIMULATION_URL = `${process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000'}/api/simulate`;

// Hardcoded fallback values for fields the API does not provide
const STATIC_FIELDS = {
  timeToPeak: '14h',
  flowVelocity: 2.3,
  confidencePct: 87,
} as const;

function mockSimulationResponse(cusecs: number): SimulationResponse {
  const depth = parseFloat(((cusecs / 25000.0) + 0.24).toFixed(2));
  const danger: SimulationResponse['danger_level'] =
    cusecs >= 144000 ? 'CRITICAL' : cusecs >= 94000 ? 'WARNING' : 'SAFE';
  return {
    status: 'mock',
    simulated_cusecs: cusecs,
    water_depth: depth,
    danger_level: danger,
  };
}

export function deriveFloodMetrics(response: SimulationResponse): FloodMetrics {
  return {
    waterDepth: response.water_depth,
    timeToPeak: STATIC_FIELDS.timeToPeak,
    flowVelocity: STATIC_FIELDS.flowVelocity,
    confidencePct: STATIC_FIELDS.confidencePct,
    dangerLevel: response.danger_level,
    simulatedCusecs: response.simulated_cusecs,
  };
}

export function dangerLevelToPhase(
  level: SimulationResponse['danger_level']
): 'IDLE' | 'ANOMALY' | 'ALERT' {
  switch (level) {
    case 'CRITICAL': return 'ALERT';
    case 'WARNING':  return 'ANOMALY';
    case 'SAFE':     return 'IDLE';
  }
}

export function useSimulation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SimulationResponse | null>(null);
  const [source, setSource] = useState<'live' | 'mock'>('mock');

  const runSimulation = useCallback(async (cusecValue: number) => {
    if (isNaN(cusecValue) || cusecValue <= 0) {
      setError('Enter a positive discharge value in cusecs');
      return;
    }

    setLoading(true);
    setError(null);

    const body: SimulationRequest = {
      discharge_cusecs: parseFloat(cusecValue.toFixed(2)),
    };

    try {
      const response = await fetch(SIMULATION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`API ${response.status}: ${response.statusText}`);
      }

      const data: SimulationResponse = await response.json();
      setResult(data);
      setSource('live');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.warn('[Poseidon] Live API unavailable, using mock:', message);
      const mock = mockSimulationResponse(cusecValue);
      setResult(mock);
      setSource('mock');
      setError('Live API offline — showing estimated values');
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setSource('mock');
  }, []);

  return { runSimulation, loading, error, result, source, reset };
}
