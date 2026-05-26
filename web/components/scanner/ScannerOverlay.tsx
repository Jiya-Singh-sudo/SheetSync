import React from 'react';
import { ScanLine, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScannerOverlayProps {
  progress: number;
  onCancel: () => void;
  imageSrc?: string | null;
}

export const ScannerOverlay: React.FC<ScannerOverlayProps> = ({
  progress,
  onCancel,
  imageSrc,
}) => {
  // SVG circular progress maths
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress / 100);

  return (
    <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center p-6 gap-6 z-20 animate-fade-in">
      {/* 1. Behind Overlay: Captured Image freeze preview */}
      {imageSrc && (
        <div className="absolute inset-0 z-0 opacity-40 overflow-hidden flex items-center justify-center">
          <img
            src={imageSrc}
            alt="Captured document background"
            className="w-full h-full object-cover blur-sm"
          />
        </div>
      )}

      {/* 2. Overlaid content */}
      <div className="relative z-10 flex flex-col items-center gap-6 max-w-xs w-full text-center">
        {/* Dynamic circular loader */}
        <div className="relative w-24 h-24 flex items-center justify-center bg-slate-900/90 rounded-full border border-white/10 shadow-xl">
          <ScanLine className="absolute w-8 h-8 text-blue-400 animate-pulse" />
          
          <svg className="absolute w-24 h-24 -rotate-90" viewBox="0 0 100 100">
            {/* Outer track */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="5"
            />
            {/* Active progress */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="rgb(59, 130, 246)"
              strokeWidth="5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-150 ease-out"
            />
          </svg>
          
          {/* Centered percentage badge */}
          <span className="absolute bottom-2 text-[10px] text-blue-400 font-semibold bg-blue-500/10 px-1.5 py-0.5 rounded-full border border-blue-500/20">
            {progress}%
          </span>
        </div>

        <div className="space-y-1">
          <h4 className="text-white font-medium text-base">Reading Document</h4>
          <p className="text-slate-400 text-xs leading-relaxed">
            AI is analyzing pixels and extracting layout structure...
          </p>
        </div>

        {/* Progress bar utility */}
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Laser line animation simulator in the frame */}
        <div className="absolute -top-32 -left-12 -right-12 h-64 border border-dashed border-blue-500/10 pointer-events-none rounded-xl overflow-hidden">
          <div className="animate-scan-line" />
        </div>

        <Button
          variant="outline"
          onClick={onCancel}
          className="border-white/10 hover:bg-white/5 hover:text-white text-xs px-4 py-2 mt-4 text-slate-300 gap-1.5"
        >
          <X className="w-3.5 h-3.5" />
          Cancel Scan
        </Button>
      </div>
    </div>
  );
};
