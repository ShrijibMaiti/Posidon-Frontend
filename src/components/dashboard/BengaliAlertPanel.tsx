import React, { useMemo, useEffect, useState, useRef } from 'react';
import { useStore } from '../../store';
import { ReplayPhase } from '../../types/poseidon';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Download } from 'lucide-react';

const useAudioPlayer = (src: string) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(src);
    audio.onended = () => setIsPlaying(false);
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [src]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(e => {
        console.warn("Audio file missing at /audio/ghatal_alert.mp3 - dummy playback active", e);
      });
      setIsPlaying(true);
    }
  };

  return { isPlaying, toggle };
};

export const BengaliAlertPanel: React.FC<{ phase: ReplayPhase }> = ({ phase }) => {
  const { audioPulse, bengaliAlertVisible, reducedMotion } = useStore();
  const { isPlaying, toggle } = useAudioPlayer('/audio/ghatal_alert.mp3');
  const isVisible = bengaliAlertVisible || phase === 'ALERT' || phase === 'OUTCOME';
  const rafRef = useRef<number | null>(null);
  const [frame, setFrame] = useState(0);

  // Seeded random heights for waveform bars
  const bars = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => ({
      baseHeight: 4 + Math.abs(Math.sin(i * 1.5)) * 16,
      id: i
    }));
  }, []);

  useEffect(() => {
    if (isPlaying && !reducedMotion) {
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
  }, [isPlaying, reducedMotion]);

  return (
    <div className={`p-8 border-t border-neutral-200 bg-white transition-colors duration-500 ${isVisible ? 'border-amber-400 bg-amber-50/10' : ''}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[13px] font-bold uppercase tracking-widest text-neutral-900">Multimodal Alert</h3>
        <div className="bg-neutral-900 text-white px-2 py-0.5 text-[10px] font-medium tracking-widest">
          বাংলা
        </div>
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <p className="text-[15px] text-neutral-900 font-normal leading-relaxed">
                ঘাটালে বন্যার আশঙ্কা। সকাল ৮টার মধ্যে জলস্তর বিপদসীমা ছাড়াবে। এখনই উঁচু জমিতে চলুন।
              </p>
              <p className="text-[12px] text-neutral-400 italic font-medium leading-relaxed">
                "Flood alert in Ghatal. Water level will cross danger mark by 8 AM. Move to higher ground."
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-6">
                <motion.button 
                  animate={audioPulse ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.2 }}
                  onClick={() => toggle()}
                  className="flex items-center gap-2 px-4 py-2 border border-neutral-900 text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-neutral-900 hover:text-white transition-all rounded-none"
                >
                  {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                  {isPlaying ? "Pause Audio" : "Play Alert"}
                </motion.button>

                <div className="flex items-end gap-[2px] h-6 flex-1 px-2 border-l border-neutral-100">
                  {bars.map((bar, i) => {
                    const oscillatingHeight = (isPlaying && !reducedMotion) 
                      ? 4 + Math.abs(Math.sin(frame / 10 + i * 0.4)) * 16 
                      : bar.baseHeight;
                    
                    return (
                      <div
                        key={bar.id}
                        className={`w-[3px] transition-colors duration-300 ${(isPlaying && !reducedMotion) ? 'bg-green-600' : 'bg-neutral-200'}`}
                        style={{ height: `${oscillatingHeight}px` }}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-4">
                 <button className="text-[10px] font-mono text-neutral-400 hover:text-neutral-900 transition-colors uppercase flex items-center gap-1">
                   <Download size={12} />
                   Download .mp3
                 </button>
                 <span className="text-neutral-200">|</span>
                 <div className="text-[9px] text-neutral-400 uppercase tracking-widest">
                   TTS: Google Neural2-BN
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!isVisible && (
        <div className="h-[120px] flex items-center justify-center border border-dashed border-neutral-200 text-[11px] text-neutral-300 font-medium uppercase tracking-widest">
          Awaiting Simulation Trigger
        </div>
      )}
    </div>
  );
};
