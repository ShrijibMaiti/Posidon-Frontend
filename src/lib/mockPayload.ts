import type { PoseidonPayload } from './types/poseidon';

export const MOCK_PAYLOAD: PoseidonPayload = {
  "metadata": {
    "timestamp": "2021-08-16T16:00:00Z",
    "model_version": "fno-v1.0-32x32-optax",
    "trigger_event": "historical_replay_2021"
  },
  "prediction": {
    "location": "Ghatal, West Bengal",
    "danger_level": "SAFE",
    "water_depth": 0.84
  },
  "spatial_data": {
    "grid_resolution": "32x32",
    "bounding_box": [
      22.6,
      87.65,
      22.75,
      87.8
    ]
  }
};
