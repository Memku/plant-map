import { useState, useCallback } from 'react';
import type { GeoLocation } from '../types/plant.types';
import { geolocationService } from '../services/geolocation/geolocation.service';

export const useGeolocation = () => {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [error, setError] = useState<GeolocationPositionError | null>(null);
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const position = await geolocationService.getCurrentPosition();
      setLocation(position);
      return position;
    } catch (err) {
      setError(err as GeolocationPositionError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const isAvailable = geolocationService.isGeolocationAvailable();

  return {
    location,
    error,
    loading,
    getCurrentLocation,
    isAvailable,
  };
};
