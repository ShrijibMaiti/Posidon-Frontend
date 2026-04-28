import React, { useMemo, useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Radio, Play, Pause, CheckCircle } from 'lucide-react';
import { useStore } from '../../store';
import { usePoseidonData } from '../../hooks/usePoseidonData';

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[13px] font-semibold uppercase tracking-wider text-neutral-400 mb-6">
    {children}
  </div>
);

const MetadataItem = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between items-center py-3 border-b border-neutral-100 last:border-0 grow">
    <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest">{label}</span>
    <span className="text-sm font-mono text-neutral-900">{value}</span>
  </div>
);

export const BroadcastView: React.FC = () => {
  const { alertPlaying, setAlertPlaying, reducedMotion } = useStore();
  const { data: payload } = usePoseidonData();
  const rafRef = useRef<number | null>(null);
  const [frame, setFrame] = useState(0);

  const stats = [
    { label: 'Alerts Issued', value: '1' },
    { label: 'Audio Files', value: '1' },
    { label: 'Languages', value: '2' },
    { label: 'Advance Warning', value: '14h' }
  ];

  // Seeded random heights for waveform bars (same as BengaliAlertPanel)
  const barData = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => ({
      baseHeight: 4 + Math.abs(Math.sin(i * 1.5)) * 16,
      id: i
    }));
  }, []);

  useEffect(() => {
    if (alertPlaying && !reducedMotion) {
      const animate = () => {
        setFrame(prev => prev + 1);
        rafRef.current = requestAnimationFrame(animate);
      };
      rafRef.current = requestAnimationFrame(animate);
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [alertPlaying, reducedMotion]);

  return (
    <div className="flex-1 bg-neutral-50/30 overflow-y-auto p-12">
      <div className="max-w-4xl mx-auto">
        {/* Section 1: Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white border border-neutral-200 rounded-lg p-6">
              <div className="text-[36px] font-[800] text-neutral-900 mb-1">{stat.value}</div>
              <div className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Section 2: Broadcast Record */}
        <section className="mb-16">
          <Label>Broadcast Record</Label>
          <div className="bg-white border border-neutral-200 rounded-lg p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-bold text-neutral-900 tracking-tight">BROADCAST #001</h3>
              <div className="bg-green-50 text-green-800 border border-green-200 text-[10px] font-mono font-bold px-2 py-0.5">
                DELIVERED
              </div>
            </div>

            <div className="space-y-1 mb-10">
              <MetadataItem label="Issued At" value={payload?.metadata.timestamp || "2021-08-16T16:00:00Z"} />
              <MetadataItem label="Event" value={`${payload?.prediction.location} Inundation — FNO Alert`} />
              <MetadataItem label="Reach" value={`${payload?.prediction.location} and surrounding sub-divisions`} />
              <MetadataItem label="Channel" value="District official loudspeaker broadcast + app notification" />
              <MetadataItem label="Audio Duration" value="2.3 seconds" />
              <MetadataItem label="TTS Engine" value="Google Cloud Text-to-Speech (Neural2 Bengali voice)" />
              <MetadataItem label="Gemini Model" value="Gemini 2.0 Flash" />
            </div>

            <div className="bg-neutral-50 border border-neutral-200 rounded p-6 font-sans">
              <p className="text-base text-neutral-900 leading-relaxed mb-4">
                ঘাটালে বন্যার আশঙ্কা। সকাল ৮টার মধ্যে জলস্তর বিপদসীমা ছাড়াবে। এখনই উঁচু জমিতে চলুন।
              </p>
              <p className="text-sm text-neutral-400 italic">
                 "Flood risk in Ghatal. Water level will cross danger mark by 8 AM. Move to higher ground immediately."
              </p>
            </div>

            <div className="mt-8 flex items-center gap-6">
              <button 
                onClick={() => setAlertPlaying(!alertPlaying)}
                className="px-6 py-3 border border-neutral-900 text-neutral-900 text-[11px] font-mono font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-neutral-900 hover:text-white transition-all rounded-none"
              >
                {alertPlaying ? <Pause size={14} /> : <Play size={14} />}
                {alertPlaying ? 'Pause Audio' : 'Play Alert Audio'}
              </button>

              <div className="flex items-end gap-[2px] h-8 flex-1 px-4 border-l border-neutral-100">
                {barData.map((bar, i) => {
                  const oscillatingHeight = (alertPlaying && !reducedMotion) 
                    ? 4 + Math.abs(Math.sin(frame / 10 + i * 0.4)) * 20 
                    : bar.baseHeight;
                  
                  return (
                    <div
                      key={bar.id}
                      className={`w-[4px] transition-colors duration-300 ${(alertPlaying && !reducedMotion) ? 'bg-green-600' : 'bg-neutral-200'}`}
                      style={{ height: `${oscillatingHeight}px` }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Architecture */}
        <section>
          <Label>Last-Mile Delivery Architecture</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="border-l-2 border-green-500 pl-6 space-y-3">
              <h4 className="text-sm font-bold text-neutral-900 uppercase">Primary</h4>
              <p className="text-sm text-neutral-500 leading-relaxed">
                App push notification + district loudspeaker broadcast via Next.js dashboard. Requires internet connectivity.
              </p>
            </div>
            <div className="border-l-2 border-amber-500 pl-6 space-y-3">
              <h4 className="text-sm font-bold text-neutral-900 uppercase">Fallback</h4>
              <p className="text-sm text-neutral-500 leading-relaxed">
                IVR telephone alert system for feature-phone users and no-smartphone areas. Triggered automatically if app delivery fails.
              </p>
            </div>
            <div className="border-l-2 border-neutral-400 pl-6 space-y-3">
              <h4 className="text-sm font-bold text-neutral-900 uppercase">Offline</h4>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Last 6 hours of predictions pre-cached on device. Audio alerts available without connectivity during the flood event itself.
              </p>
            </div>
          </div>
          <p className="text-[12px] text-neutral-400 italic">
            Note: The delivery infrastructure above represents the Phase 2 architecture. The current demo validates the prediction, proof, and alert generation layers. The IVR and offline cache layers are in the implementation roadmap.
          </p>
        </section>
      </div>
    </div>
  );
};
