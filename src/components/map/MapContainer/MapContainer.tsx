import React, { useState, useMemo } from 'react';
import { MapContainer as LeafletMapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import { MAP_CONFIG } from '../../../config/map.config';
import type { Plant } from '../../../types/plant.types';
import { ClusteredMarker } from '../ClusteredMarker';
import { clusterPlants } from '../../../utils/clustering';
import 'leaflet/dist/leaflet.css';
import './MapContainer.css';

interface MapContainerProps {
  plants: Plant[];
  center?: LatLngExpression;
  zoom?: number;
}

// Component to track map zoom level
const MapEventHandler: React.FC<{ onZoomChange: (zoom: number) => void }> = ({
  onZoomChange,
}) => {
  const map = useMapEvents({
    zoomend: () => {
      onZoomChange(map.getZoom());
    },
  });
  return null;
};

export const MapContainer: React.FC<MapContainerProps> = ({
  plants,
  center = MAP_CONFIG.defaultCenter,
  zoom = MAP_CONFIG.defaultZoom,
}) => {
  const [currentZoom, setCurrentZoom] = useState(zoom);

  // Cluster plants based on current zoom level
  const clusters = useMemo(() => {
    return clusterPlants(plants, currentZoom);
  }, [plants, currentZoom]);

  return (
    <div className="map-wrapper">
      <LeafletMapContainer
        center={center}
        zoom={zoom}
        className="map-container"
        scrollWheelZoom={true}
      >
        <TileLayer
          url={MAP_CONFIG.tileLayer.url}
          attribution={MAP_CONFIG.tileLayer.attribution}
          maxZoom={MAP_CONFIG.tileLayer.maxZoom}
        />
        <MapEventHandler onZoomChange={setCurrentZoom} />
        {clusters.map((cluster) => (
          <ClusteredMarker key={cluster.id} cluster={cluster} />
        ))}
      </LeafletMapContainer>
    </div>
  );
};
