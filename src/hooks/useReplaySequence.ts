import { useState, useEffect, useCallback, useRef } from 'react';
import { ReplayPhase } from '../types/poseidon';
import { useStore } from '../store';
import { useReducedMotion } from './useReducedMotion';

export function useReplaySequence() {
  const [isReplaying, setIsReplaying] = useState(false);
  const phase = useStore(state => state.replayPhase);
  const setPhase = useStore(state => state.setReplayPhase);
  const setStep = useStore(state => state.setStep);
  const replaySpeed = useStore(state => state.replaySpeed);
  const reducedMotion = useStore(state => state.reducedMotion);
  const setAnimationFlags = useStore(state => state.setAnimationFlags);
  const addLog = useStore(state => state.addLog);
  
  const timeoutRefs = useRef<number[]>([]);

  const cancelReplay = useCallback(() => {
    timeoutRefs.current.forEach(t => clearTimeout(t));
    timeoutRefs.current = [];
    setIsReplaying(false);
  }, []);

  const trigger = useCallback(() => {
    if (isReplaying) cancelReplay();
    
    // Reset all synchronous boolean flags
    setAnimationFlags({
      metricsAnimating: false,
      confidenceAnimating: false,
      floodPolygonVisible: false,
      bengaliAlertVisible: false,
      audioPulse: false,
      hashTypewriting: false,
      verifiedVisible: false,
      damPulse: false,
    });

    if (reducedMotion) {
      setStep('OUTCOME');
      setPhase('OUTCOME');
      setAnimationFlags({
        metricsAnimating: true,
        confidenceAnimating: true,
        floodPolygonVisible: true,
        bengaliAlertVisible: true,
        hashTypewriting: true,
        verifiedVisible: true,
      });
      return;
    }

    setIsReplaying(true);
    setPhase('IDLE');
    setStep('CALM');
    addLog('Replay initiated — Aug 17, 2021 06:14Z', 'system');
    
    const multiplier = 1 / replaySpeed;

    const schedule = (callback: () => void, delay: number) => {
      const t = window.setTimeout(callback, delay * multiplier);
      timeoutRefs.current.push(t);
    };

    // t=400ms — Status switch
    schedule(() => {
      setPhase('ANOMALY');
      setStep('TRIGGER');
      addLog('CWC anomaly — Panchet discharge +340 cumecs', 'alert');
    }, 400);

    // t=800ms
    schedule(() => {
      setAnimationFlags({ damPulse: true });
      addLog('Dam discharge threshold exceeded — Panchet +340 cumecs', 'alert');
    }, 800);

    // t=1400ms
    schedule(() => {
      setAnimationFlags({ metricsAnimating: true });
      addLog('FNO inference running...', 'inference');
    }, 1400);

    // t=2400ms
    schedule(() => {
      setAnimationFlags({ confidenceAnimating: true });
      addLog('FNO inference complete — 88% confidence', 'inference');
    }, 2400);

    // t=3000ms
    schedule(() => {
      setPhase('ALERT');
      addLog('Alert threshold crossed — ALERT ACTIVE', 'alert');
    }, 3000);

    // t=3200ms
    schedule(() => {
      setAnimationFlags({ floodPolygonVisible: true });
      addLog('Flood extent model active — Ghatal reach', 'inference');
    }, 3200);

    // t=3500ms
    schedule(() => {
      setAnimationFlags({ bengaliAlertVisible: true });
      addLog('Gemini 2.0 alert generated — Bengali text ready', 'alert');
    }, 3500);

    // t=4200ms
    schedule(() => {
      setAnimationFlags({ audioPulse: true });
      addLog('Bengali TTS audio ready — 2.3s clip', 'alert');
      // Reset audioPulse after 200ms
      setTimeout(() => setAnimationFlags({ audioPulse: false }), 200);
    }, 4200);

    // t=4800ms
    schedule(() => {
      setAnimationFlags({ hashTypewriting: true });
      addLog('ZK proof anchored — block #19,284,712', 'blockchain');
    }, 4800);

    // t=5600ms
    schedule(() => {
      setAnimationFlags({ verifiedVisible: true });
      setPhase('OUTCOME');
      setStep('OUTCOME');
      addLog('On-chain verification complete', 'blockchain');
    }, 5600);

    // t=6200ms
    schedule(() => {
      setIsReplaying(false);
    }, 6200);

  }, [isReplaying, cancelReplay, reducedMotion, replaySpeed, setPhase, setStep, setAnimationFlags, addLog]);

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(t => clearTimeout(t));
    };
  }, []);

  return { isReplaying, trigger, phase, cancelReplay };
}
