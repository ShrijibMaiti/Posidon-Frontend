import React, { useState, useEffect } from 'react';
import { useStore } from '../../store';
import { ReplayPhase } from '../../types/poseidon';
import { SimulationResponse } from '../../lib/types/poseidon';
import { ShieldCheck, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_PAYLOAD } from '../../lib/mockPayload';
import { generatePayloadHash, generateSimulationHash } from '../../lib/generatePayloadHash';
import { CONTRACT_ADDRESS, getPolygonScanTxUrl, POLYGONSCAN_ADDRESS_URL } from '../../lib/constants';

const useTypewriter = (text: string, active: boolean, speed: number = 25) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!active) {
      setDisplayedText("");
      return;
    }

    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, speed);

    return () => clearInterval(interval);
  }, [text, active, speed]);

  return displayedText;
};

export const BlockchainPanel: React.FC<{ 
  phase: ReplayPhase;
  hashTypewriting: boolean;
  verifiedVisible: boolean;
  simulationResult: SimulationResponse | null;
}> = ({ phase, hashTypewriting, verifiedVisible, simulationResult }) => {
  const { payload } = useStore();
  const record = payload.chainRecord;
  const isPostVerification = phase === 'OUTCOME' || verifiedVisible;

  const currentHash = simulationResult 
    ? generateSimulationHash(simulationResult)
    : generatePayloadHash(MOCK_PAYLOAD);

  const hash = useTypewriter(currentHash, hashTypewriting || phase === 'OUTCOME', 25);
  const block = useTypewriter(record.blockNumber.toString(), hashTypewriting || phase === 'OUTCOME', 30);

  return (
    <div className="p-8 border-t border-neutral-200 bg-white">
       <div className="flex justify-between items-center mb-8">
        <h3 className="text-[13px] font-bold uppercase tracking-widest text-neutral-900 flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-600" />
          Chain Verification
        </h3>
        <AnimatePresence>
          {isPostVerification && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-mono px-2 py-0.5"
            >
              PHASE 2
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-6">
        <div>
          <div className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest mb-1">Prediction Anchor Hash</div>
          <div className="text-[11px] font-mono break-all bg-neutral-50 border border-neutral-100 p-2 text-neutral-600 min-h-[44px]">
            {hash ? (
              <span className="cursor-not-allowed">
                {hash}
              </span>
            ) : "—"}
          </div>
          <p className="text-xs font-mono text-neutral-400 mt-2">
            Local proof hash — Polygon Amoy deployment pending
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest mb-1">Block Number</div>
            <div className="text-[13px] font-mono text-neutral-900 bg-neutral-50 border border-neutral-100 px-2 py-1">
              {block ? `#${block}` : "—"}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest mb-1">Contract</div>
            <div className="text-[13px] font-mono text-neutral-900 bg-neutral-50 border border-neutral-100 px-2 py-1 flex items-center justify-between">
              <span>
                {CONTRACT_ADDRESS
                  ? `${CONTRACT_ADDRESS.slice(0, 6)}...${CONTRACT_ADDRESS.slice(-4)}`
                  : '—'
                }
              </span>
              {POLYGONSCAN_ADDRESS_URL && (
                <span className="text-neutral-300 cursor-not-allowed" title="On-chain verification pending">
                  <ArrowUpRight size={12} />
                </span>
              )}
            </div>
          </div>
        </div>

        <span
          className="text-neutral-300 font-mono text-sm cursor-not-allowed w-full py-2 border border-neutral-200 flex items-center justify-center gap-2 rounded-none mt-4"
          title="On-chain verification — Phase 2 roadmap"
        >
          View on PolygonScan ↗
        </span>
      </div>
    </div>
  );
};
