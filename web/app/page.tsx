'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Camera, FileSpreadsheet, Zap, History, Smartphone, ShieldCheck,
  ChevronRight, Check, Star, ArrowRight, ScanLine, Sparkles, Globe,
  Menu, X, Moon, Sun
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const features = [
  {
    icon: Camera,
    title: 'Live Camera OCR',
    desc: 'Point your camera at any text and watch it get extracted in real time with AI precision.',
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
  },
  {
    icon: Sparkles,
    title: 'AI Text Detection',
    desc: 'Advanced AI understands handwriting, printed text, tables, and structured forms.',
    color: 'from-cyan-500 to-teal-500',
    bg: 'bg-cyan-500/10',
    iconColor: 'text-cyan-500',
  },
  {
    icon: FileSpreadsheet,
    title: 'Google Sheets Sync',
    desc: 'Extracted data flows directly into your Google Sheets with one click or automatically.',
    color: 'from-teal-500 to-green-500',
    bg: 'bg-teal-500/10',
    iconColor: 'text-teal-500',
  },
  {
    icon: History,
    title: 'Scan History',
    desc: 'Every scan is saved with preview, timestamp, and sync status for easy retrieval.',
    color: 'from-orange-500 to-amber-500',
    bg: 'bg-orange-500/10',
    iconColor: 'text-orange-500',
  },
  {
    icon: Smartphone,
    title: 'Mobile Optimized',
    desc: 'Built mobile-first for seamless scanning on any device — phone, tablet, or desktop.',
    color: 'from-rose-500 to-pink-500',
    bg: 'bg-rose-500/10',
    iconColor: 'text-rose-500',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Google OAuth',
    desc: 'We only access spreadsheets created by this app. Your data stays yours, always.',
    color: 'from-green-500 to-emerald-500',
    bg: 'bg-green-500/10',
    iconColor: 'text-green-500',
  },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Accountant',
    text: 'SheetScan cut my receipt processing time from hours to minutes. The AI accuracy is outstanding.',
    stars: 5,
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    name: 'Marcus Williams',
    role: 'Field Manager',
    text: 'I scan inspection forms in the field and they\'re in our spreadsheet before I\'m back in the truck.',
    stars: 5,
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    name: 'Priya Patel',
    role: 'Small Business Owner',
    text: 'Replaced 3 different apps with SheetScan. The Google Sheets integration is seamless.',
    stars: 5,
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
];

const steps = [
  { num: '01', title: 'Sign in with Google', desc: 'Quick OAuth login — no passwords to remember.' },
  { num: '02', title: 'Point & Scan', desc: 'Open camera, aim at text, tap capture.' },
  { num: '03', title: 'Review & Edit', desc: 'AI extracts text. Edit if needed.' },
  { num: '04', title: 'Save to Sheets', desc: 'One click syncs data to Google Sheets.' },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-blue-500/8 blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] rounded-full bg-cyan-500/8 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-teal-500/6 blur-3xl" />
      </div>

      {/* Navbar */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/90 backdrop-blur-xl shadow-sm border-b border-border/50' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <ScanLine className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold">SheetScan</span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              {['Features', 'How it Works', 'Pricing', 'Testimonials'].map(item => (
                <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {item}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              )}
              <Link href="/auth" className="hidden md:block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Sign in
              </Link>
              <Link href="/auth">
                <Button size="sm" className="hidden md:flex bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-lg shadow-blue-500/25">
                  Get Started Free
                </Button>
              </Link>
              <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2">
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border px-6 py-4 space-y-3">
            {['Features', 'How it Works', 'Pricing', 'Testimonials'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="block text-sm text-muted-foreground hover:text-foreground" onClick={() => setMenuOpen(false)}>
                {item}
              </a>
            ))}
            <Link href="/auth" onClick={() => setMenuOpen(false)}>
              <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
                Get Started Free
              </Button>
            </Link>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 inline" />
              AI-Powered Document Intelligence
            </Badge>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-none mb-6">
              Scan Text with AI
              <br />
              <span className="gradient-text">& Save to Google Sheets</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Use your camera to capture text instantly and sync structured data into your
              Google Drive spreadsheets. Invoices, receipts, forms — all handled automatically.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/auth">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-xl shadow-blue-500/30 transition-all duration-200 hover:scale-105">
                  Start Scanning Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base hover:bg-muted transition-all duration-200">
                  View Demo
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
              {[
                { val: '10,000+', label: 'Documents scanned' },
                { val: '98%', label: 'OCR accuracy' },
                { val: '< 3s', label: 'Average scan time' },
                { val: 'Free', label: 'To get started' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-bold text-foreground">{s.val}</div>
                  <div>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div className="mt-20 relative">
            <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-card">
              {/* Fake browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-4 h-6 rounded-md bg-background/80 flex items-center justify-center text-xs text-muted-foreground">
                  sheetscan.app/scanner
                </div>
              </div>
              {/* App preview */}
              <div className="grid grid-cols-2 min-h-[360px]">
                {/* Camera side */}
                <div className="relative bg-gray-900 overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/95916/pexels-photo-95916.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Document being scanned"
                    className="w-full h-full object-cover opacity-70"
                  />
                  {/* Scan overlay */}
                  <div className="absolute inset-0">
                    <div className="absolute inset-8 border-2 border-blue-400/60 rounded-lg" />
                    <div className="absolute inset-8 overflow-hidden rounded-lg">
                      <div className="animate-scan-line" />
                    </div>
                    {/* Corner markers */}
                    {['top-8 left-8', 'top-8 right-8', 'bottom-8 left-8', 'bottom-8 right-8'].map((pos, i) => (
                      <div key={i} className={`absolute ${pos} w-4 h-4`}>
                        <div className={`absolute w-full h-0.5 bg-blue-400 ${i < 2 ? 'top-0' : 'bottom-0'}`} />
                        <div className={`absolute h-full w-0.5 bg-blue-400 ${i % 2 === 0 ? 'left-0' : 'right-0'}`} />
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                    <div className="bg-blue-500 text-white text-xs px-3 py-1.5 rounded-full font-medium animate-pulse">
                      Scanning...
                    </div>
                  </div>
                </div>

                {/* OCR result side */}
                <div className="p-6 bg-card space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">Text Detected</span>
                    <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">97% confidence</span>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 font-mono text-xs leading-relaxed text-foreground/80 space-y-1">
                    <div className="font-semibold text-foreground">INVOICE #INV-2024-0847</div>
                    <div>Date: November 15, 2024</div>
                    <div>Due: December 15, 2024</div>
                    <div className="mt-2 pt-2 border-t border-border/50">Web Development: $5,000.00</div>
                    <div>UI/UX Design: $1,900.00</div>
                    <div className="font-semibold text-foreground mt-2 pt-2 border-t border-border/50">Total: $8,137.50</div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xs text-blue-600 dark:text-blue-400 font-medium">
                      <FileSpreadsheet className="w-3 h-3 mr-1.5" />
                      Save to Sheets
                    </div>
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-green-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Glow */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-teal-500/10 blur-3xl" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
              Features
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Everything you need to digitize text</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From camera capture to spreadsheet row — the entire workflow in one seamless app.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="group relative p-6 rounded-2xl border border-border/50 bg-card hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 cursor-default">
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon className={`w-6 h-6 ${f.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
              How it Works
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Four steps to digital clarity</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] right-0 h-px bg-gradient-to-r from-blue-500/50 to-transparent" />
                )}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
                  <span className="text-white font-bold text-lg">{step.num}</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
              Testimonials
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Loved by teams worldwide</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="p-6 rounded-2xl border border-border/50 bg-card hover:shadow-xl transition-all duration-300">
                <div className="flex mb-3">
                  {[...Array(t.stars)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-teal-500/10 border border-blue-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 animate-gradient" />
            <div className="relative">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                Ready to scan smarter?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
                Join thousands of professionals who save hours every week with SheetScan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth">
                  <Button size="lg" className="h-12 px-8 text-base bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-xl shadow-blue-500/30">
                    Start Free Today
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                    Explore Demo
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-muted-foreground mt-4">No credit card required. Free forever for personal use.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <ScanLine className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold">SheetScan</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 SheetScan. AI-powered document scanning.</p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
