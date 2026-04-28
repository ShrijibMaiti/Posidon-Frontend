import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ReplayPhase } from '../../types/poseidon';

import { useStore } from '../../store';

export const EventLog: React.FC<{ phase: ReplayPhase }> = ({ phase }) => {
  const { logs } = useStore();
  
  const dotColors = {
    inference: 'bg-green-500',
    blockchain: 'bg-blue-500',
    alert: 'bg-amber-500',
    error: 'bg-red-500',
    system: 'bg-neutral-400'
  };

  return (
    <div className="border-t border-neutral-200 bg-white">
      <div className="px-8 py-3 border-b border-neutral-100 flex items-center justify-between">
        <h3 className="text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-400">System Feed</h3>
        <span className="text-[9px] font-mono text-neutral-300">AUTO-LOG: ON</span>
      </div>
      <div className="h-[160px] overflow-y-auto px-8 py-2 font-mono text-[11px]">
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 py-1.5 border-b border-neutral-50 last:border-0"
            >
              <div className={`w-1 h-1 rounded-full shrink-0 ${dotColors[log.type]}`} />
              <span className="text-neutral-300 shrink-0">[{log.timestamp}]</span>
              <span className="text-neutral-200">—</span>
              <span className="text-neutral-500 truncate">{log.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
