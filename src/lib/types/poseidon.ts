/**
 * Metadata for the Poseidon model and prediction run.
 */
export interface ModelMetadata {
  /** ISO 8601 timestamp */
  timestamp: string;
  model_version: string;
  trigger_event: string;
}

/**
 * Core prediction data from the FNO model.
 */
export interface PredictionData {
  location: string;
  danger_level: 'CRITICAL' | 'WARNING' | 'SAFE';
  water_depth: number;
}

/**
 * Spatial grid and extent information.
 */
export interface SpatialData {
  grid_resolution: string;
  /** [minLon, minLat, maxLon, maxLat] or similar coordinate tuple */
  bounding_box: number[];
}

/**
 * Root payload delivered by the ML FNO API.
 */
export interface PoseidonPayload {
  metadata: ModelMetadata;
  prediction: PredictionData;
  spatial_data: SpatialData;
}

export interface SimulationRequest {
  discharge_cusecs: number;
}

export interface SimulationResponse {
  status: string;
  simulated_cusecs: number;
  water_depth: number; // field name is water_depth — NOT water_depth_meters
  danger_level: 'SAFE' | 'WARNING' | 'CRITICAL'; // SAFE exists — MONITORING does not
}
