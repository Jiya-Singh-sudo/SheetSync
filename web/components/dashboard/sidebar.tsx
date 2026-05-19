'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ScanLine, LayoutDashboard, Camera, FileSpreadsheet, History,
  Settings, ChevronRight, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/scanner', icon: Camera, label: 'Scanner' },
  { href: '/dashboard/sheets', icon: FileSpreadsheet, label: 'Sheets' },
  { href: '/dashboard/history', icon: History, label: 'History' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 h-full flex flex-col border-r border-border/50 bg-card">
      {/* Logo */}
      <div className="p-6 border-b border-border/50">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/30">
            <ScanLine className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold">SheetScan</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
                active
                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <item.icon className={cn('w-4 h-4 transition-colors', active ? 'text-blue-500' : 'text-muted-foreground group-hover:text-foreground')} />
              {item.label}
              {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-blue-500/60" />}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade CTA */}
      <div className="p-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-semibold">Pro Plan</span>
          </div>
          <p className="text-[11px] text-muted-foreground mb-3">Unlimited scans, priority OCR, multiple sheets.</p>
          <button className="w-full text-xs font-semibold py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:opacity-90 transition-opacity">
            Upgrade to Pro
          </button>
        </div>
      </div>
    </aside>
  );
}
