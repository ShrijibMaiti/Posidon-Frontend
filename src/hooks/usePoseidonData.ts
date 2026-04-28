import { useState, useEffect } from 'react';
import type { PoseidonPayload } from '../lib/types/poseidon';
import { MOCK_PAYLOAD } from '../lib/mockPayload';

// Using import.meta.env for Vite environment variables
const API_URL = process.env.NEXT_PUBLIC_FNO_API_URL;

export function usePoseidonData(): {
  data: PoseidonPayload | null;
  loading: boolean;
  error: string | null;
  source: 'mock' | 'live';
} {
  const [data, setData] = useState<PoseidonPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'mock' | 'live'>('mock');

  useEffect(() => {
    if (!API_URL) {
      // No live API configured — use mock immediately, no loading delay
      setData(MOCK_PAYLOAD);
      setSource('mock');
      setLoading(false);
      return;
    }

    // Live API available — fetch it
    fetch(API_URL)
      .then(res => {
        if (!res.ok) throw new Error(`API returned ${res.status}`);
        return res.json();
      })
      .then((payload: PoseidonPayload | PoseidonPayload[]) => {
        // Handle both single object and array responses (Person A delivered [ {...} ])
        const actualData = Array.isArray(payload) ? payload[0] : payload;
        setData(actualData);
        setSource('live');
        setLoading(false);
      })
      .catch(err => {
        console.warn('Live API failed, falling back to mock:', err);
        setData(MOCK_PAYLOAD);
        setSource('mock');
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { data, loading, error, source };
}
