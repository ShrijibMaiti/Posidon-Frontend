import React, { useMemo } from 'react';
import DeckGL from '@deck.gl/react';
import { PathLayer, ScatterplotLayer, GeoJsonLayer } from '@deck.gl/layers';
import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useStore } from '../store';
import { SimulationResponse } from '../lib/types/poseidon';

// Mock GeoJSON for development when URL is unreachable
const GHATAL_FLOOD_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { depth: 4.2 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [87.71, 22.66],
          [87.73, 22.66],
          [87.73, 22.68],
          [87.71, 22.68],
          [87.71, 22.66]
        ]]
      }
    }
  ]
};

const RIVER_PATH = [
  { path: [[87.65, 22.60], [87.70, 22.65], [87.75, 22.70], [87.80, 22.75]] }
];

const POINTS_OF_INTEREST = [
  { name: 'Ghatal', coordinates: [87.72, 22.67], type: 'TOWN', color: [226, 75, 74] },
  { name: 'Panchet Dam', coordinates: [86.75, 23.68], type: 'DAM', color: [249, 115, 22] },
  { name: 'Maithon Dam', coordinates: [86.80, 23.78], type: 'DAM', color: [249, 115, 22] },
];

const INITIAL_VIEW_STATE = {
  longitude: 87.72,
  latitude: 22.67,
  zoom: 11,
  pitch: 45,
  bearing: 0
};

export default function SpatialMap({ 
  floodPolygonVisible, 
  boundingBox,
  simulationResult
}: { 
  floodPolygonVisible: boolean, 
  boundingBox?: number[],
  simulationResult: SimulationResponse | null
}) {
  const { currentStep, replayPhase, payload, reducedMotion } = useStore();

  // Task 6: Logic for dynamic map center
  const viewState = useMemo(() => {
    if (boundingBox && boundingBox.length === 4) {
      const centerLat = (boundingBox[0] + boundingBox[2]) / 2;
      const centerLon = (boundingBox[1] + boundingBox[3]) / 2;
      return {
        longitude: centerLon,
        latitude: centerLat,
        zoom: 11,
        pitch: 45,
        bearing: 0
      };
    }
    return INITIAL_VIEW_STATE;
  }, [boundingBox]);

  const layers = useMemo(() => {
    const isAlertOrOutcome = replayPhase === 'ALERT' || replayPhase === 'OUTCOME';
    
    // Task 5: Dynamic visibility and opacity
    const showFloodPolygon = isAlertOrOutcome || floodPolygonVisible
      || (simulationResult?.danger_level === 'CRITICAL')
      || (simulationResult?.danger_level === 'WARNING');

    const polygonOpacity = simulationResult?.danger_level === 'CRITICAL'
      ? 180  // full red
      : simulationResult?.danger_level === 'WARNING'
      ? 100  // partial amber
      : isAlertOrOutcome
      ? 180
      : 0;

    const isAnomalous = replayPhase !== 'IDLE' && replayPhase !== 'SAFE' || !!simulationResult;

    return [
      // Damodar River Path
      new PathLayer({
        id: 'river-path',
        data: RIVER_PATH,
        getPath: (d: any) => d.path,
        getColor: [163, 163, 163], 
        getWidth: 100,
        widthMinPixels: 2,
        pickable: true
      }),

      // Towns and Dams
      new ScatterplotLayer({
        id: 'poi',
        data: POINTS_OF_INTEREST,
        getPosition: (d: any) => d.coordinates,
        getFillColor: (d: any) => d.name === 'Ghatal' ? [239, 68, 68] : [31, 41, 55],
        getLineColor: [255, 255, 255],
        getLineWidth: 2,
        stroked: true,
        getRadius: (d: any) => {
          if (d.type === 'DAM') return isAnomalous ? 1200 : 400;
          return 800;
        },
        radiusMinPixels: 4,
        pickable: true,
        transitions: {
          getRadius: {
            duration: reducedMotion ? 1 : 600,
            easing: (t: number) => t * (2 - t)
          }
        }
      }),

      // Flood Extent GeoJson - Predicted (Solid Red or Amber)
      new GeoJsonLayer({
        id: 'flood-extent-predicted',
        data: GHATAL_FLOOD_GEOJSON as any, 
        visible: showFloodPolygon,
        extruded: false,
        getFillColor: simulationResult?.danger_level === 'WARNING' ? [245, 158, 11, polygonOpacity] : [239, 68, 68, polygonOpacity],
        stroked: false,
        opacity: showFloodPolygon ? 0.7 : 0,
        pickable: true,
        updateTriggers: {
          getFillColor: [simulationResult?.danger_level, polygonOpacity],
          visible: [showFloodPolygon]
        }
      }),

      // Flood Extent GeoJson - Actual Outcome (Technical Blueprint Outline)
      new GeoJsonLayer({
        id: 'flood-extent-actual',
        data: GHATAL_FLOOD_GEOJSON as any,
        visible: replayPhase === 'OUTCOME',
        filled: false,
        stroked: true,
        getLineColor: [17, 24, 39, 255], 
        getLineWidth: 60,
        lineWidthUnits: 'meters',
        lineDashJustified: true,
        getLineDashArray: [10, 10], 
        opacity: 1,
        pickable: true
      })
    ];
  }, [replayPhase, floodPolygonVisible, reducedMotion, simulationResult]);

  return (
    <div className="w-full h-full grayscale-[0.5] relative">
      {/* Legend Overlay */}
      <div className="absolute bottom-6 left-6 z-10 bg-white border border-neutral-200 p-3 space-y-2">
        <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Live Simulation Extent</div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500" />
          <span className="text-[10px] font-mono text-neutral-600">Predicted Inundation</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-dashed border-neutral-900" />
          <span className="text-[10px] font-mono text-neutral-600">Model Verification</span>
        </div>
      </div>
      <DeckGL
        initialViewState={viewState as any}
        controller={true}
        layers={layers}
      >
        <Map
          mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
          reuseMaps
        />
      </DeckGL>
    </div>
  );
}
