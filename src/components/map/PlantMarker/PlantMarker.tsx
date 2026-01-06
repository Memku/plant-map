import React, { useMemo, useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Plant } from '../../../types/plant.types';
import { PlantCard } from '../../plant/PlantCard/PlantCard';
import { ImageModal } from '../../common/ImageModal/ImageModal';
import './PlantMarker.css';

interface PlantMarkerProps {
  plant: Plant;
}

export const PlantMarker: React.FC<PlantMarkerProps> = ({ plant }) => {
  const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string } | null>(null);

  const handleImageClick = () => {
    setSelectedImage({ url: plant.photo, alt: plant.name || 'Plant' });
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const icon = useMemo(() => {
    const thumbnail = plant.photoThumbnail || plant.photo;

    return L.divIcon({
      html: `<div class="plant-marker-icon">
        <img src="${thumbnail}" alt="${plant.name || 'Plant'}" />
      </div>`,
      className: 'plant-marker-wrapper',
      iconSize: [50, 50],
      iconAnchor: [25, 50],
      popupAnchor: [0, -50],
    });
  }, [plant.photoThumbnail, plant.photo, plant.name]);

  return (
    <>
      <Marker
        position={[plant.location.latitude, plant.location.longitude]}
        icon={icon}
      >
        <Popup>
          <PlantCard plant={plant} onClick={handleImageClick} />
        </Popup>
      </Marker>

      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage.url}
          altText={selectedImage.alt}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};
