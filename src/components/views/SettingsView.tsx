import React from 'react';
import { useStore } from '../../store';

const SettingGroup = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="bg-white border border-neutral-200 rounded-lg p-8 mb-6">
    <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-neutral-400 mb-6">{title}</h3>
    <div className="space-y-1">
      {children}
    </div>
  </div>
);

const SettingRow = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="flex justify-between items-center py-4 border-b border-neutral-100 last:border-0 grow">
    <span className="text-[13px] font-medium text-neutral-600">{label}</span>
    <div className="flex items-center gap-4">
      {children}
    </div>
  </div>
);

export const SettingsView: React.FC = () => {
  const { 
    replaySpeed, setReplaySpeed, 
    showScanlines, setShowScanlines, 
    reducedMotion, setReducedMotion,
    autoReplayOnLoad, setAutoReplayOnLoad
  } = useStore();

  return (
    <div className="flex-1 bg-neutral-50/10 overflow-y-auto p-12">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12">
        <div className="flex-1">
          <SettingGroup title="Simulation">
            <SettingRow label="Demo Dataset">
              <select disabled className="border border-neutral-200 rounded px-3 py-1.5 text-xs font-mono bg-neutral-50 text-neutral-400 cursor-not-allowed outline-none">
                <option>August 16–17, 2021 — Ghatal (Damodar)</option>
              </select>
            </SettingRow>
            
            <SettingRow label="Replay Speed">
              <div className="flex gap-2">
                {[0.5, 1, 2].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setReplaySpeed(speed)}
                    className={`px-3 py-1 text-[11px] font-mono font-bold border transition-all ${
                      replaySpeed === speed 
                        ? 'bg-neutral-900 text-white border-neutral-900' 
                        : 'bg-white text-neutral-400 border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    {speed}×
                  </button>
                ))}
              </div>
            </SettingRow>

            <SettingRow label="Auto-replay on load">
              <div className="flex flex-col items-end gap-1">
                <button 
                  onClick={() => setAutoReplayOnLoad(!autoReplayOnLoad)}
                  className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${autoReplayOnLoad ? 'bg-neutral-900' : 'bg-neutral-200'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-200 ${autoReplayOnLoad ? 'left-6' : 'left-1'}`} />
                </button>
                <span className="text-neutral-400 text-[10px] italic">Replay sequence fires automatically 1.5s after dashboard loads.</span>
              </div>
            </SettingRow>
          </SettingGroup>

          <SettingGroup title="System">
            <SettingRow label="Blockchain Network">
              <span className="text-[13px] font-mono text-neutral-400">Polygon Amoy Testnet</span>
            </SettingRow>
            <SettingRow label="FNO Model Version">
              <span className="text-[13px] font-mono text-neutral-400">FNO-V1.0</span>
            </SettingRow>
            <SettingRow label="TTS Voice">
              <span className="text-[13px] font-mono text-neutral-400">Google Neural2 Bengali</span>
            </SettingRow>
          </SettingGroup>

          <SettingGroup title="Display">
            <SettingRow label="Scanline overlay">
               <button 
                onClick={() => setShowScanlines(!showScanlines)}
                className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${showScanlines ? 'bg-neutral-900' : 'bg-neutral-200'}`}
               >
                 <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-200 ${showScanlines ? 'left-6' : 'left-1'}`} />
               </button>
            </SettingRow>
            
            <SettingRow label="Reduced motion">
               <button 
                onClick={() => setReducedMotion(!reducedMotion)}
                className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${reducedMotion ? 'bg-neutral-900' : 'bg-neutral-200'}`}
               >
                 <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-200 ${reducedMotion ? 'left-6' : 'left-1'}`} />
               </button>
            </SettingRow>
          </SettingGroup>
        </div>

        <div className="w-[300px] hidden lg:block">
          <div className="p-8 border border-dashed border-neutral-200 rounded-lg text-center h-[400px] flex flex-col items-center justify-center">
            <div className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest leading-relaxed">
              Configuration slots reserved for future expansion phases
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
