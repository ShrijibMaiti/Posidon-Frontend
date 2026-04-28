export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? '';

export const POLYGONSCAN_ADDRESS_URL = CONTRACT_ADDRESS
  ? `https://amoy.polygonscan.com/address/${CONTRACT_ADDRESS}`
  : null;

export const getPolygonScanTxUrl = (txHash: string): string =>
  `https://amoy.polygonscan.com/tx/${txHash}`;

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development' && CONTRACT_ADDRESS === '0x5FbDB2315678afecb367f032d93F642f64180aa3') {
  console.warn(
    '[Poseidon] CONTRACT_ADDRESS is set to local Hardhat default. ' +
    'Replace with Polygon Amoy deployment address before demo.'
  );
}
