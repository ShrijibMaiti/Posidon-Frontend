/*
 * DEMO DAY CHECKLIST — Project Poseidon
 * 
 * BEFORE DEMO:
 * 1. Get Cloudflare URL from Person A
 * 2. Update NEXT_PUBLIC_API_URL in .env.local — no trailing slash
 * 3. Restart dev server (npm run dev)
 * 4. Test 150000 cusec strike — confirm red
 * 5. Reset to BASELINE — confirm green
 * 6. Confirm Bengali audio file at /public/audio/ghatal_alert.mp3
 * 
 * DURING DEMO:
 * - Minute 1: Dashboard open, green (SAFE), do nothing
 * - Minute 2: Judge gives number → type it → click Simulate → screen goes red
 * - On red: Person A triggers Bengali audio from their speakers
 * - Play button in Bengali panel is also ready as backup
 * 
 * DEMO PRESETS (one-click):
 * - BASELINE = 15,000 cusecs → SAFE (green)
 * - ANOMALY  = 100,000 cusecs → WARNING (amber)
 * - CRITICAL = 150,000 cusecs → CRITICAL (red)
 * 
 * FALLBACK: If Cloudflare tunnel is down, change .env.local to:
 * NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
 * (requires Person A's laptop on same network or both on localhost)
 */

import React, { useEffect } from 'react';
import { LayoutDashboard, Cpu, Database, Radio, Settings, Activity } from 'lucide-react';
import { useStore } from '../store';
import { cn } from '../lib/utils';
import SpatialMap from '../components/Map';
import { TopNav } from '../components/dashboard/TopNav';
import { FnoMetricsPanel } from '../components/dashboard/FnoMetricsPanel';
import { BengaliAlertPanel } from '../components/dashboard/BengaliAlertPanel';
import { BlockchainPanel } from '../components/dashboard/BlockchainPanel';
import { EventLog } from '../components/dashboard/EventLog';
import { useReplaySequence } from '../hooks/useReplaySequence';
import { usePoseidonData } from '../hooks/usePoseidonData';
import { useSimulation, deriveFloodMetrics, dangerLevelToPhase } from '../hooks/useSimulation';
import { ReplayPhase, FloodMetrics } from '../types/poseidon';
import { MOCK_PAYLOAD } from '../lib/mockPayload';

import { FnoView } from '../components/views/FnoView';
import { OnChainView } from '../components/views/OnChainView';
import { BroadcastView } from '../components/views/BroadcastView';
import { SettingsView } from '../components/views/SettingsView';

const SidebarItem = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-6 py-2.5 text-[13px] transition-colors cursor-pointer rounded-none",
      active 
        ? "text-neutral-900 bg-neutral-100 border-l-2 border-neutral-900 font-medium" 
        : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 border-l-2 border-transparent"
    )}
  >
    <Icon size={18} className={cn(active ? "text-neutral-900" : "text-neutral-400")} />
    {label}
  </div>
);

export default function Dashboard() {
  const { data: payload, loading, source } = usePoseidonData();
  const { runSimulation, loading: simLoading, error: simError, result: simResult, source: simSource } = useSimulation();
  const { 
    activeView, 
    setActiveView, 
    autoReplayOnLoad,
    metricsAnimating,
    confidenceAnimating,
    floodPolygonVisible,
    bengaliAlertVisible,
    audioPulse,
    hashTypewriting,
    verifiedVisible,
    damPulse,
    setReplayPhase,
    addLog
  } = useStore();
  const { phase, trigger, isReplaying, cancelReplay } = useReplaySequence();

  // Task 4: Danger Level mapping
  useEffect(() => {
    if (payload) {
      const dangerLevelToPhaseLocal = (level: string): ReplayPhase => {
        switch (level) {
          case 'CRITICAL': return 'ALERT';
          case 'WARNING':  return 'ANOMALY';
          case 'SAFE':     return 'SAFE';
          default:         return 'IDLE';
        }
      };
      
      // Act 1: Force initial phase to IDLE if no simulation result yet
      if (!isReplaying && !simResult) {
        setReplayPhase('IDLE');
      } else if (!isReplaying && simResult) {
        setReplayPhase(dangerLevelToPhaseLocal(simResult.danger_level));
      }
    }
  }, [payload, isReplaying, setReplayPhase, simResult]);

  useEffect(() => {
    if (autoReplayOnLoad) {
      const timer = setTimeout(() => {
        trigger();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []); // Runs once on mount

  // Task 4: Act 1 Baseline - Dashboard must open in SAFE/green state
  const activeMetrics: FloodMetrics | null = payload
    ? (simResult
        ? deriveFloodMetrics(simResult)
        : {
            waterDepth: 0.84,        // SAFE baseline depth
            timeToPeak: '—',
            flowVelocity: 0.4,
            confidencePct: 0,
            dangerLevel: 'SAFE',
            simulatedCusecs: 0,
          })
    : null;

  // Task 3: Trigger phase transition on simulation result
  useEffect(() => {
    if (!simResult) return;
    const phase = dangerLevelToPhase(simResult.danger_level);
    setReplayPhase(phase);
  }, [simResult, setReplayPhase]);

  // Task 6/7: Log entries on simulation
  useEffect(() => {
    if (!simResult) return;
    if (simSource === 'live') {
      addLog(
        `FNO simulation — ${simResult.simulated_cusecs.toLocaleString()} cusecs · ${simResult.water_depth.toFixed(2)}m · ${simResult.danger_level}`,
        'inference'
      );
    } else {
      addLog('Simulation API offline — estimated values shown', 'system');
    }
  }, [simResult, simSource, addLog]);

  if (loading || !payload) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-neutral-50 font-mono text-xs uppercase tracking-widest">
        Initializing Poseidon Core...
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-neutral-50 text-neutral-900 font-sans">
      {/* 1. Left Sidebar */}
      <aside className="w-[250px] border-r border-neutral-200 bg-white flex flex-col pt-8 shrink-0 relative">
        <div className="px-8 mb-12">
          <h1 className="text-xl font-black tracking-tighter text-black uppercase">Poseidon.</h1>
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Flood Intelligence</p>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={activeView === 'dashboard'} 
            onClick={() => setActiveView('dashboard')}
          />
          <SidebarItem 
            icon={Cpu} 
            label="AI Inference (FNO)" 
            active={activeView === 'fno'} 
            onClick={() => setActiveView('fno')}
          />
          <SidebarItem 
            icon={Database} 
            label="On-Chain Verification" 
            active={activeView === 'onchain'} 
            onClick={() => setActiveView('onchain')}
          />
          <SidebarItem 
            icon={Radio} 
            label="Broadcast History" 
            active={activeView === 'broadcast'} 
            onClick={() => setActiveView('broadcast')}
          />
        </nav>

        <div className="p-4 border-t border-neutral-200">
          <SidebarItem 
            icon={Settings} 
            label="Settings" 
            active={activeView === 'settings'} 
            onClick={() => setActiveView('settings')}
          />
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-white relative">
        <TopNav 
          phase={phase} 
          isReplaying={isReplaying} 
          onReplay={trigger} 
          onCancel={cancelReplay}
          onSimulate={runSimulation}
          source={source} 
        />
        
        <div className="flex-1 flex min-h-0 relative">
          {/* Dashboard View */}
          <div className={cn("flex-1 flex min-h-0 w-full", activeView !== 'dashboard' && "hidden")}>
            {/* Middle: Map + Event Log */}
            <div className="flex-1 flex flex-col min-w-0 border-r border-neutral-200">
              <div className="flex-1 relative bg-neutral-50">
                 <div className="absolute top-6 left-6 z-10 bg-white border border-neutral-900 px-3 py-1.5 flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      phase === 'ALERT' ? 'bg-red-500 animate-pulse' : 
                      phase === 'OUTCOME' ? 'bg-red-500' :
                      phase === 'ANOMALY' ? 'bg-amber-500' : 'bg-emerald-500'
                    )} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-900">
                      {phase === 'IDLE' || phase === 'SAFE' ? `Safe: ${payload.prediction.location}` : `Active Event: ${payload.prediction.location}`}
                    </span>
                 </div>
                 <SpatialMap 
                    floodPolygonVisible={floodPolygonVisible} 
                    boundingBox={payload.spatial_data.bounding_box}
                    simulationResult={simResult}
                 />
              </div>
              <EventLog phase={phase} />
            </div>

            {/* Right: Info Panels */}
            <aside className="w-[380px] flex flex-col overflow-y-auto bg-white shrink-0 scrollbar-hide">
              <FnoMetricsPanel 
                phase={phase} 
                metricsAnimating={metricsAnimating}
                confidenceAnimating={confidenceAnimating}
                damPulse={damPulse}
                metrics={activeMetrics!}
                onSimulate={runSimulation}
                simLoading={simLoading}
                simError={simError}
                simSource={simSource}
              />
              <BengaliAlertPanel 
                phase={phase} 
                bengaliAlertVisible={bengaliAlertVisible}
                audioPulse={audioPulse}
              />
              <BlockchainPanel 
                phase={phase} 
                hashTypewriting={hashTypewriting}
                verifiedVisible={verifiedVisible}
                simulationResult={simResult}
              />
              
              <div className="p-8 border-t border-neutral-200">
                <div className="bg-neutral-50 p-4 border border-neutral-100">
                  <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-2">Protocol Stack</div>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 grayscale opacity-40">
                     <span className="text-[10px] font-bold">SP1</span>
                     <span className="text-[10px] font-bold">JAX</span>
                     <span className="text-[10px] font-bold">POLYGON</span>
                     <span className="text-[10px] font-bold">GEMINI</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* Other Views */}
          {activeView === 'fno' && <FnoView />}
          {activeView === 'onchain' && <OnChainView />}
          {activeView === 'broadcast' && <BroadcastView />}
          {activeView === 'settings' && <SettingsView />}
        </div>
      </main>
    </div>
  );
}
