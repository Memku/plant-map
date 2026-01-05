import type { PhotoData, PhotoCaptureOptions } from '../../types/photo.types';

class PhotoService {
  async compressImage(
    base64: string,
    options: PhotoCaptureOptions = {}
  ): Promise<string> {
    const {
      maxWidth = 1200,
      maxHeight = 1200,
      quality = 0.8,
      format = 'jpeg',
    } = options;

    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          } else {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = `image/${format}`;
        const compressedBase64 = canvas.toDataURL(mimeType, quality);

        resolve(compressedBase64);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = base64;
    });
  }

  async generateThumbnail(base64: string, size = 150): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        const scale = Math.max(size / img.width, size / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const offsetX = (size - scaledWidth) / 2;
        const offsetY = (size - scaledHeight) / 2;

        ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);

        const thumbnailBase64 = canvas.toDataURL('image/jpeg', 0.7);
        resolve(thumbnailBase64);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image for thumbnail'));
      };

      img.src = base64;
    });
  }

  async validatePhoto(base64: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();

      img.onload = () => {
        resolve(img.width > 0 && img.height > 0);
      };

      img.onerror = () => {
        resolve(false);
      };

      img.src = base64;
    });
  }

  getPhotoData(base64: string): PhotoData {
    const parts = base64.split(',');
    const header = parts[0];
    const data = parts[1];

    const mimeMatch = header.match(/:(.*?);/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

    const size = Math.ceil((data.length * 3) / 4);

    return {
      base64,
      mimeType,
      size,
    };
  }

  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(file);
    });
  }
}

export const photoService = new PhotoService();
