import type {
  PlantIdIdentifyRequest,
  IdentificationResult,
} from '../../types/api.types';
import type { AIIdentification } from '../../types/plant.types';

/**
 * Service for interacting with Plant.id API for plant identification
 * Docs: https://web.plant.id/plant-identification-api/
 */
class PlantIdService {
  private readonly apiKey: string;
  private readonly apiUrl: string;
  private readonly timeout: number = 30000; // 30 seconds

  constructor() {
    this.apiKey = import.meta.env.VITE_PLANT_ID_API_KEY || 'ogotqHYQdmiq5hFX6RVuMt4OY5BNLS9pW3Prg28V0kRD9ghwbD';
    this.apiUrl = import.meta.env.VITE_PLANT_ID_API_URL || 'https://api.plant.id/v3';

    if (!this.apiKey) {
      console.warn('Plant.id API key not configured. AI identification will be disabled.');
    }
  }

  /**
   * Check if API is properly configured with an API key
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }

  /**
   * Check if user is online
   */
  isOnline(): boolean {
    return navigator.onLine;
  }

  /**
   * Prepare base64 image for Plant.id API
   * API expects base64 string without data URI prefix
   * @param base64WithPrefix - base64 string with or without "data:image/...;base64," prefix
   * @returns base64 string without prefix
   */
  private prepareImage(base64WithPrefix: string): string {
    // Remove "data:image/jpeg;base64," prefix if present
    const base64Match = base64WithPrefix.match(/^data:image\/[^;]+;base64,(.+)$/);
    return base64Match ? base64Match[1] : base64WithPrefix;
  }

  /**
   * Identify plant using Plant.id API
   * @param base64Image - base64 encoded image (with or without data URI prefix)
   * @returns IdentificationResult with AI data or error
   */
  async identifyPlant(base64Image: string): Promise<IdentificationResult> {
    // Check configuration
    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'API key not configured',
        errorType: 'invalid_key',
      };
    }

    // Check online status
    if (!this.isOnline()) {
      return {
        success: false,
        error: 'No internet connection',
        errorType: 'offline',
      };
    }

    try {
      const imageData = this.prepareImage(base64Image);

      const requestBody: PlantIdIdentifyRequest = {
        images: [imageData],
        modifiers: ['crops_fast', 'similar_images'],
        plant_language: 'en',
        plant_details: ['common_names', 'taxonomy'],
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.apiUrl}/identify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': this.apiKey,
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          return {
            success: false,
            error: 'Invalid API key',
            errorType: 'invalid_key',
          };
        }

        if (response.status === 429) {
          return {
            success: false,
            error: 'Rate limit exceeded. Please try again later.',
            errorType: 'rate_limit',
          };
        }

        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.error || `API error: ${response.status}`,
          errorType: 'api',
        };
      }

      const data: any = await response.json();

      // Transform API response to our internal format
      // Note: v3 API uses plant_name and plant_details instead of name and details
      const aiData: AIIdentification = {
        apiRequestId: data.id?.toString() || Date.now().toString(),
        identifiedAt: Date.now(),
        isPlant: true, // v3 API doesn't return is_plant field
        isPlantProbability: 1, // v3 API doesn't return is_plant field
        suggestions: (data.suggestions || []).slice(0, 3).map((suggestion: any) => ({
          scientificName: suggestion.plant_details?.scientific_name || suggestion.plant_name || 'Unknown',
          commonNames: suggestion.plant_details?.common_names || [],
          confidence: Math.round((suggestion.probability || 0) * 100),
          selected: false,
        })),
      };

      return {
        success: true,
        data: aiData,
      };

    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            success: false,
            error: 'Request timeout. Please try again.',
            errorType: 'network',
          };
        }

        return {
          success: false,
          error: error.message,
          errorType: 'network',
        };
      }

      return {
        success: false,
        error: 'Unknown error occurred',
        errorType: 'unknown',
      };
    }
  }

  /**
   * Get user-friendly error message for display
   * @param errorType - Error type from IdentificationError
   * @returns User-friendly error message
   */
  getErrorMessage(errorType: string): string {
    switch (errorType) {
      case 'offline':
        return 'You are offline. Please check your connection and try again.';
      case 'invalid_key':
        return 'Plant identification is not configured. Please contact support.';
      case 'rate_limit':
        return 'Too many requests. Please try again in a few minutes.';
      case 'network':
        return 'Network error. Please check your connection and try again.';
      case 'api':
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }
}

// Export singleton instance
export const plantIdService = new PlantIdService();
