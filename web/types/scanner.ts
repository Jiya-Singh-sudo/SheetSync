export type ScanState = 'idle' | 'camera' | 'captured' | 'scanning' | 'result' | 'error';

export type CameraPermission = 'pending' | 'granted' | 'denied';

export type OCRProvider = 'tesseract' | 'googleVision';

export interface OCRConfig {
  provider: OCRProvider;
  language: string;
  maxImageDimension?: number;
  compressionQuality?: number;
}

export interface ScanResult {
  text: string;
  confidence: number;
  imageSrc: string; // This will hold a local object URL (blob:...)
}
