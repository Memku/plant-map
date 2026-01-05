import React, { useState } from 'react';
import type { AIIdentification } from '../../../types/plant.types';
import { Button } from '../../common/Button/Button';
import { plantIdService } from '../../../services/api/plantId.service';
import './PlantIdentification.css';

interface PlantIdentificationProps {
  photo: string;
  onIdentificationComplete: (aiData: AIIdentification | null) => void;
  onNameSelect: (name: string) => void;
  disabled?: boolean;
}

/**
 * Component for AI-powered plant identification using Plant.id API
 * Shows "Identify Plant" button and displays top 3 suggestions with confidence scores
 */
export const PlantIdentification: React.FC<PlantIdentificationProps> = ({
  photo,
  onIdentificationComplete,
  onNameSelect,
  disabled = false,
}) => {
  const [identifying, setIdentifying] = useState(false);
  const [aiData, setAiData] = useState<AIIdentification | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isConfigured = plantIdService.isConfigured();
  const isOnline = plantIdService.isOnline();

  const handleIdentify = async () => {
    setIdentifying(true);
    setError(null);

    const result = await plantIdService.identifyPlant(photo);

    if (result.success) {
      setAiData(result.data);
      onIdentificationComplete(result.data);
    } else {
      const errorMsg = plantIdService.getErrorMessage(result.errorType);
      setError(errorMsg);
      onIdentificationComplete(null);
    }

    setIdentifying(false);
  };

  const handleSelectSuggestion = (index: number) => {
    if (!aiData) return;

    const suggestion = aiData.suggestions[index];
    const displayName = suggestion.commonNames[0] || suggestion.scientificName;

    // Update selected state
    const updatedSuggestions = aiData.suggestions.map((s, i) => ({
      ...s,
      selected: i === index,
    }));

    const updatedAiData = {
      ...aiData,
      suggestions: updatedSuggestions,
    };

    setAiData(updatedAiData);
    onIdentificationComplete(updatedAiData);
    onNameSelect(displayName);
  };

  // Don't show if API not configured
  if (!isConfigured) {
    return null;
  }

  return (
    <div className="plant-identification">
      <div className="plant-identification-header">
        <h4>AI Plant Identification</h4>
        {!isOnline && (
          <span className="plant-identification-offline">Offline</span>
        )}
      </div>

      {!aiData && !error && (
        <Button
          variant="secondary"
          onClick={handleIdentify}
          disabled={disabled || identifying || !isOnline}
          fullWidth
        >
          {identifying ? 'Identifying...' : 'Identify Plant with AI'}
        </Button>
      )}

      {error && (
        <div className="plant-identification-error">
          <p>{error}</p>
          <Button
            variant="secondary"
            onClick={handleIdentify}
            disabled={!isOnline}
            fullWidth
          >
            Try Again
          </Button>
        </div>
      )}

      {aiData && (
        <div className="plant-identification-results">
          <div className="plant-identification-suggestions">
            <p className="plant-identification-suggestions-title">
              Top {aiData.suggestions.length} Matches:
            </p>
            {aiData.suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`plant-identification-suggestion ${
                  suggestion.selected ? 'selected' : ''
                }`}
                onClick={() => handleSelectSuggestion(index)}
              >
                <div className="plant-identification-suggestion-info">
                  <div className="plant-identification-suggestion-name">
                    {suggestion.commonNames[0] || suggestion.scientificName}
                  </div>
                  <div className="plant-identification-suggestion-scientific">
                    {suggestion.scientificName}
                    {suggestion.commonNames.length > 1 && (
                      <span className="plant-identification-suggestion-aka">
                        {' '}
                        (also: {suggestion.commonNames.slice(1, 3).join(', ')})
                      </span>
                    )}
                  </div>
                </div>
                <div className="plant-identification-suggestion-confidence">
                  {suggestion.confidence}%
                </div>
              </div>
            ))}
          </div>

          <Button
            variant="secondary"
            onClick={handleIdentify}
            disabled={identifying || !isOnline}
            fullWidth
          >
            Identify Again
          </Button>
        </div>
      )}
    </div>
  );
};
