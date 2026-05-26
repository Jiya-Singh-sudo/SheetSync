import { createWorker } from 'tesseract.js';
import { OCRConfig } from '@/types/scanner';

export interface OCRJob {
  promise: Promise<{ text: string; confidence: number }>;
  cancel: () => void;
}

/**
 * Performs client-side OCR using Tesseract.js with support for cancellation and progress reporting.
 */
export function performOCR(
  imageBlob: Blob | File | string,
  config: OCRConfig,
  onProgress?: (progress: number) => void
): OCRJob {
  let activeWorker: any = null;
  let isCancelled = false;

  const promise = new Promise<{ text: string; confidence: number }>(async (resolve, reject) => {
    if (config.provider === 'googleVision') {
      reject(new Error('Google Cloud Vision engine is not configured in the offline client.'));
      return;
    }

    try {
      // Create and load Tesseract worker
      activeWorker = await createWorker(config.language, undefined, {
        logger: (m) => {
          if (isCancelled) return;
          // Track progress only during actual character recognition
          if (m.status === 'recognizing text' && onProgress) {
            onProgress(Math.round(m.progress * 100));
          }
        }
      });

      if (isCancelled) {
        if (activeWorker) await activeWorker.terminate();
        reject(new Error('Scan cancelled by user'));
        return;
      }

      // Process OCR extraction
      const result = await activeWorker.recognize(imageBlob);

      if (isCancelled) {
        reject(new Error('Scan cancelled by user'));
        return;
      }

      resolve({
        text: result.data.text || '',
        confidence: Math.round(result.data.confidence || 0)
      });
    } catch (err: any) {
      if (!isCancelled) {
        reject(new Error(err.message || 'OCR extraction failed'));
      }
    } finally {
      if (activeWorker) {
        try {
          await activeWorker.terminate();
        } catch (e) {
          console.error('Error terminating worker:', e);
        }
        activeWorker = null;
      }
    }
  });

  const cancel = () => {
    isCancelled = true;
    if (activeWorker) {
      // Terminate immediately to abort worker thread CPU execution
      try {
        activeWorker.terminate();
      } catch (e) {
        console.error('Error terminating worker on cancel:', e);
      }
      activeWorker = null;
    }
  };

  return { promise, cancel };
}
