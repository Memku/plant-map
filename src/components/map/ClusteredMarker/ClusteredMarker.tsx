import { useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { PlantCluster } from '../../../utils/clustering';
import { PlantCard } from '../../plant/PlantCard/PlantCard';
import { ImageModal } from '../../common/ImageModal/ImageModal';
import './ClusteredMarker.css';

interface ClusteredMarkerProps {
  cluster: PlantCluster;
}

export const ClusteredMarker: React.FC<ClusteredMarkerProps> = ({
  cluster,
}) => {
  const { representativePlant, location, count } = cluster;
  const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string } | null>(null);

  // Use thumbnail if available, otherwise use full photo
  const thumbnail =
    representativePlant.photoThumbnail || representativePlant.photo;

  const handleImageClick = (photoUrl: string, plantName: string) => {
    setSelectedImage({ url: photoUrl, alt: plantName || 'Plant' });
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  // Create the marker icon with count badge if multiple plants
  const createIcon = () => {
    const hasMultiple = count > 1;
    const countBadge = hasMultiple
      ? `<div class="cluster-count-badge">+ ${count - 1}</div>`
      : '';

    return L.divIcon({
      html: `
        <div class="clustered-marker-icon ${hasMultiple ? 'has-cluster' : ''}">
          <img src="${thumbnail}" alt="${representativePlant.name || 'Plant'}" />
          ${countBadge}
        </div>
      `,
      className: 'clustered-marker-wrapper',
      iconSize: hasMultiple ? [60, 60] : [50, 50],
      iconAnchor: hasMultiple ? [30, 60] : [25, 50],
      popupAnchor: [0, hasMultiple ? -60 : -50],
    });
  };

  return (
    <>
      <Marker position={[location.latitude, location.longitude]} icon={createIcon()}>
        <Popup className="cluster-popup" maxWidth={count > 1 ? 500 : 300}>
          {count > 1 ? (
            <div className="cluster-popup-content">
              <h3 className="cluster-popup-title">
                {count} plants at this location
              </h3>
              <div className="cluster-plants-grid">
                {cluster.plants.map((plant) => (
                  <div key={plant.id} className="cluster-plant-item">
                    <PlantCard
                      plant={plant}
                      compact
                      onClick={() => handleImageClick(plant.photo, plant.name || 'Plant')}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <PlantCard
              plant={representativePlant}
              onClick={() => handleImageClick(representativePlant.photo, representativePlant.name || 'Plant')}
            />
          )}
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
