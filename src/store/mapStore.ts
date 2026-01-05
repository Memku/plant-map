import { create } from 'zustand';
import type { MapState } from '../types/map.types';
import { MAP_CONFIG } from '../config/map.config';

interface MapStoreState extends MapState {
  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
  updateMapState: (state: Partial<MapState>) => void;
}

export const useMapStore = create<MapStoreState>((set) => ({
  center: MAP_CONFIG.defaultCenter,
  zoom: MAP_CONFIG.defaultZoom,

  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  updateMapState: (state) => set(state),
}));
