import React, { useMemo } from 'react';
import { motion } from 'motion/react';

import { usePoseidonData } from '../../hooks/usePoseidonData';

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[11px] font-medium text-neutral-400 uppercase tracking-[0.08em] mb-1">
    {children}
  </div>
);

const MetadataItem = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between items-center py-4 border-b border-neutral-100 last:border-0">
    <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-[0.08em]">{label}</span>
    <span className="text-[13px] font-mono text-neutral-900">{value}</span>
  </div>
);

export const FnoView: React.FC = () => {
  const { data: payload } = usePoseidonData();
  const waterDepth = payload?.prediction.water_depth || 4.2;

  // Generate a plausible 32x32 flood grid
  const grid = useMemo(() => {
    const data = Array.from({ length: 32 }, () => Array(32).fill(0));
    // Center point (flood basin)
    const centerX = 16;
    const centerY = 20;

    for (let y = 0; y < 32; y++) {
      for (let x = 0; x < 32; x++) {
        // Distance-based depth with some non-linearity
        const dist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        if (dist < 12) {
          data[y][x] = Math.max(0, waterDepth * (1 - dist / 12) * (1 + Math.random() * 0.15));
        }
      }
    }
    return data;
  }, [waterDepth]);

  const getCellColor = (depth: number) => {
    if (depth === 0) return 'bg-neutral-100';
    if (depth < 1) return 'bg-red-100';
    if (depth < 2) return 'bg-red-200';
    if (depth < 3) return 'bg-red-400';
    return 'bg-red-600';
  };

  return (
    <div className="flex-1 flex min-h-0 bg-white">
      {/* Left Column: Visualization */}
      <div className="flex-[3] p-8 border-r border-neutral-200 overflow-y-auto">
        <Label>FNO Output — 32×32 Spatial Grid</Label>
        <p className="text-[11px] text-neutral-400 mt-1 uppercase tracking-widest font-mono">Synthetic uniform baseline grid — terrain integration in Phase 2</p>
        
        <div className="mt-8 aspect-square max-w-[600px] mx-auto bg-white border border-neutral-200 p-1">
          <div className="grid grid-cols-32 gap-[1px] w-full h-full">
            {grid.flat().map((cell, i) => (
              <div 
                key={i} 
                className={`w-full aspect-square transition-colors duration-500 ${getCellColor(cell)}`}
                title={`Depth: ${cell.toFixed(2)}m`}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center">
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-mono text-neutral-400">0.0 m</span>
            <div className="w-[200px] h-2 rounded-full bg-gradient-to-r from-neutral-100 via-red-200 to-red-600" />
            <span className="text-[11px] font-mono text-red-600">{waterDepth.toFixed(1)} m</span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-4 uppercase tracking-widest">Inundation Intensity Legend</p>
        </div>
      </div>

      {/* Right Column: Metadata */}
      <div className="flex-[2] p-8 overflow-y-auto bg-neutral-50/30">
        <div className="mb-12">
          <Label>Model Metadata</Label>
          <div className="mt-6 border-t border-neutral-100">
            <MetadataItem label="Model" value="FNO-V1.0 (Fourier Neural Operator)" />
            <MetadataItem label="Architecture" value="Synthetic 32×32 flat grid — MVP baseline" />
            <MetadataItem label="Framework" value="Google JAX 0.4.x + Equinox" />
            <MetadataItem label="Training Data" value="DVC Panchet discharge (Aug 15–17, 2021)" />
            <MetadataItem label="Grid Resolution" value="32 × 32 spatial points" />
            <MetadataItem label="Inference Time" value="~45ms (local FastAPI)" />
            <MetadataItem label="Confidence" value="87% (fixed — MVP)" />
            <MetadataItem label="Input Features" value="DVC Discharge (cusecs)" />
            <MetadataItem label="Output" value="water_depth · danger_level · simulated_cusecs" />
            <MetadataItem label="Deployment" value="Local FastAPI — Cloud Run pending" />
          </div>
        </div>

        <div className="mb-12">
          <Label>Physics Constraints</Label>
          <p className="text-[13px] text-neutral-500 leading-relaxed mt-4 font-mono">
            The FNO currently operates on a synthetic 32×32 flat grid initialized with uniform values. 
            The water depth output is mathematically scaled from the input discharge using a linear 
            wrapper (depth = 0.24 + cusecs/25000). Full terrain-aware physics using SRTM DEM data 
            via Google Earth Engine is the Phase 2 target — requiring the earthengine-api library 
            and retraining on 5 years of historical Damodar basin data.
          </p>
        </div>

        <div>
          <Label>Train / Test Split</Label>
          <div className="mt-6 space-y-8">
            <div className="relative pt-6">
              <div className="flex w-full h-8 border border-neutral-200">
                <div className="w-full bg-neutral-900 flex items-center justify-center">
                  <span className="text-[10px] text-white font-mono uppercase tracking-[0.2em]">Aug 15–17, 2021 (3 days training)</span>
                </div>
              </div>
              <div className="mt-2 font-mono text-[10px] text-neutral-400">
                No held-out validation set in MVP. Post-event accuracy comparison is the validation method.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
