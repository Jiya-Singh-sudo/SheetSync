'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, RotateCcw, Copy, FileSpreadsheet, Download, Zap, Check, Upload, FlipHorizontal, ScanLine, ChevronRight, CircleAlert as AlertCircle, Sparkles, X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockOCRTexts } from '@/lib/mock-data';

type ScanState = 'idle' | 'camera' | 'scanning' | 'result' | 'saving' | 'saved';

const detectedFields = [
  { label: 'Document Type', value: 'Invoice' },
  { label: 'Invoice #', value: 'INV-2024-0847' },
  { label: 'Date', value: 'November 15, 2024' },
  { label: 'Total Amount', value: '$8,137.50' },
  { label: 'Vendor', value: 'Alex Morgan' },
];

const confidenceLevel = (score: number) => {
  if (score >= 95) return { label: 'Excellent', color: 'text-green-500' };
  if (score >= 85) return { label: 'Good', color: 'text-blue-500' };
  if (score >= 70) return { label: 'Fair', color: 'text-yellow-500' };
  return { label: 'Low', color: 'text-red-500' };
};

export default function ScannerPage() {
  const [state, setState] = useState<ScanState>('idle');
  const [facing, setFacing] = useState<'user' | 'environment'>('environment');
  const [extracted, setExtracted] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [copied, setCopied] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedSheet, setSelectedSheet] = useState('Business Receipts 2024');
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError('');
    setState('camera');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setCameraError('Camera access denied. Please allow camera permissions or use the upload option.');
      setState('idle');
    }
  }, [facing, stopCamera]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const runMockOCR = () => {
    setState('scanning');
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          const text = mockOCRTexts[Math.floor(Math.random() * mockOCRTexts.length)];
          const conf = 88 + Math.floor(Math.random() * 11);
          setExtracted(text);
          setConfidence(conf);
          setState('result');
          stopCamera();
          return 100;
        }
        return p + 4;
      });
    }, 80);
  };

  const handleCapture = () => runMockOCR();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    runMockOCR();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(extracted).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToSheets = () => {
    setState('saving');
    setTimeout(() => setState('saved'), 2000);
  };

  const handleDownloadCSV = () => {
    const rows = extracted.split('\n').filter(Boolean);
    const csv = rows.map(r => `"${r.replace(/"/g, '""')}"`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scan-result.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRetake = () => {
    setState('idle');
    setExtracted('');
    setConfidence(0);
    setScanProgress(0);
  };

  const cl = confidenceLevel(confidence);

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 gap-4">
      {/* Top controls */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {state === 'idle' && 'Ready to scan a document'}
            {state === 'camera' && 'Position document in frame, then capture'}
            {state === 'scanning' && 'AI is extracting text...'}
            {(state === 'result' || state === 'saving' || state === 'saved') && 'Text extracted successfully'}
          </p>
        </div>
        {(state === 'result' || state === 'saving' || state === 'saved') && (
          <Button variant="outline" size="sm" onClick={handleRetake} className="gap-2">
            <RotateCcw className="w-3.5 h-3.5" />
            New Scan
          </Button>
        )}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
        {/* Left: Camera / Capture */}
        <div className="flex flex-col gap-3 min-h-0">
          <div className="flex-1 rounded-2xl overflow-hidden bg-gray-900 border border-border/50 relative min-h-[300px]">
            {/* Camera view */}
            {state === 'camera' && (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {/* Scan frame overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative w-4/5 h-4/5">
                    <div className="absolute inset-0 border-2 border-white/30 rounded-lg" />
                    {/* Corner brackets */}
                    {[
                      'top-0 left-0 border-t-2 border-l-2',
                      'top-0 right-0 border-t-2 border-r-2',
                      'bottom-0 left-0 border-b-2 border-l-2',
                      'bottom-0 right-0 border-b-2 border-r-2',
                    ].map((c, i) => (
                      <div key={i} className={`absolute w-6 h-6 border-blue-400 rounded-sm ${c}`} />
                    ))}
                    {/* Scan line */}
                    <div className="absolute inset-0 overflow-hidden rounded-lg">
                      <div className="animate-scan-line" />
                    </div>
                  </div>
                </div>
                {/* Camera controls overlay */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button
                    onClick={() => { stopCamera(); setFacing(f => f === 'user' ? 'environment' : 'user'); setTimeout(startCamera, 100); }}
                    className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                    <FlipHorizontal className="w-4 h-4" />
                  </button>
                </div>
                {/* Bottom guidance */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <div className="bg-black/60 backdrop-blur-sm text-white text-xs px-4 py-2 rounded-full">
                    Hold steady — align text within the frame
                  </div>
                </div>
              </>
            )}

            {/* Scanning state */}
            {state === 'scanning' && (
              <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-blue-500/30 flex items-center justify-center">
                    <ScanLine className="w-8 h-8 text-blue-400 animate-pulse" />
                  </div>
                  <svg className="absolute inset-0 w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="36" fill="none" stroke="rgb(59,130,246)" strokeWidth="4"
                      strokeDasharray={`${2 * Math.PI * 36}`}
                      strokeDashoffset={`${2 * Math.PI * 36 * (1 - scanProgress / 100)}`}
                      className="transition-all duration-100"
                    />
                  </svg>
                </div>
                <div className="text-white font-medium">Analyzing text... {scanProgress}%</div>
                <div className="w-48 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-100"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
                <div className="text-white/50 text-xs">AI-powered OCR processing</div>
              </div>
            )}

            {/* Idle state */}
            {state === 'idle' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-6">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-10 h-10 text-blue-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-1">Camera Preview</h3>
                  <p className="text-white/50 text-sm">Start camera or upload an image</p>
                </div>
                {cameraError && (
                  <div className="flex items-start gap-2 bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-xs text-red-300 max-w-xs text-center">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    {cameraError}
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                  <Button onClick={startCamera} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white border-0">
                    <Camera className="w-4 h-4 mr-2" />
                    Open Camera
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </div>
              </div>
            )}

            {/* Result state - show captured image placeholder */}
            {(state === 'result' || state === 'saving' || state === 'saved') && (
              <div className="absolute inset-0">
                <img
                  src="https://images.pexels.com/photos/95916/pexels-photo-95916.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Scanned document"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
                {/* Extracted frame markers */}
                <div className="absolute inset-6 border-2 border-green-400/80 rounded-lg">
                  <div className="absolute -top-1 -left-1 w-3 h-3 bg-green-400 rounded-sm" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-sm" />
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-green-400 rounded-sm" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-sm" />
                </div>
                <div className="absolute top-3 left-3">
                  <div className="bg-green-500 text-white text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" /> Text Captured
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Capture button */}
          {state === 'camera' && (
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 rounded-full border border-border bg-card hover:bg-muted flex items-center justify-center transition-colors"
              >
                <Upload className="w-4 h-4" />
              </button>
              <button
                onClick={handleCapture}
                className="w-16 h-16 rounded-full bg-white border-4 border-blue-500 shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center"
              >
                <div className="w-10 h-10 rounded-full bg-blue-500" />
              </button>
              <button
                onClick={handleCapture}
                className="w-10 h-10 rounded-full border border-border bg-card hover:bg-muted flex items-center justify-center transition-colors"
              >
                <Zap className="w-4 h-4 text-yellow-500" />
              </button>
            </div>
          )}
        </div>

        {/* Right: OCR Results */}
        <div className="flex flex-col gap-3">
          {/* Detected text panel */}
          <div className="flex-1 rounded-2xl border border-border/50 bg-card flex flex-col min-h-[200px]">
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-sm">Detected Text</span>
              </div>
              {state === 'result' || state === 'saving' || state === 'saved' ? (
                <div className="flex items-center gap-2">
                  <div className={`text-xs font-medium ${cl.color}`}>{cl.label}</div>
                  <div className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{confidence}%</div>
                </div>
              ) : null}
            </div>

            {state === 'idle' || state === 'camera' ? (
              <div className="flex-1 flex items-center justify-center text-center p-6">
                <div>
                  <ScanLine className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Extracted text will appear here after scanning</p>
                </div>
              </div>
            ) : state === 'scanning' ? (
              <div className="flex-1 p-4 space-y-2.5">
                {[80, 60, 90, 50, 70, 40].map((w, i) => (
                  <div key={i} className="animate-shimmer h-3 rounded-full bg-muted" style={{ width: `${w}%` }} />
                ))}
              </div>
            ) : (
              <div className="flex-1 overflow-auto p-4">
                <textarea
                  value={extracted}
                  onChange={(e) => setExtracted(e.target.value)}
                  className="w-full h-full min-h-[180px] bg-transparent text-sm font-mono resize-none outline-none text-foreground/90 leading-relaxed"
                  placeholder="Extracted text..."
                />
              </div>
            )}
          </div>

          {/* Detected Fields */}
          {(state === 'result' || state === 'saving' || state === 'saved') && (
            <div className="rounded-2xl border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-semibold">Structured Fields</span>
                <span className="text-xs text-muted-foreground ml-auto bg-muted px-2 py-0.5 rounded-full">AI detected</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {detectedFields.map((field, i) => (
                  <div key={i} className={`p-2.5 rounded-xl bg-muted/50 ${i === detectedFields.length - 1 && detectedFields.length % 2 !== 0 ? 'col-span-2' : ''}`}>
                    <div className="text-[10px] text-muted-foreground mb-0.5">{field.label}</div>
                    <div className="text-xs font-semibold">{field.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          {(state === 'result' || state === 'saving' || state === 'saved') && (
            <div className="space-y-3">
              {/* Sheet selector */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 border border-border/50">
                <FileSpreadsheet className="w-4 h-4 text-teal-500 flex-shrink-0" />
                <select
                  value={selectedSheet}
                  onChange={(e) => setSelectedSheet(e.target.value)}
                  className="flex-1 bg-transparent text-sm outline-none text-foreground"
                >
                  <option>Business Receipts 2024</option>
                  <option>Invoice Tracker</option>
                  <option>Field Notes Log</option>
                </select>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </div>

              {state === 'saved' ? (
                <div className="flex items-center justify-center gap-2 h-10 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm font-medium">
                  <Check className="w-4 h-4" />
                  Saved to {selectedSheet}
                </div>
              ) : (
                <Button
                  onClick={handleSaveToSheets}
                  disabled={state === 'saving'}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg shadow-blue-500/25 h-10"
                >
                  {state === 'saving' ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Saving to Sheets...
                    </>
                  ) : (
                    <>
                      <FileSpreadsheet className="w-4 h-4 mr-2" />
                      Save to Google Sheets
                    </>
                  )}
                </Button>
              )}

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy Text'}
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownloadCSV} className="gap-2">
                  <Download className="w-3.5 h-3.5" />
                  Download CSV
                </Button>
              </div>
            </div>
          )}

          {state === 'idle' && (
            <div className="rounded-2xl border border-dashed border-border bg-transparent p-6 text-center">
              <p className="text-sm text-muted-foreground mb-1">Supports all document types</p>
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {['Invoice', 'Receipt', 'Form', 'Handwritten', 'Label'].map(t => (
                  <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
