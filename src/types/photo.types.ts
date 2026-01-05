export interface PhotoData {
  base64: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
}

export interface PhotoCaptureOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}
