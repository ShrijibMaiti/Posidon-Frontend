import { ethers } from 'ethers';
import type { SimulationResponse, PoseidonPayload } from './types/poseidon';

/**
 * Deterministically generates a Keccak-256 hash of the Simulation response or payload.
 * Useful for on-chain integrity verification.
 */
export function generatePayloadHash(data: SimulationResponse | PoseidonPayload): string {
  let hashable: any;
  
  if ('simulated_cusecs' in data) {
    // It's a SimulationResponse
    hashable = {
      simulated_cusecs: data.simulated_cusecs,
      water_depth: data.water_depth,
      danger_level: data.danger_level,
    };
  } else {
    // It's a PoseidonPayload (fallback/replay)
    hashable = {
      water_depth: data.prediction.water_depth,
      danger_level: data.prediction.danger_level,
      location: data.prediction.location,
    };
  }

  const serialized = JSON.stringify(hashable, Object.keys(hashable).sort());
  const bytes = ethers.toUtf8Bytes(serialized);
  return ethers.keccak256(bytes);
}

export function generateSimulationHash(response: SimulationResponse): string {
  const hashable = {
    simulated_cusecs: response.simulated_cusecs,
    water_depth: response.water_depth,
    danger_level: response.danger_level,
  };
  const serialized = JSON.stringify(hashable, Object.keys(hashable).sort());
  const bytes = ethers.toUtf8Bytes(serialized);
  return ethers.keccak256(bytes);
}
