import React, { useState, useRef } from 'react';
import { photoService } from '../../../services/photo/photo.service';
import { Button } from '../../common/Button/Button';
import './PhotoUpload.css';

interface PhotoUploadProps {
  onUpload: (photoData: string) => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ onUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    try {
      const base64 = await photoService.fileToBase64(file);
      setPreview(base64);
      onUpload(base64);
    } catch (error) {
      console.error('Error reading file:', error);
      alert('Failed to read file');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="photo-upload">
      <div
        className={`photo-upload-dropzone ${isDragging ? 'photo-upload-dropzone-active' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          style={{ display: 'none' }}
        />

        {preview ? (
          <div className="photo-upload-preview">
            <img src={preview} alt="Preview" />
          </div>
        ) : (
          <div className="photo-upload-placeholder">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p>Click or drag image here to upload</p>
          </div>
        )}
      </div>

      {!preview && (
        <Button variant="secondary" onClick={handleClick} fullWidth>
          Choose File
        </Button>
      )}
    </div>
  );
};
