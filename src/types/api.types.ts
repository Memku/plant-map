import type { AIIdentification } from './plant.types';

// Plant.id API request types
export interface PlantIdIdentifyRequest {
  images: string[];              // base64 encoded images (without data URI prefix)
  modifiers?: string[];          // e.g., ['crops_fast', 'similar_images']
  plant_language?: string;       // e.g., 'en'
  plant_details?: string[];      // additional details to request
  custom_id?: string;            // optional custom identifier
}

// Plant.id API response types
export interface PlantIdSuggestion {
  id: string;
  name: string;                  // Scientific name
  probability: number;           // 0-1 confidence
  similar_images?: Array<{
    id: string;
    url: string;
    similarity: number;
  }>;
  details?: {
    common_names?: string[];
    taxonomy?: {
      class: string;
      family: string;
      genus: string;
      order: string;
      phylum: string;
      kingdom: string;
    };
  };
}

export interface PlantIdResponse {
  id: string;                    // Request ID
  custom_id?: string;
  suggestions: PlantIdSuggestion[];
  is_plant: {
    probability: number;         // 0-1 confidence
    binary: boolean;             // true if AI thinks it's a plant
  };
}

export interface PlantIdError {
  error: string;
  status: number;
}

export type PlantIdResult = PlantIdResponse | PlantIdError;

// Service result types
export interface IdentificationSuccess {
  success: true;
  data: AIIdentification;
}

export interface IdentificationError {
  success: false;
  error: string;
  errorType: 'network' | 'api' | 'offline' | 'invalid_key' | 'rate_limit' | 'unknown';
}

export type IdentificationResult = IdentificationSuccess | IdentificationError;
