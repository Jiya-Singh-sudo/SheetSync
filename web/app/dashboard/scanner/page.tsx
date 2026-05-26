'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, Upload, RotateCcw, AlertTriangle, FileSpreadsheet, Globe, Sparkles, X, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCamera } from '@/hooks/useCamera';
import { useOCR } from '@/hooks/useOCR';
import { CameraFeed } from '@/components/scanner/CameraFeed';
import { CaptureButton } from '@/components/scanner/CaptureButton';
import { ScannerOverlay } from '@/components/scanner/ScannerOverlay';
import { OCRPreview } from '@/components/scanner/OCRPreview';
import { compressAndResize } from '@/lib/image';
import { ScanState, OCRConfig, ScanResult } from '@/types/scanner';

const SPREADSHEET_KEY = 'sheetscan_spreadsheet_id';
const SPREADSHEET_NAME_KEY = 'sheetscan_spreadsheet_name';

export default function ScannerPage() {
  const [state, setState] = useState<ScanState>('idle');
  const [activeImageSrc, setActiveImageSrc] = useState<string | null>(null);
  const [activeBlob, setActiveBlob] = useState<Blob | null>(null);
  
  // OCR Results State
  const [extractedText, setExtractedText] = useState('');
  const [confidence, setConfidence] = useState(0);

  // Sheets Sync State — real integration
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(null);
  const [spreadsheetName, setSpreadsheetName] = useState('SheetScan Data');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // OCR Config Setup
  const [ocrConfig, setOcrConfig] = useState<OCRConfig>({
    provider: 'tesseract',
    language: 'eng',
    maxImageDimension: 1024,
    compressionQuality: 0.85,
  });

  const webcamRef = useRef<any>(null);
  const {
    facingMode,
    permissionState,
    setPermissionState,
    requestPermission,
    switchCamera,
    devices,
  } = useCamera();

  const {
    progress,
    error: ocrError,
    isScanning,
    runOCR,
    cancelOCR,
  } = useOCR();

  // Load persisted spreadsheetId from localStorage on mount
  useEffect(() => {
    const storedId = localStorage.getItem(SPREADSHEET_KEY);
    const storedName = localStorage.getItem(SPREADSHEET_NAME_KEY);
    if (storedId) setSpreadsheetId(storedId);
    if (storedName) setSpreadsheetName(storedName);
  }, []);

  // Clean up Object URL to prevent browser memory leaks
  const cleanupImage = useCallback(() => {
    if (activeImageSrc) {
      URL.revokeObjectURL(activeImageSrc);
      setActiveImageSrc(null);
    }
    setActiveBlob(null);
  }, [activeImageSrc]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupImage();
    };
  }, []);

  // Handle Camera opening trigger
  const handleOpenCamera = async () => {
    setState('camera');
    if (permissionState !== 'granted') {
      await requestPermission();
    }
  };

  // Convert webcam screenshot base64/dataURL -> resize/compress -> Blob/ObjectURL
  const handleCapture = async () => {
    if (!webcamRef.current) return;
    const screenshot = webcamRef.current.getScreenshot();
    if (!screenshot) return;

    try {
      setState('scanning'); // Transition quickly to scanning overlay
      const compressedBlob = await compressAndResize(
        screenshot, 
        ocrConfig.maxImageDimension, 
        ocrConfig.compressionQuality
      );
      
      const objectUrl = URL.createObjectURL(compressedBlob);
      setActiveBlob(compressedBlob);
      setActiveImageSrc(objectUrl);
      
      // Move to captured preview state
      setState('captured');
    } catch (err) {
      console.error('Image preprocessing failed:', err);
      setState('error');
    }
  };

  // Handle image file uploads
  const handleFileSelect = async (file: File) => {
    try {
      setState('scanning');
      const fileUrl = URL.createObjectURL(file);
      const compressedBlob = await compressAndResize(
        fileUrl, 
        ocrConfig.maxImageDimension, 
        ocrConfig.compressionQuality
      );
      
      URL.revokeObjectURL(fileUrl); // Clean up original upload URL immediately
      
      const objectUrl = URL.createObjectURL(compressedBlob);
      setActiveBlob(compressedBlob);
      setActiveImageSrc(objectUrl);
      setState('captured');
    } catch (err) {
      console.error('File compression failed:', err);
      setState('error');
    }
  };

  // Run OCR processing on the prepared Blob
  const startOCRProcessing = async () => {
    if (!activeBlob) return;
    setState('scanning');
    try {
      const result = await runOCR(activeBlob, ocrConfig);
      setExtractedText(result.text);
      setConfidence(result.confidence);
      setState('result');
      setIsSaved(false); // Reset sheets sync status
      setSaveError(null);
    } catch (err: any) {
      console.error('OCR analysis failed:', err);
      // If it was cancelled manually, go back to camera view or captured
      if (err.message === 'Scan cancelled by user' || err.message === 'Scan cancelled') {
        setState(activeImageSrc ? 'captured' : 'camera');
      } else {
        setState('error');
      }
    }
  };

  // Manual Scan Cancellation
  const handleCancelScan = () => {
    cancelOCR();
    // Return to the previous stable state
    if (activeImageSrc) {
      setState('captured');
    } else {
      setState('camera');
    }
  };

  const handleRetake = () => {
    cleanupImage();
    setExtractedText('');
    setConfidence(0);
    setState('camera');
  };

  /**
   * REAL Google Sheets save flow:
   * 1. If no spreadsheetId yet → call /api/sheets/create to make one
   * 2. Call /api/sheets/append with the OCR data + spreadsheetId
   */
  const handleSaveToSheets = async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      let sheetId = spreadsheetId;

      // Step 1: Create spreadsheet if the user doesn't have one yet
      if (!sheetId) {
        const createRes = await fetch('/api/sheets/create', { method: 'POST' });
        const createData = await createRes.json();

        if (!createRes.ok) {
          throw new Error(createData.error || 'Failed to create spreadsheet');
        }

        sheetId = createData.spreadsheetId;
        setSpreadsheetId(sheetId);
        setSpreadsheetName('SheetScan Data');

        // Persist so we don't create again on next scan
        localStorage.setItem(SPREADSHEET_KEY, sheetId!);
        localStorage.setItem(SPREADSHEET_NAME_KEY, 'SheetScan Data');
      }

      // Step 2: Append the OCR row to the user's sheet
      const appendRes = await fetch('/api/sheets/append', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: extractedText,
          confidence,
          spreadsheetId: sheetId,
          source: 'Camera',
        }),
      });

      const appendData = await appendRes.json();

      if (!appendRes.ok) {
        throw new Error(appendData.error || 'Failed to save to Google Sheets');
      }

      setIsSaved(true);
    } catch (err: any) {
      console.error('Save to Sheets failed:', err);
      setSaveError(err.message || 'Failed to save to Google Sheets');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 gap-4 bg-background">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Scanner Engine</h2>
          <p className="text-xs text-muted-foreground">
            {state === 'idle' && 'Select an input source to scan documents.'}
            {state === 'camera' && 'Align document text in camera stream frame.'}
            {state === 'captured' && 'Verify captured image before starting AI analysis.'}
            {state === 'scanning' && 'Tesseract engine is extracting characters...'}
            {state === 'result' && 'Verify, edit, or copy extracted text.'}
            {state === 'error' && 'An error occurred during extraction.'}
          </p>
        </div>

        {/* OCR Language Configuration Selector */}
        {(state === 'idle' || state === 'camera' || state === 'captured') && (
          <div className="flex items-center gap-2 bg-muted/50 border border-border/80 rounded-xl px-3 py-1.5 self-start sm:self-center">
            <Languages className="w-4 h-4 text-muted-foreground" />
            <select
              value={ocrConfig.language}
              onChange={(e) => setOcrConfig(prev => ({ ...prev, language: e.target.value }))}
              className="bg-transparent text-xs font-semibold text-foreground outline-none cursor-pointer"
            >
              <option value="eng">English (eng)</option>
              <option value="hin">Hindi (hin)</option>
              <option value="deu">German (deu)</option>
              <option value="fra">French (fra)</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex-1 grid grid-cols-1 gap-4 min-h-0">
        {/* Left Side: Live Feed or Static Preview Card */}
        <div className="flex flex-col gap-3 min-h-0 w-full relative">
          
          {/* Main frame box */}
          <div className="flex-1 rounded-2xl border border-border/50 bg-card overflow-hidden relative min-h-[300px]">
            {/* Idle state */}
            {state === 'idle' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center gap-6">
                <div className="w-18 h-18 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Camera className="w-9 h-9" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white mb-1">OCR Document Scanner</h3>
                  <p className="text-sm text-slate-400 max-w-sm mx-auto">
                    Point your device camera at a receipt, invoice, or printed sheet, or upload an image to extract text instantly.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs mt-2">
                  <Button onClick={handleOpenCamera} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white border-0 h-11">
                    <Camera className="w-4 h-4 mr-2" />
                    Open Camera
                  </Button>
                  
                  {/* Native Upload Fallback in Idle */}
                  <label className="flex-1">
                    <Button 
                      variant="outline" 
                      className="w-full border-border/80 hover:bg-muted text-foreground h-11"
                      asChild
                    >
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Image
                      </span>
                    </Button>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(file);
                      }} 
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Camera feed state */}
            {state === 'camera' && (
              <CameraFeed
                webcamRef={webcamRef}
                permissionState={permissionState}
                onRequestPermission={requestPermission}
                facingMode={facingMode}
                activeDeviceId={undefined}
                onFileSelect={handleFileSelect}
                onUserMedia={() => setPermissionState('granted')}
                onUserMediaError={() => setPermissionState('denied')}
              />
            )}

            {/* Captured Preview state */}
            {state === 'captured' && activeImageSrc && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-slate-950">
                <div className="relative max-h-[70%] w-auto max-w-full rounded-xl overflow-hidden border border-white/10 shadow-lg">
                  <img
                    src={activeImageSrc}
                    alt="Captured Scan Preview"
                    className="max-h-full max-w-full object-contain"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="bg-blue-500/80 hover:bg-blue-500/80 text-white border-0 shadow-md">
                      Frozen Preview
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-4 w-full max-w-xs mt-6">
                  <Button 
                    variant="outline" 
                    onClick={handleRetake} 
                    className="flex-1 border-white/10 text-white hover:bg-white/5 h-11"
                  >
                    Retake
                  </Button>
                  <Button 
                    onClick={startOCRProcessing} 
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white border-0 h-11 font-semibold"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Extract Text
                  </Button>
                </div>
              </div>
            )}

            {/* Scanning Overlay (Progress tracking) */}
            {state === 'scanning' && (
              <ScannerOverlay
                progress={progress}
                onCancel={handleCancelScan}
                imageSrc={activeImageSrc}
              />
            )}

            {/* Result State (Renders OCRPreview) */}
            {state === 'result' && activeImageSrc && (
              <div className="p-6 h-full overflow-auto">
                <OCRPreview
                  text={extractedText}
                  onChangeText={setExtractedText}
                  confidence={confidence}
                  imageSrc={activeImageSrc}
                  onRetake={handleRetake}
                  onSaveToSheets={handleSaveToSheets}
                  isSaving={isSaving}
                  isSaved={isSaved}
                  saveError={saveError}
                  sheetName={spreadsheetName}
                />
              </div>
            )}

            {/* Error state */}
            {state === 'error' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center gap-5">
                <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white mb-1">OCR Scan Failed</h3>
                  <p className="text-sm text-slate-400 max-w-xs mx-auto">
                    {ocrError || 'Something went wrong during text character extraction. Please check image quality and try again.'}
                  </p>
                </div>
                <div className="flex gap-3 w-full max-w-xs mt-2">
                  <Button 
                    variant="outline" 
                    onClick={handleRetake}
                    className="flex-1 border-white/10 text-white hover:bg-white/5 h-11"
                  >
                    Back to Camera
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Capture Trigger Area (Visible only in camera state with camera permission granted) */}
          {state === 'camera' && permissionState === 'granted' && (
            <CaptureButton
              onCapture={handleCapture}
              onFileSelect={handleFileSelect}
              onSwitchCamera={switchCamera}
              showSwitch={devices.length > 1}
              disabled={isScanning}
            />
          )}
        </div>
      </div>
    </div>
  );
}
