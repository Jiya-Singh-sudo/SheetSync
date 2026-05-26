import { useState, useRef, useCallback, useEffect } from 'react';
import { performOCR, OCRJob } from '@/lib/ocr';
import { OCRConfig } from '@/types/scanner';

export function useOCR() {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const activeJobRef = useRef<OCRJob | null>(null);
  const timeoutRef = useRef<any>(null);

  const cancelOCR = useCallback(() => {
    if (activeJobRef.current) {
      activeJobRef.current.cancel();
      activeJobRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsScanning(false);
    setProgress(0);
    setError('Scan cancelled');
  }, []);

  const runOCR = useCallback((blob: Blob, config: OCRConfig): Promise<{ text: string; confidence: number }> => {
    // Abort active scan if it is already running
    if (activeJobRef.current) {
      activeJobRef.current.cancel();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsScanning(true);
    setProgress(0);
    setError(null);

    return new Promise((resolve, reject) => {
      const job = performOCR(blob, config, (pct) => {
        setProgress(pct);
      });
      activeJobRef.current = job;

      // Enforce 15-second safety timeout
      const TIMEOUT_SECONDS = 15;
      timeoutRef.current = setTimeout(() => {
        job.cancel();
        activeJobRef.current = null;
        setIsScanning(false);
        const err = new Error(`OCR processing timed out after ${TIMEOUT_SECONDS}s`);
        setError(err.message);
        reject(err);
      }, TIMEOUT_SECONDS * 1000);

      job.promise
        .then((result) => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          setIsScanning(false);
          resolve(result);
        })
        .catch((err) => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          setIsScanning(false);
          setError(err.message || 'OCR processing failed');
          reject(err);
        });
    });
  }, []);

  // Cleanup worker resources on unmount
  useEffect(() => {
    return () => {
      if (activeJobRef.current) {
        activeJobRef.current.cancel();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    progress,
    error,
    isScanning,
    runOCR,
    cancelOCR,
  };
}
