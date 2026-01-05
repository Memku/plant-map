import type { Plant } from '../types/plant.types';

export interface PlantCluster {
  id: string;
  representativePlant: Plant;
  plants: Plant[];
  location: {
    latitude: number;
    longitude: number;
  };
  count: number;
}

/**
 * Calculate distance between two geographic points using Haversine formula
 * Returns distance in meters
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Get clustering threshold distance based on zoom level
 * Higher zoom = smaller threshold (plants must be closer to cluster)
 * Lower zoom = larger threshold (plants further apart will cluster)
 */
function getClusteringThreshold(zoom: number): number {
  // Zoom levels: 0 (world) to 19 (building)
  // Threshold in meters
  if (zoom <= 10) return 5000; // 5km
  if (zoom <= 12) return 2000; // 2km
  if (zoom <= 14) return 1000; // 1km
  if (zoom <= 16) return 500;  // 500m
  if (zoom <= 17) return 200;  // 200m
  if (zoom <= 18) return 100;  // 100m
  return 50; // 50m for highest zoom
}

/**
 * Cluster plants based on proximity and zoom level
 * Returns an array of clusters, each containing one or more plants
 */
export function clusterPlants(plants: Plant[], zoom: number): PlantCluster[] {
  if (plants.length === 0) return [];

  const threshold = getClusteringThreshold(zoom);
  const clusters: PlantCluster[] = [];
  const processed = new Set<string>();

  plants.forEach((plant) => {
    if (processed.has(plant.id)) return;

    // Start a new cluster with this plant
    const clusterPlants: Plant[] = [plant];
    processed.add(plant.id);

    // Find all nearby plants
    plants.forEach((otherPlant) => {
      if (processed.has(otherPlant.id)) return;

      const distance = calculateDistance(
        plant.location.latitude,
        plant.location.longitude,
        otherPlant.location.latitude,
        otherPlant.location.longitude
      );

      if (distance <= threshold) {
        clusterPlants.push(otherPlant);
        processed.add(otherPlant.id);
      }
    });

    // Calculate cluster center (average of all plant locations)
    const centerLat =
      clusterPlants.reduce((sum, p) => sum + p.location.latitude, 0) /
      clusterPlants.length;
    const centerLon =
      clusterPlants.reduce((sum, p) => sum + p.location.longitude, 0) /
      clusterPlants.length;

    // Use most recent plant as representative
    const representative = clusterPlants.reduce((latest, current) =>
      current.timestamp > latest.timestamp ? current : latest
    );

    clusters.push({
      id: `cluster-${representative.id}`,
      representativePlant: representative,
      plants: clusterPlants,
      location: {
        latitude: centerLat,
        longitude: centerLon,
      },
      count: clusterPlants.length,
    });
  });

  return clusters;
}
