import React, { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MAP_CONFIG } from '../../../config/map.config';
import type { GeoLocation } from '../../../types/plant.types';
import { Button } from '../../common/Button/Button';
import { useGeolocation } from '../../../hooks/useGeolocation';
import 'leaflet/dist/leaflet.css';
import './LocationPicker.css';

interface LocationPickerProps {
  onLocationSelect: (location: GeoLocation) => void;
  initialPosition?: [number, number];
}

const defaultIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNMTIgMkM4LjEzIDIgNSA1LjEzIDUgOWMwIDUuMjUgNyAxMyA3IDEzcy03LTcuNzUgNy0xM2MwLTMuODctMy4xMy03LTctN3ptMCA5LjVjLTEuMzggMC0yLjUtMS4xMi0yLjUtMi41czEuMTItMi41IDIuNS0yLjUgMi41IDEuMTIgMi41IDIuNS0xLjEyIDIuNS0yLjUgMi41eiIgZmlsbD0iI2VmNDQ0NCIvPgo8L3N2Zz4K',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const MapClickHandler: React.FC<{ onClick: (lat: number, lng: number) => void }> = ({ onClick }) => {
  useMapEvents({
    click: (e) => {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

export const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  initialPosition,
}) => {
  const [position, setPosition] = useState<[number, number] | null>(
    initialPosition || null
  );
  const [locationSource, setLocationSource] = useState<'gps' | 'manual'>('manual');
  const [mapKey, setMapKey] = useState(0);
  const { getCurrentLocation, loading, error } = useGeolocation();

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setPosition([lat, lng]);
    setLocationSource('manual');
  }, []);

  const handleUseMyLocation = async () => {
    try {
      const location = await getCurrentLocation();
      setPosition([location.latitude, location.longitude]);
      setLocationSource('gps');
      setMapKey(prev => prev + 1);
    } catch (err) {
      console.error('Failed to get location:', err);
    }
  };

  const handleConfirm = () => {
    if (position) {
      onLocationSelect({
        latitude: position[0],
        longitude: position[1],
        accuracy: locationSource === 'gps' ? undefined : undefined,
        source: locationSource,
      });
    }
  };

  return (
    <div className="location-picker">
      <div className="location-picker-controls">
        <Button variant="secondary" onClick={handleUseMyLocation} disabled={loading}>
          {loading ? 'Getting Location...' : 'Use My Location'}
        </Button>
        {error && (
          <p className="location-picker-error">
            Could not get your location. Please click on the map to select manually.
          </p>
        )}
        {position && locationSource === 'gps' && (
          <p className="location-picker-success">
            ✓ GPS location detected at {position[0].toFixed(4)}, {position[1].toFixed(4)}
          </p>
        )}
      </div>

      <div className="location-picker-map">
        <MapContainer
          key={mapKey}
          center={position || MAP_CONFIG.defaultCenter}
          zoom={position ? 15 : 13}
          className="map-container"
          scrollWheelZoom={true}
        >
          <TileLayer
            url={MAP_CONFIG.tileLayer.url}
            attribution={MAP_CONFIG.tileLayer.attribution}
            maxZoom={MAP_CONFIG.tileLayer.maxZoom}
          />
          <MapClickHandler onClick={handleMapClick} />
          {position && <Marker position={position} icon={defaultIcon} />}
        </MapContainer>
      </div>

      <div className="location-picker-actions">
        <Button
          variant="primary"
          onClick={handleConfirm}
          disabled={!position}
          fullWidth
        >
          Confirm Location
        </Button>
      </div>
    </div>
  );
};
