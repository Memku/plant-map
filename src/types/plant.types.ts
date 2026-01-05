export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  source: 'gps' | 'manual';
}

export interface AIIdentification {
  apiRequestId: string;           // Plant.id request ID
  identifiedAt: number;            // Timestamp of identification
  isPlant: boolean;                // Whether AI detected it as a plant
  isPlantProbability: number;      // Confidence it's a plant (0-1)
  suggestions: Array<{
    scientificName: string;
    commonNames: string[];
    confidence: number;            // 0-100 percentage
    selected: boolean;             // Whether user selected this suggestion
  }>;
}

export interface Plant {
  id: string;
  name?: string;
  photo: string;
  photoThumbnail?: string;
  location: GeoLocation;
  timestamp: number;
  notes?: string;
  tags?: string[];
  createdAt: number;
  updatedAt: number;
  aiIdentification?: AIIdentification;  // Optional AI identification data
}

export interface CreatePlantInput {
  name?: string;
  photo: string;
  location: GeoLocation;
  notes?: string;
  tags?: string[];
  aiIdentification?: AIIdentification;  // Optional AI identification data
}

export interface UpdatePlantInput {
  id: string;
  name?: string;
  notes?: string;
  tags?: string[];
}
