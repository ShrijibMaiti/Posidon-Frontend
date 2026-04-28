import React from 'react';
import { useStore } from '../../store';
import { useCountUp } from '../../hooks/useCountUp';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { ReplayPhase, FloodMetrics } from '../../types/poseidon';

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[11px] font-medium text-neutral-400 uppercase tracking-[0.1em] mb-1">
    {children}
  </div>
);

const MetricValue = ({ value, unit, isMonospace = true }: { value: string | number, unit?: string, isMonospace?: boolean }) => (
  <div className={`text-[24px] text-neutral-900 ${isMonospace ? 'font-mono' : 'font-semibold'}`}>
    {value}{unit && <span className="text-[14px] ml-1 text-neutral-400">{unit}</span>}
  </div>
);

const ConfidenceArc = ({ percentage }: { percentage: number }) => {
  const prefersReducedMotion = useReducedMotion();
  const circumference = 2 * Math.PI * 32;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg className="w-20 h-20 -rotate-90">
        {/* Background Track */}
        <circle
          cx="40"
          cy="40"
          r="32"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="4"
        />
        {/* Progress Arc */}
        <motion.circle
          cx="40"
          cy="40"
          r="32"
          fill="none"
          stroke="#16A34A"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: prefersReducedMotion ? 0 : 1, ease: "easeInOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[14px] font-mono text-neutral-900 leading-none">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
};

import { motion } from 'motion/react';
import { MOCK_PAYLOAD } from '../../lib/mockPayload';

const DEMO_PRESETS = {
  BASELINE: 15000,    // → SAFE  (water_depth ~0.84m)
  ANOMALY:  100000,   // → WARNING (water_depth ~4.24m)
  CRITICAL: 150000,   // → CRITICAL (water_depth ~6.24m)
} as const;

export const FnoMetricsPanel: React.FC<{ 
  phase: ReplayPhase;
  metricsAnimating: boolean;
  confidenceAnimating: boolean;
  damPulse: boolean;
  metrics: FloodMetrics;
  onSimulate: (cusecs: number) => void;
  simLoading: boolean;
  simError: string | null;
  simSource: 'live' | 'mock';
}> = ({ phase, metricsAnimating, confidenceAnimating, damPulse, metrics, onSimulate, simLoading, simError, simSource }) => {
  const { reducedMotion } = useStore();
  const [cusecInput, setCusecInput] = React.useState<string>(
    String(DEMO_PRESETS.CRITICAL)
  );
  
  const isAlertOrOutcome = phase === 'ALERT' || phase === 'OUTCOME';

  const waterDepthValue = useCountUp(metricsAnimating || isAlertOrOutcome ? metrics.waterDepth : 1.1, reducedMotion ? 1 : 1200, 1.1);
  const flowVelocityValue = useCountUp(metricsAnimating || isAlertOrOutcome ? metrics.flowVelocity : 0.4, reducedMotion ? 1 : 1200, 0.4);
  const confidenceValue = useCountUp(confidenceAnimating || isAlertOrOutcome ? metrics.confidencePct : 0, reducedMotion ? 1 : 1000, 0);

  return (
    <div className={`bg-white border-b border-neutral-200 p-8 flex flex-col transition-all duration-300 h-auto shrink-0 ${phase === 'ALERT' || phase === 'OUTCOME' ? 'ring-1 ring-red-500 bg-red-50/5' : ''}`}>
      <div className="space-y-8 flex-1">
        <div className="flex justify-between items-start">
          <h3 className="text-[13px] font-bold uppercase tracking-widest text-neutral-900">AI Inference (FNO)</h3>
          <motion.div 
            animate={damPulse ? { scale: [1, 1.1, 1], borderColor: ['#FBBF24', '#D97706', '#FBBF24'] } : {}}
            className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest border transition-colors ${
              phase === 'IDLE' || phase === 'SAFE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
              phase === 'ANOMALY' ? 'bg-amber-50 text-amber-700 border-amber-200' :
              'bg-red-50 text-red-700 border-red-200 shadow-sm'
            }`}
          >
            {phase === 'IDLE' || phase === 'SAFE' ? 'Safe' : phase === 'ANOMALY' ? 'Anomaly Detected' : 'Alert Active'}
          </motion.div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Water Depth</Label>
              <MetricValue value={waterDepthValue.toFixed(1)} unit="m" />
            </div>
            <div>
              <Label>Flow Velocity</Label>
              <MetricValue value={flowVelocityValue.toFixed(1)} unit="m/s" />
            </div>
          </div>

          <div>
            <Label>Time to Peak</Label>
            <MetricValue value={metricsAnimating || isAlertOrOutcome ? metrics.timeToPeak : "—"} isMonospace={false} />
          </div>

          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
            <div>
              <Label>Model Confidence</Label>
              <p className="text-[11px] text-neutral-400 max-w-[140px] leading-relaxed">
                Physics-informed neural operator accuracy rating.
              </p>
            </div>
            <ConfidenceArc percentage={confidenceValue} />
          </div>

          <div className="mt-4 pt-4 border-t border-neutral-100">
            <label className="block text-xs font-medium text-neutral-400 uppercase tracking-widest mb-2">
              DVC DISCHARGE INPUT
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={cusecInput}
                onChange={e => setCusecInput(e.target.value)}
                placeholder="cusecs"
                min="0"
                step="10"
                className="w-24 px-2 py-1.5 border border-neutral-200 text-sm font-mono text-neutral-900 bg-white placeholder-neutral-300 focus:outline-none focus:border-neutral-400 rounded-none"
                aria-label="DVC discharge in cusecs"
              />
              <span className="text-xs font-mono text-neutral-400">cusecs</span>
              <button
                onClick={() => onSimulate(parseFloat(cusecInput))}
                disabled={simLoading || !cusecInput}
                className={`
                  px-3 py-1.5 border text-xs font-mono tracking-wider rounded-none
                  transition-colors duration-150 cursor-pointer
                  disabled:opacity-40 disabled:cursor-not-allowed
                  ${simLoading
                    ? 'border-neutral-200 text-neutral-400 bg-neutral-50'
                    : 'border-neutral-900 text-neutral-900 bg-transparent hover:bg-neutral-900 hover:text-white'
                  }
                `}
              >
                {simLoading ? 'RUNNING...' : '▶ SIMULATE'}
              </button>
            </div>

            <div className="flex gap-1 mt-1">
              {[
                { label: 'BASELINE', value: DEMO_PRESETS.BASELINE },
                { label: 'ANOMALY',  value: DEMO_PRESETS.ANOMALY  },
                { label: 'CRITICAL', value: DEMO_PRESETS.CRITICAL },
              ].map(preset => (
                <button
                  key={preset.label}
                  onClick={() => {
                    setCusecInput(String(preset.value));
                    onSimulate(preset.value);
                  }}
                  className="px-2 py-1 text-xs font-mono border border-neutral-200 text-neutral-400 hover:border-neutral-900 hover:text-neutral-900 rounded-none transition-colors cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {simError && (
              <p className="mt-1.5 text-xs font-mono text-amber-600">
                ⚠ {simError}
              </p>
            )}

            {simSource === 'live' && !simError && (
              <p className="mt-1.5 text-xs font-mono text-green-600">
                ● LIVE MODEL RESPONSE
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
