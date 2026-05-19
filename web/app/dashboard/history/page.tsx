'use client';

import { useState } from 'react';
import { Search, Filter, Trash2, CircleCheck as CheckCircle, Clock, CircleAlert as AlertCircle, FileSpreadsheet, Download, Copy, Check, ScanLine, ChevronDown, X } from 'lucide-react';
import { mockScanHistory, formatRelativeTime, ScanHistoryItem } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const statusConfig = {
  synced: { label: 'Synced', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-500/10 border-green-500/20', icon: CheckCircle },
  pending: { label: 'Pending', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', icon: Clock },
  failed: { label: 'Failed', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: AlertCircle },
};

const typeColors: Record<string, string> = {
  invoice: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  receipt: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
  form: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  handwritten: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  label: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
  document: 'bg-muted text-muted-foreground',
};

export default function HistoryPage() {
  const [items, setItems] = useState<ScanHistoryItem[]>(mockScanHistory);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'synced' | 'pending' | 'failed'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = items.filter(item => {
    const matchSearch = !search || item.text.toLowerCase().includes(search.toLowerCase()) ||
      item.sheetName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || item.syncStatus === filter;
    return matchSearch && matchFilter;
  });

  const handleDelete = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Scan History</h2>
          <p className="text-sm text-muted-foreground mt-1">{items.length} scans total</p>
        </div>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search scans..."
            className="pl-9 h-10"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {(['all', 'synced', 'pending', 'failed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors capitalize ${
                filter === f
                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {search && (
        <p className="text-sm text-muted-foreground">
          Showing {filtered.length} of {items.length} scans for "{search}"
        </p>
      )}

      {/* History list */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const status = statusConfig[item.syncStatus];
          const isExpanded = expanded === item.id;

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-border/50 bg-card overflow-hidden hover:shadow-md transition-all duration-200"
            >
              <div
                className="flex items-center gap-4 p-4 cursor-pointer"
                onClick={() => setExpanded(isExpanded ? null : item.id)}
              >
                {/* Thumbnail */}
                <img
                  src={item.thumbnail}
                  alt="scan"
                  className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${typeColors[item.type]}`}>
                      {item.type}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${status.bg} ${status.color}`}>
                      <status.icon className="w-2.5 h-2.5" />
                      {status.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground ml-auto">{item.confidence}% confidence</span>
                  </div>
                  <p className="text-sm font-medium line-clamp-1">{item.text.split('\n')[0]}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                    <FileSpreadsheet className="w-3 h-3" />
                    {item.sheetName}
                    <span>·</span>
                    {formatRelativeTime(item.timestamp)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleCopy(item.id, item.text); }}
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                    title="Copy text"
                  >
                    {copied === item.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-colors"
                    title="Delete scan"
                  >
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div className="border-t border-border/50 p-4 bg-muted/20">
                  <div className="flex items-center gap-2 mb-3">
                    <ScanLine className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-xs font-medium">Full extracted text</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <pre className="text-xs font-mono bg-card border border-border/50 rounded-xl p-4 whitespace-pre-wrap text-foreground/80 max-h-48 overflow-auto">
                    {item.text}
                  </pre>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="gap-2 h-8 text-xs" onClick={() => handleCopy(item.id, item.text)}>
                      {copied === item.id ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                      {copied === item.id ? 'Copied' : 'Copy'}
                    </Button>
                    {item.syncStatus === 'failed' && (
                      <Button size="sm" className="gap-2 h-8 text-xs bg-blue-500 text-white border-0">
                        <FileSpreadsheet className="w-3 h-3" /> Retry Sync
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <ScanLine className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No scans found</h3>
            <p className="text-sm text-muted-foreground">
              {search ? `No results for "${search}"` : 'Your scan history will appear here.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
