'use client';

import Link from 'next/link';
import { Camera, FileSpreadsheet, TrendingUp, Zap, ArrowRight, Clock, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react';
import { mockStats, mockScanHistory, mockSpreadsheets, formatRelativeTime } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const statCards = [
  { label: 'Total Scans', value: mockStats.totalScans.toLocaleString(), change: '+12%', icon: Camera, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { label: 'This Week', value: mockStats.thisWeek.toString(), change: '+3 today', icon: TrendingUp, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
  { label: 'Rows Synced', value: mockStats.rowsSynced.toLocaleString(), change: '+47 today', icon: FileSpreadsheet, color: 'text-teal-500', bg: 'bg-teal-500/10' },
  { label: 'Avg Confidence', value: `${mockStats.avgConfidence}%`, change: 'AI accuracy', icon: Zap, color: 'text-orange-500', bg: 'bg-orange-500/10' },
];

const statusConfig = {
  synced: { label: 'Synced', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-500/10', icon: CheckCircle },
  pending: { label: 'Pending', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-500/10', icon: Clock },
  failed: { label: 'Failed', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-500/10', icon: AlertCircle },
};

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Good morning, Alex</h2>
          <p className="text-sm text-muted-foreground mt-1">Here's what's happening with your scans today.</p>
        </div>
        <Link href="/dashboard/scanner">
          <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg shadow-blue-500/25 hover:opacity-90 transition-opacity">
            <Camera className="w-4 h-4 mr-2" />
            New Scan
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div key={i} className="p-5 rounded-2xl border border-border/50 bg-card hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
              </div>
              <span className="text-xs text-muted-foreground">{stat.change}</span>
            </div>
            <div className="text-2xl font-bold mb-0.5">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Scans */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent Scans</h3>
            <Link href="/dashboard/history">
              <button className="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1 transition-colors">
                View all <ArrowRight className="w-3 h-3" />
              </button>
            </Link>
          </div>
          <div className="space-y-3">
            {mockScanHistory.slice(0, 4).map((scan) => {
              const status = statusConfig[scan.syncStatus];
              return (
                <div key={scan.id} className="flex items-center gap-4 p-4 rounded-2xl border border-border/50 bg-card hover:shadow-md transition-all duration-200 cursor-pointer group">
                  <img
                    src={scan.thumbnail}
                    alt="scan"
                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{scan.text.split('\n')[0]}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{scan.sheetName}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>
                      <status.icon className="w-2.5 h-2.5" />
                      {status.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{formatRelativeTime(scan.timestamp)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Connected Sheets */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Connected Sheets</h3>
            <Link href="/dashboard/sheets">
              <button className="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1 transition-colors">
                Manage <ArrowRight className="w-3 h-3" />
              </button>
            </Link>
          </div>
          <div className="space-y-3">
            {mockSpreadsheets.map((sheet) => (
              <div key={sheet.id} className="p-4 rounded-2xl border border-border/50 bg-card hover:shadow-md transition-all duration-200">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                    <FileSpreadsheet className="w-4 h-4 text-teal-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-tight line-clamp-1">{sheet.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{sheet.rowsAdded} rows · {formatRelativeTime(sheet.lastSync)}</p>
                  </div>
                  {sheet.autoSync && (
                    <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-1.5" title="Auto-sync on" />
                  )}
                </div>
              </div>
            ))}

            <Link href="/dashboard/sheets">
              <div className="p-4 rounded-2xl border border-dashed border-border bg-transparent hover:bg-muted/50 transition-colors cursor-pointer text-center">
                <p className="text-xs text-muted-foreground">+ Connect new spreadsheet</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: '/dashboard/scanner', icon: Camera, title: 'Scan Document', desc: 'Capture text with camera', color: 'from-blue-500 to-cyan-500', shadow: 'shadow-blue-500/25' },
          { href: '/dashboard/sheets', icon: FileSpreadsheet, title: 'Manage Sheets', desc: 'View and sync spreadsheets', color: 'from-teal-500 to-green-500', shadow: 'shadow-teal-500/25' },
          { href: '/dashboard/history', icon: Clock, title: 'View History', desc: 'Browse all past scans', color: 'from-orange-500 to-amber-500', shadow: 'shadow-orange-500/25' },
        ].map((action, i) => (
          <Link key={i} href={action.href}>
            <div className="p-5 rounded-2xl border border-border/50 bg-card hover:shadow-xl transition-all duration-200 cursor-pointer group">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 shadow-md ${action.shadow} group-hover:scale-110 transition-transform`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <div className="font-semibold text-sm mb-1">{action.title}</div>
              <div className="text-xs text-muted-foreground">{action.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
