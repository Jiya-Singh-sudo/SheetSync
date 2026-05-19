'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ScanLine, ShieldCheck, FileSpreadsheet, Lock, Check, ArrowLeft,
  ChevronRight, Sparkles, Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const permissions = [
  'View and manage spreadsheets that you create with SheetScan',
  'No access to existing spreadsheets or personal Drive files',
  'Never reads email or contacts',
  'Revoke access anytime from Google Account settings',
];

const trust = [
  { icon: Lock, label: 'End-to-end encrypted', desc: 'All data transmitted securely' },
  { icon: ShieldCheck, label: 'SOC 2 compliant', desc: 'Enterprise-grade security' },
  { icon: Globe, label: 'GDPR ready', desc: 'Your data rights protected' },
];

export default function AuthPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = () => {
    setLoading(true);
    setTimeout(() => router.push('/dashboard'), 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-blue-500/8 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full bg-cyan-500/8 blur-3xl" />
      </div>

      {/* Back link */}
      <div className="absolute top-6 left-6">
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to home
        </Link>
      </div>

      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <ScanLine className="w-5 h-5 text-white" />
        </div>
        <span className="text-2xl font-bold">SheetScan</span>
      </div>

      {/* Card */}
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-border/50 bg-card shadow-2xl p-8 relative overflow-hidden">
          {/* Card shimmer */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 via-transparent to-cyan-500/3 pointer-events-none" />

          <div className="relative">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Welcome to SheetScan</h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Sign in with Google to start scanning documents and saving to Google Sheets.
              </p>
            </div>

            {/* Google Sign In */}
            <Button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full h-12 text-base font-medium bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-gray-100 dark:border-slate-600"
              variant="outline"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  Connecting to Google...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <GoogleIcon />
                  Continue with Google
                </div>
              )}
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">What we access</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Permissions */}
            <div className="space-y-3 mb-6">
              {permissions.map((p, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p}</p>
                </div>
              ))}
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-muted/50">
              {trust.map((t, i) => (
                <div key={i} className="text-center">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center mx-auto mb-2">
                    <t.icon className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="text-[10px] font-semibold leading-tight">{t.label}</div>
                  <div className="text-[9px] text-muted-foreground mt-0.5">{t.desc}</div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-muted-foreground text-center mt-4 leading-relaxed">
              By signing in, you agree to our{' '}
              <a href="#" className="text-blue-500 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </div>

        {/* Demo link */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 mx-auto"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Or explore the demo without signing in
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
