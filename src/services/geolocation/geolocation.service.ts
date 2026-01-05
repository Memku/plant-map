import type { GeoLocation } from '../../types/plant.types';

class GeolocationService {
  async getCurrentPosition(): Promise<GeoLocation> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            source: 'gps',
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }

  watchPosition(callback: (location: GeoLocation) => void): number {
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported by this browser');
    }

    return navigator.geolocation.watchPosition(
      (position) => {
        callback({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          source: 'gps',
        });
      },
      (error) => {
        console.error('Error watching position:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  clearWatch(watchId: number): void {
    navigator.geolocation.clearWatch(watchId);
  }

  isGeolocationAvailable(): boolean {
    return 'geolocation' in navigator;
  }
}

export const geolocationService = new GeolocationService();
