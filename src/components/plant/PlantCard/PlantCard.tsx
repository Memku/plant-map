import React from 'react';
import type { Plant } from '../../../types/plant.types';
import './PlantCard.css';

interface PlantCardProps {
  plant: Plant;
  onClick?: () => void;
  compact?: boolean;
}

export const PlantCard: React.FC<PlantCardProps> = ({ plant, onClick, compact = false }) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={`plant-card ${compact ? 'plant-card-compact' : ''}`} onClick={onClick}>
      <div className="plant-card-image">
        <img src={plant.photo} alt={plant.name || 'Plant'} />
      </div>

      <div className="plant-card-content">
        <h3 className="plant-card-name">{plant.name || 'Unnamed Plant'}</h3>
        <p className="plant-card-date">{formatDate(plant.timestamp)}</p>

        {!compact && plant.notes && (
          <p className="plant-card-notes">{plant.notes}</p>
        )}

        {!compact && plant.tags && plant.tags.length > 0 && (
          <div className="plant-card-tags">
            {plant.tags.map((tag, index) => (
              <span key={index} className="plant-card-tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        <p className="plant-card-location">
          {plant.location.latitude.toFixed(6)}, {plant.location.longitude.toFixed(6)}
          {plant.location.accuracy && ` (±${Math.round(plant.location.accuracy)}m)`}
        </p>
      </div>
    </div>
  );
};
