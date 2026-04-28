import React, { useState, useEffect } from 'react';
import { useStore, DemoStep } from '../../store';
import { ReplayPhase } from '../../types/poseidon';
import { Activity, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TopNavProps {
  phase: ReplayPhase;
  isReplaying: boolean;
  onReplay: () => void;
  onCancel?: () => void;
  onSimulate: (cusecs: number) => void;
  source?: 'mock' | 'live';
}

const DEMO_PRESETS = {
  BASELINE: 15000,    // → SAFE
  ANOMALY:  100000,   // → WARNING
  CRITICAL: 150000,   // → CRITICAL
} as const;

export const TopNav: React.FC<TopNavProps> = ({ phase, isReplaying, onReplay, onCancel, onSimulate, source = 'mock' }) => {
  const { currentStep, setStep, setReplayPhase, addLog } = useStore();
  const [utcTime, setUtcTime] = useState(new Date().toISOString().slice(11, 19) + ' UTC');

  useEffect(() => {
    const timer = setInterval(() => {
      setUtcTime(new Date().toISOString().slice(11, 19) + ' UTC');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleScrub = (step: DemoStep) => {
    if (isReplaying && onCancel) onCancel();
    
    setStep(step);
    if (step === 'CALM') {
      setReplayPhase('IDLE');
      onSimulate(DEMO_PRESETS.BASELINE);
      addLog('Manual scrub — BASELINE phase', 'system');
    } else if (step === 'TRIGGER') {
      setReplayPhase('ANOMALY');
      onSimulate(DEMO_PRESETS.ANOMALY);
      addLog('Manual scrub — EVENT TRIGGER phase', 'system');
    } else if (step === 'OUTCOME') {
      setReplayPhase('OUTCOME');
      onSimulate(DEMO_PRESETS.CRITICAL);
      addLog('Manual scrub — FINAL OUTCOME phase', 'system');
    }
  };

  const statusColors: Record<ReplayPhase, { text: string, bg: string, label: string }> = {
    IDLE: { text: "text-emerald-600", bg: "bg-emerald-600", label: "Safe" },
    SAFE: { text: "text-emerald-600", bg: "bg-emerald-600", label: "Safe" },
    ANOMALY: { text: "text-amber-600", bg: "bg-amber-600", label: "Anomaly Detected" },
    ALERT: { text: "text-red-600", bg: "bg-red-600", label: "Alert Active" },
    OUTCOME: { text: "text-neutral-500", bg: "bg-neutral-500", label: "Post-Event Analysis" }
  };

  const status = statusColors[phase];

  const getIsActive = (step: DemoStep) => {
    if (step === 'CALM' && phase === 'IDLE') return true;
    if (step === 'TRIGGER' && (phase === 'ANOMALY' || phase === 'ALERT')) return true;
    if (step === 'OUTCOME' && phase === 'OUTCOME') return true;
    return false;
  };

  return (
    <header className="h-16 border-b border-neutral-200 bg-white flex items-center px-8 justify-between z-10 shrink-0">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none">Simulation Phase</span>
          <div className="flex items-center bg-neutral-100 rounded-none p-1 gap-1">
            {(['CALM', 'TRIGGER', 'OUTCOME'] as DemoStep[]).map((step) => {
              const isActive = getIsActive(step);
              return (
                <button
                  key={step}
                  onClick={() => handleScrub(step)}
                  className={cn(
                    "px-3 py-1 text-[11px] font-bold uppercase tracking-tight transition-all rounded-none relative",
                    isActive 
                      ? "text-black font-[600]" 
                      : "text-neutral-400 hover:text-neutral-600"
                  )}
                >
                  {step === 'CALM' ? "Baseline" : step === 'TRIGGER' ? "Event Trigger" : "Final Outcome"}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-900 mx-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={onReplay}
          disabled={isReplaying}
          className="px-4 py-1.5 border border-neutral-900 text-neutral-900 border-neutral-900 bg-transparent text-[11px] font-mono font-bold uppercase tracking-[0.08em] hover:bg-neutral-900 hover:text-white transition-all disabled:opacity-50"
        >
          {isReplaying ? "▶ REPLAYING..." : phase === 'OUTCOME' ? "↺ REPLAY AGAIN" : "▶ REPLAY AUG 17, 2021"}
        </button>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <span className="border border-blue-200 text-blue-600 bg-blue-50 text-[10px] font-mono px-2 py-0.5 rounded">
            POLYGON AMOY
          </span>
          {source === 'mock' ? (
            <span className="text-[10px] font-mono text-amber-500 border border-amber-200 bg-amber-50 px-2 py-0.5 rounded animate-pulse">
              MOCK DATA
            </span>
          ) : (
            <span className="text-[10px] font-mono text-green-600 border border-green-200 bg-green-50 px-2 py-0.5 rounded">
              LIVE API
            </span>
          )}
          <span className="font-mono text-[10px] text-neutral-400">
            {utcTime}
          </span>
        </div>

        {(phase === 'ANOMALY' || phase === 'ALERT') && (
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-neutral-500 bg-neutral-50 px-2.5 py-1.5 border border-neutral-200">
            <Activity size={12} className={phase === 'ALERT' ? "text-red-500" : "text-amber-500"} />
            <span>Basin Status: Live Simulation Active</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
          <span>Damodar Basin:</span>
          <span className={cn("flex items-center gap-2", status.text)}>
            <span className={cn("w-1.5 h-1.5 rounded-full", status.bg, (phase !== 'OUTCOME' && phase !== 'IDLE' && phase !== 'SAFE') && "animate-pulse")} />
            {status.label}
          </span>
        </div>
      </div>
    </header>
  );
};
