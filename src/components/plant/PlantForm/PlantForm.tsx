import React, { useState } from 'react';
import type { CreatePlantInput, GeoLocation, AIIdentification } from '../../../types/plant.types';
import { Button } from '../../common/Button/Button';
import { PhotoCapture } from '../../photo/PhotoCapture/PhotoCapture';
import { PhotoUpload } from '../../photo/PhotoUpload/PhotoUpload';
import { LocationPicker } from '../../map/LocationPicker/LocationPicker';
import { PlantIdentification } from '../PlantIdentification/PlantIdentification';
import './PlantForm.css';

interface PlantFormProps {
  onSubmit: (input: CreatePlantInput) => Promise<void>;
  onCancel: () => void;
}

type FormStep = 'photo-choice' | 'photo-capture' | 'photo-upload' | 'location' | 'details';

export const PlantForm: React.FC<PlantFormProps> = ({ onSubmit, onCancel }) => {
  const [step, setStep] = useState<FormStep>('photo-choice');
  const [photo, setPhoto] = useState<string>('');
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [aiIdentification, setAiIdentification] = useState<AIIdentification | null>(null);

  const handlePhotoCapture = (photoData: string) => {
    setPhoto(photoData);
    setStep('location');
  };

  const handlePhotoUpload = (photoData: string) => {
    setPhoto(photoData);
    setStep('location');
  };

  const handleLocationSelect = (selectedLocation: GeoLocation) => {
    setLocation(selectedLocation);
    setStep('details');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!photo || !location) return;

    setSubmitting(true);

    try {
      await onSubmit({
        photo,
        location,
        name: name.trim() || undefined,
        notes: notes.trim() || undefined,
        aiIdentification: aiIdentification || undefined,
      });
    } catch (error) {
      console.error('Error submitting plant:', error);
      alert('Failed to save plant. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step === 'photo-capture' || step === 'photo-upload') {
      setStep('photo-choice');
    } else if (step === 'location') {
      setStep('photo-choice');
      setPhoto('');
    } else if (step === 'details') {
      setStep('location');
      setLocation(null);
    }
  };

  const handleIdentificationComplete = (aiData: AIIdentification | null) => {
    setAiIdentification(aiData);
  };

  const handleNameSelect = (selectedName: string) => {
    setName(selectedName);
  };

  return (
    <div className="plant-form">
      {step === 'photo-choice' && (
        <div className="plant-form-step">
          <h3>How would you like to add a photo?</h3>
          <div className="plant-form-photo-choice">
            <Button variant="primary" onClick={() => setStep('photo-capture')} fullWidth>
              Take Photo
            </Button>
            <Button variant="secondary" onClick={() => setStep('photo-upload')} fullWidth>
              Upload Photo
            </Button>
          </div>
          <Button variant="secondary" onClick={onCancel} fullWidth>
            Cancel
          </Button>
        </div>
      )}

      {step === 'photo-capture' && (
        <div className="plant-form-step">
          <h3>Take a Photo</h3>
          <PhotoCapture onCapture={handlePhotoCapture} onCancel={handleBack} />
        </div>
      )}

      {step === 'photo-upload' && (
        <div className="plant-form-step">
          <h3>Upload a Photo</h3>
          <PhotoUpload onUpload={handlePhotoUpload} />
          <Button variant="secondary" onClick={handleBack} fullWidth>
            Back
          </Button>
        </div>
      )}

      {step === 'location' && (
        <div className="plant-form-step">
          <h3>Select Location</h3>
          <LocationPicker onLocationSelect={handleLocationSelect} />
          <Button variant="secondary" onClick={handleBack} fullWidth>
            Back
          </Button>
        </div>
      )}

      {step === 'details' && (
        <div className="plant-form-step">
          <h3>Plant Details</h3>
          <form onSubmit={handleSubmit} className="plant-form-fields">
            <div className="plant-form-preview">
              <img src={photo} alt="Plant" />
            </div>

            <PlantIdentification
              photo={photo}
              onIdentificationComplete={handleIdentificationComplete}
              onNameSelect={handleNameSelect}
              disabled={submitting}
            />

            <div className="plant-form-field">
              <label htmlFor="name">Name (optional)</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Rose, Oak Tree, etc."
              />
            </div>

            <div className="plant-form-field">
              <label htmlFor="notes">Notes (optional)</label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes..."
                rows={4}
              />
            </div>

            <div className="plant-form-actions">
              <Button variant="secondary" type="button" onClick={handleBack}>
                Back
              </Button>
              <Button variant="primary" type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Plant'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
