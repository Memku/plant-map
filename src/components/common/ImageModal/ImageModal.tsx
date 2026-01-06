import React, { useState, useRef } from 'react';
import './ImageModal.css';

interface ImageModalProps {
  imageUrl: string;
  altText: string;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, altText, onClose }) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 0.5, 0.5);
    setZoom(newZoom);
    if (newZoom === 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="image-modal-overlay" onClick={handleBackdropClick}>
      <div className="image-modal-content">
        <button className="image-modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="image-modal-controls">
          <button
            className="image-modal-zoom-btn"
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
            aria-label="Zoom out"
          >
            −
          </button>
          <span className="image-modal-zoom-level">{Math.round(zoom * 100)}%</span>
          <button
            className="image-modal-zoom-btn"
            onClick={handleZoomIn}
            disabled={zoom >= 3}
            aria-label="Zoom in"
          >
            +
          </button>
        </div>

        <div
          className="image-modal-image-container"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <img
            ref={imageRef}
            src={imageUrl}
            alt={altText}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
              cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
            }}
            className="image-modal-image"
            onMouseDown={handleMouseDown}
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
};
