import React from 'react';
import { useStore } from '../store';

export const ScanlineOverlay: React.FC = () => {
  const showScanlines = useStore(state => state.showScanlines);

  if (!showScanlines) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] pointer-events-none opacity-[0.008]"
      style={{
        background: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0, 0, 0, 1) 2px,
          rgba(0, 0, 0, 1) 4px
        )`
      }}
    />
  );
};
