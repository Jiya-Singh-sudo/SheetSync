import React, { useRef } from 'react';
import Webcam from 'react-webcam';
import { Camera, Upload, AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CameraPermission } from '@/types/scanner';

interface CameraFeedProps {
  webcamRef: React.RefObject<any>;
  permissionState: CameraPermission;
  onRequestPermission: () => void;
  facingMode: 'user' | 'environment';
  activeDeviceId?: string;
  onFileSelect: (file: File) => void;
  onUserMediaError: () => void;
  onUserMedia: () => void;
}

export const CameraFeed: React.FC<CameraFeedProps> = ({
  webcamRef,
  permissionState,
  onRequestPermission,
  facingMode,
  activeDeviceId,
  onFileSelect,
  onUserMediaError,
  onUserMedia,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onFileSelect(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  // Video constraints configuration
  const videoConstraints = activeDeviceId
    ? { deviceId: { exact: activeDeviceId } }
    : { facingMode };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center min-h-[350px] bg-slate-950 rounded-2xl overflow-hidden border border-border/50 shadow-2xl">
      {/* 1. Granted state - Show Camera feed */}
      {permissionState === 'granted' && (
        <div className="relative w-full h-full flex items-center justify-center">
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            screenshotQuality={0.9}
            videoConstraints={videoConstraints}
            onUserMedia={onUserMedia}
            onUserMediaError={onUserMediaError}
            className="w-full h-full object-cover"
          />
          
          {/* Edge guides / Frame borders */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-6">
            <div className="relative w-4/5 h-4/5 max-w-md border border-white/20 rounded-xl bg-black/5">
              {/* Brackets in corners */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-blue-500 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-blue-500 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-blue-500 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-blue-500 rounded-br-lg" />
            </div>
          </div>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
            <div className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs px-4 py-2 rounded-full font-medium shadow-lg shadow-black/30">
              Align document inside the brackets
            </div>
          </div>
        </div>
      )}

      {/* 2. Pending Permission state */}
      {permissionState === 'pending' && (
        <div className="flex flex-col items-center justify-center p-8 text-center max-w-sm gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 animate-pulse">
            <Camera className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-white mb-1">Camera Permission Required</h3>
            <p className="text-xs text-slate-400">
              This app requires camera permissions to capture document pages directly in the browser.
            </p>
          </div>
          <Button onClick={onRequestPermission} className="bg-blue-500 hover:bg-blue-600 text-white border-0 mt-2">
            Grant Access
          </Button>
        </div>
      )}

      {/* 3. Denied / Fallback state - Show File Upload Fallback */}
      {permissionState === 'denied' && (
        <div 
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="flex-1 w-full flex flex-col items-center justify-center p-8 text-center gap-4 cursor-pointer hover:bg-slate-900/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-border/30 flex items-center justify-center text-slate-400">
            <Upload className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-semibold text-base text-white mb-1">Upload Document Image</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Camera is unavailable or permission was denied. Drag & drop your image here or tap to select.
            </p>
          </div>
          
          <div className="flex items-center gap-1.5 text-[11px] text-amber-400/80 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg max-w-xs mt-2 text-left">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Ensure the image is clear and contains readable text for best OCR accuracy.</span>
          </div>
        </div>
      )}
    </div>
  );
};
