import { LatLngBounds } from 'leaflet';

export interface MapState {
  center: [number, number];
  zoom: number;
  bounds?: LatLngBounds;
}

export interface MarkerPosition {
  lat: number;
  lng: number;
}

export type MapMode = 'view' | 'add-plant' | 'select-location';
