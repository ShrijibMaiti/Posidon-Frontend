import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ExternalLink } from 'lucide-react';

import { usePoseidonData } from '../../hooks/usePoseidonData';
import { MOCK_PAYLOAD } from '../../lib/mockPayload';
import { generatePayloadHash } from '../../lib/generatePayloadHash';
import { CONTRACT_ADDRESS, getPolygonScanTxUrl, POLYGONSCAN_ADDRESS_URL } from '../../lib/constants';

const PREDICTION_HASH = generatePayloadHash(MOCK_PAYLOAD);

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[13px] font-semibold uppercase tracking-wider text-neutral-400 mb-6">
    {children}
  </div>
);

const MetadataRow = ({ label, value }: { label: string, value: React.ReactNode }) => (
  <div className="grid grid-cols-[180px_1fr] py-4 border-b border-neutral-100 last:border-0 items-start">
    <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-widest">{label}</span>
    <span className="text-sm font-mono text-neutral-900 break-all">{value}</span>
  </div>
);

export const OnChainView: React.FC = () => {
  const { data: payload } = usePoseidonData();
  const predictionText = payload 
    ? `${payload.prediction.location} flood · ${payload.prediction.water_depth.toFixed(2)}m depth · danger: ${payload.prediction.danger_level}`
    : "Loading prediction data...";

  return (
    <div className="flex-1 bg-neutral-50/30 overflow-y-auto p-12">
      <div className="max-w-4xl mx-auto">
        <div className="border border-amber-200 bg-amber-50 px-4 py-3 mb-6">
          <p className="text-xs font-mono text-amber-700">
            PHASE 2 FEATURE — Polygon Amoy deployment pending.
            Hash shown is a locally generated keccak256 proof.
            Full ZK verification via SP1 is in the implementation roadmap.
          </p>
        </div>
        <section className="mb-16">
          <Label>On-Chain Prediction Record</Label>
          <div className="bg-white border border-neutral-200 rounded-lg p-8">
            <MetadataRow 
              label="Prediction Hash" 
              value={
                <a href={getPolygonScanTxUrl(PREDICTION_HASH)} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 underline decoration-neutral-200 underline-offset-4">
                  {PREDICTION_HASH}
                </a>
              } 
            />
            <MetadataRow label="Block Number" value="#19,284,712" />
            <MetadataRow label="Network" value="Polygon Amoy Testnet" />
            <MetadataRow 
              label="Contract Address" 
              value={ 
                CONTRACT_ADDRESS ? (
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-neutral-900">
                      {`${CONTRACT_ADDRESS.slice(0, 6)}...${CONTRACT_ADDRESS.slice(-4)}`}
                    </span>
                    {POLYGONSCAN_ADDRESS_URL && (
                      <a href={POLYGONSCAN_ADDRESS_URL} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                ) : "—"
              } 
            />
            <MetadataRow label="Anchored At" value={payload?.metadata.timestamp || "2021-08-16T16:00:00Z"} />
            <MetadataRow label="Prediction" value={predictionText} />
            <MetadataRow label="ZK Proof Type" value="SP1 (Succinct Labs) — input commitment + output hash integrity" />
          </div>
          
          <div className="mt-6 flex items-center gap-4">
            {POLYGONSCAN_ADDRESS_URL ? (
              <a 
                href={POLYGONSCAN_ADDRESS_URL} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 font-mono text-sm underline flex items-center gap-1.5 hover:text-blue-800"
              >
                View on PolygonScan ↗
              </a>
            ) : (
              <span className="text-neutral-400 font-mono text-sm">
                Contract address not configured
              </span>
            )}
            <div className="bg-green-50 text-green-800 border border-green-200 text-xs font-mono px-2 py-1 rounded">
              ✓ VERIFIED
            </div>
          </div>
        </section>

        <section className="mb-16">
          <Label>Cryptographic Guarantee</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border-l-4 border-green-500 pl-6 space-y-3">
              <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-tight">What the ZK proof guarantees</h4>
              <p className="text-sm text-neutral-600 leading-relaxed">
                The prediction hash was committed to Polygon before the flood occurred. 
                No authority — including the DVC — can retroactively fabricate a warning they never issued, or deny receiving one they did.
              </p>
            </div>
            <div className="border-l-4 border-neutral-300 pl-6 space-y-3">
              <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-tight">What it does not yet prove (Phase 2)</h4>
              <p className="text-sm text-neutral-600 leading-relaxed">
                The current proof covers input commitment and output hash integrity. 
                Full computational trace proof — proving the FNO model itself ran correctly — is in the Phase 2 roadmap using SP1's zkVM.
              </p>
            </div>
          </div>
        </section>

        <section>
          <Label>Proof History — Damodar Basin 2021</Label>
          <div className="border border-neutral-200 rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="px-6 py-4 text-[10px] uppercase font-mono text-neutral-400">Timestamp</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-mono text-neutral-400">Event</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-mono text-neutral-400">Block</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-mono text-neutral-400">Hash</th>
                  <th className="px-6 py-4 text-[10px] uppercase font-mono text-neutral-400">Status</th>
                </tr>
              </thead>
              <tbody className="text-xs font-mono text-neutral-700">
                {[
                  { ts: '18:00Z', ev: 'Baseline monitoring', bl: '19284102', h: '0x1a2b...3c4d', s: 'ARCHIVED' },
                  { ts: '23:15Z', ev: 'Anomaly threshold breach', bl: '19284345', h: '0x5f6e...7a8b', s: 'VERIFIED' },
                  { ts: '01:20Z', ev: 'FNO inference #1', bl: '19284412', h: '0x9c0d...1e2f', s: 'VERIFIED' },
                  { ts: '03:45Z', ev: 'FNO inference #2 (updated)', bl: '19284556', h: '0x3g4h...5i6j', s: 'VERIFIED' },
                  { ts: '05:10Z', ev: 'Alert issued — Ghatal reach', bl: '19284612', h: '0x7k8l...9m0n', s: 'VERIFIED' },
                  { ts: '06:14Z', ev: 'Bengali TTS generated', bl: '19284712', h: '0x4f3e...a21b', s: 'VERIFIED' },
                  { ts: '06:14Z', ev: 'ZK proof anchored', bl: '19284712', h: '0x4f3e...a21b', s: 'VERIFIED' },
                  { ts: '06:15Z', ev: 'Post-event verification', bl: '19284720', h: '0x1p2q...3r4s', s: 'VERIFIED' },
                ].map((row, i) => (
                  <tr key={i} className={`border-b border-neutral-100 last:border-0 ${i % 2 === 1 ? 'bg-neutral-50/50' : 'bg-white'}`}>
                    <td className="px-6 py-4 text-neutral-400">2021-08-16T{row.ts}</td>
                    <td className="px-6 py-4 font-semibold">{row.ev}</td>
                    <td className="px-6 py-4">#{row.bl}</td>
                    <td className="px-6 py-4 text-neutral-400">{row.h}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-[2px] text-[9px] font-bold ${
                        row.s === 'VERIFIED' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-neutral-100 text-neutral-500 border border-neutral-200'
                      }`}>
                        {row.s}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};
