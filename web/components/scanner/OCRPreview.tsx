import React, { useState } from 'react';
import { Copy, Check, RotateCcw, FileSpreadsheet, Download, Zap, Sparkles, ChevronRight, AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OCRPreviewProps {
  text: string;
  onChangeText: (text: string) => void;
  confidence: number;
  imageSrc: string; // Object URL
  onRetake: () => void;
  onSaveToSheets: () => void;
  isSaving: boolean;
  isSaved: boolean;
  saveError: string | null;
  sheetName: string;
}

const getConfidenceMeta = (score: number) => {
  if (score >= 90) return { label: 'Excellent', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
  if (score >= 75) return { label: 'Good', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' };
  if (score >= 50) return { label: 'Fair', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
  return { label: 'Low Accuracy', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' };
};

export const OCRPreview: React.FC<OCRPreviewProps> = ({
  text,
  onChangeText,
  confidence,
  imageSrc,
  onRetake,
  onSaveToSheets,
  isSaving,
  isSaved,
  saveError,
  sheetName,
}) => {
  const [copied, setCopied] = useState(false);
  const meta = getConfidenceMeta(confidence);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCSV = () => {
    const rows = text.split('\n').filter(Boolean);
    const csv = rows.map(r => `"${r.replace(/"/g, '""')}"`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scan-result.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full h-full min-h-0">
      {/* Left side: Freeze Capture thumbnail with status */}
      <div className="w-full lg:w-[40%] flex flex-col gap-4">
        <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-border/50 bg-slate-950 flex items-center justify-center shadow-lg">
          <img
            src={imageSrc}
            alt="Captured document page"
            className="w-full h-full object-cover"
          />
          {/* Decorative frame overlay */}
          <div className="absolute inset-4 border-2 border-emerald-500/30 rounded-lg pointer-events-none">
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-emerald-500 rounded-sm" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-sm" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-emerald-500 rounded-sm" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-sm" />
          </div>
          <div className="absolute top-3 left-3">
            <div className="bg-emerald-500 text-white text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 shadow-md">
              <Check className="w-3 h-3" /> Image Captured
            </div>
          </div>
        </div>

        {/* Retake Button */}
        <Button 
          variant="outline" 
          onClick={onRetake}
          className="w-full border-border/80 hover:bg-muted text-sm gap-2 h-11"
        >
          <RotateCcw className="w-4 h-4" />
          Retake Document Scan
        </Button>
      </div>

      {/* Right side: OCR output details */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <div className="flex-1 rounded-2xl border border-border/50 bg-card flex flex-col min-h-[250px] shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-blue-500" />
              <span className="font-semibold text-sm">Extracted Text</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${meta.color}`}>
                {meta.label} ({confidence}%)
              </span>
            </div>
          </div>

          {/* Text Area input */}
          <div className="flex-1 p-4">
            <textarea
              value={text}
              onChange={(e) => onChangeText(e.target.value)}
              className="w-full h-full min-h-[200px] bg-transparent text-sm font-mono resize-none outline-none text-foreground/90 leading-relaxed border-0 p-0 focus:ring-0"
              placeholder="Extracted text will appear here..."
            />
          </div>
        </div>

        {/* Google Sheets Sync — REAL integration */}
        <div className="space-y-3">
          {/* Sheet target indicator */}
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/40 border border-border/50">
            <FileSpreadsheet className="w-4.5 h-4.5 text-emerald-500 flex-shrink-0" />
            <span className="flex-1 text-sm font-medium text-foreground truncate">
              {sheetName}
            </span>
            <span className="text-[10px] text-muted-foreground px-2 py-0.5 rounded-full bg-muted border border-border/50">
              Google Drive
            </span>
          </div>

          {/* Error display */}
          {saveError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{saveError}</span>
            </div>
          )}

          {/* Sync status button */}
          {isSaved ? (
            <div className="flex items-center justify-center gap-2 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
              <Check className="w-4 h-4" />
              Synced to {sheetName} in your Google Drive
            </div>
          ) : (
            <Button
              onClick={onSaveToSheets}
              disabled={isSaving || !text.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-lg shadow-blue-500/20 h-11 text-sm font-medium"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving to Google Sheets...
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Save to Google Sheets
                </>
              )}
            </Button>
          )}

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2 h-10 text-xs">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied to clipboard' : 'Copy Plain Text'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadCSV} className="gap-2 h-10 text-xs">
              <Download className="w-3.5 h-3.5" />
              Export as CSV
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
