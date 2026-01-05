import React, { useRef, useState, useEffect } from 'react';
import { Button } from '../../common/Button/Button';
import './PhotoCapture.css';

interface PhotoCaptureProps {
  onCapture: (photoData: string) => void;
  onCancel: () => void;
}

export const PhotoCapture: React.FC<PhotoCaptureProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false,
        });

        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.onloadedmetadata = () => {
            setIsCameraReady(true);
          };
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setError('Could not access camera. Please check permissions or use photo upload instead.');
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const photoData = canvas.toDataURL('image/jpeg', 0.9);
    onCapture(photoData);

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const handleCancel = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    onCancel();
  };

  if (error) {
    return (
      <div className="photo-capture-error">
        <p>{error}</p>
        <Button onClick={handleCancel}>Close</Button>
      </div>
    );
  }

  return (
    <div className="photo-capture">
      <div className="photo-capture-preview">
        <video ref={videoRef} autoPlay playsInline muted />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      <div className="photo-capture-actions">
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleCapture} disabled={!isCameraReady}>
          Capture Photo
        </Button>
      </div>
    </div>
  );
};
