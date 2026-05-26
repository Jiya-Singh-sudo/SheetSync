import React, { useRef } from 'react';
import { Camera, SwitchCamera, Upload, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CaptureButtonProps {
  onCapture: () => void;
  onFileSelect: (file: File) => void;
  onSwitchCamera?: () => void;
  showSwitch?: boolean;
  disabled?: boolean;
  isFlashActive?: boolean;
  onToggleFlash?: () => void;
}

export const CaptureButton: React.FC<CaptureButtonProps> = ({
  onCapture,
  onFileSelect,
  onSwitchCamera,
  showSwitch = false,
  disabled = false,
  isFlashActive = false,
  onToggleFlash,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="flex items-center justify-center gap-6 w-full py-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* 1. Upload Fallback button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
        className="w-11 h-11 rounded-full border border-border/80 bg-card hover:bg-muted text-foreground flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-md"
        title="Upload Image"
      >
        <Upload className="w-5 h-5" />
      </button>

      {/* 2. Main Shutter capture button */}
      <button
        type="button"
        disabled={disabled}
        onClick={onCapture}
        className="relative w-18 h-18 rounded-full bg-white border-[6px] border-blue-500 hover:border-blue-600 shadow-xl shadow-blue-500/20 active:scale-90 hover:scale-105 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none group"
        title="Capture Scan"
      >
        <div className="w-11 h-11 rounded-full bg-blue-500 group-hover:bg-blue-600 transition-colors" />
      </button>

      {/* 3. Switch Camera / Flash toggles */}
      {showSwitch ? (
        <button
          type="button"
          disabled={disabled}
          onClick={onSwitchCamera}
          className="w-11 h-11 rounded-full border border-border/80 bg-card hover:bg-muted text-foreground flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-md"
          title="Switch Camera"
        >
          <SwitchCamera className="w-5 h-5" />
        </button>
      ) : onToggleFlash ? (
        <button
          type="button"
          disabled={disabled}
          onClick={onToggleFlash}
          className={`w-11 h-11 rounded-full border border-border/80 flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-md ${
            isFlashActive ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-card hover:bg-muted text-foreground'
          }`}
          title="Toggle Simulation Flash"
        >
          <Zap className="w-5 h-5" />
        </button>
      ) : (
        <div className="w-11" /> // Spacer to balance layout
      )}
    </div>
  );
};
