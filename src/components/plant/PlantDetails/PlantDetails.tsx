import React from 'react';
import type { Plant } from '../../../types/plant.types';
import { Button } from '../../common/Button/Button';
import './PlantDetails.css';

interface PlantDetailsProps {
  plant: Plant;
  onEdit?: () => void;
  onDelete?: () => void;
  onClose?: () => void;
}

export const PlantDetails: React.FC<PlantDetailsProps> = ({
  plant,
  onEdit,
  onDelete,
  onClose,
}) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="plant-details">
      <div className="plant-details-image">
        <img src={plant.photo} alt={plant.name || 'Plant'} />
      </div>

      <div className="plant-details-content">
        <h2 className="plant-details-name">{plant.name || 'Unnamed Plant'}</h2>
        <p className="plant-details-date">Added on {formatDate(plant.timestamp)}</p>

        {plant.notes && (
          <div className="plant-details-section">
            <h3>Notes</h3>
            <p>{plant.notes}</p>
          </div>
        )}

        {plant.tags && plant.tags.length > 0 && (
          <div className="plant-details-section">
            <h3>Tags</h3>
            <div className="plant-details-tags">
              {plant.tags.map((tag, index) => (
                <span key={index} className="plant-details-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="plant-details-section">
          <h3>Location</h3>
          <p className="plant-details-location">
            Latitude: {plant.location.latitude.toFixed(6)}
            <br />
            Longitude: {plant.location.longitude.toFixed(6)}
            {plant.location.accuracy && (
              <>
                <br />
                Accuracy: ±{Math.round(plant.location.accuracy)}m
              </>
            )}
            <br />
            Source: {plant.location.source === 'gps' ? 'GPS' : 'Manual'}
          </p>
        </div>

        <div className="plant-details-actions">
          {onEdit && (
            <Button variant="secondary" onClick={onEdit}>
              Edit
            </Button>
          )}
          {onDelete && (
            <Button variant="danger" onClick={onDelete}>
              Delete
            </Button>
          )}
          {onClose && (
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
