'use client';

import { useState } from 'react';
import { FileSpreadsheet, Plus, RefreshCw, ExternalLink, MoveVertical as MoreVertical, Check, Calendar, Rows3, Zap, Wifi, WifiOff, Trash2, CreditCard as Edit3 } from 'lucide-react';
import { mockSpreadsheets, formatRelativeTime, SpreadsheetConnection } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export default function SheetsPage() {
  const [sheets, setSheets] = useState<SpreadsheetConnection[]>(mockSpreadsheets);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const handleSync = (id: string) => {
    setSyncing(id);
    setTimeout(() => {
      setSheets(prev => prev.map(s => s.id === id
        ? { ...s, lastSync: new Date(), rowsAdded: s.rowsAdded + Math.floor(Math.random() * 5) + 1 }
        : s
      ));
      setSyncing(null);
    }, 2000);
  };

  const handleToggleAutoSync = (id: string) => {
    setSheets(prev => prev.map(s => s.id === id ? { ...s, autoSync: !s.autoSync } : s));
  };

  const handleDelete = (id: string) => {
    setSheets(prev => prev.filter(s => s.id !== id));
  };

  const handleCreate = () => {
    setCreating(true);
    setTimeout(() => {
      const newSheet: SpreadsheetConnection = {
        id: Date.now().toString(),
        name: `New Spreadsheet ${sheets.length + 1}`,
        lastSync: new Date(),
        rowsAdded: 0,
        autoSync: false,
        url: 'https://docs.google.com/spreadsheets',
      };
      setSheets(prev => [...prev, newSheet]);
      setCreating(false);
    }, 1500);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Google Sheets</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage connected spreadsheets and sync settings.</p>
        </div>
        <Button
          onClick={handleCreate}
          disabled={creating}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg shadow-blue-500/25"
        >
          {creating ? (
            <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Creating...</>
          ) : (
            <><Plus className="w-4 h-4 mr-2" /> Create New Sheet</>
          )}
        </Button>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Connected', value: sheets.length, icon: FileSpreadsheet, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Auto-sync enabled', value: sheets.filter(s => s.autoSync).length, icon: Wifi, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Total rows', value: sheets.reduce((a, b) => a + b.rowsAdded, 0), icon: Rows3, color: 'text-teal-500', bg: 'bg-teal-500/10' },
        ].map((s, i) => (
          <div key={i} className="p-4 rounded-2xl border border-border/50 bg-card flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div>
              <div className="text-xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Sheets list */}
      <div className="space-y-4">
        {sheets.map((sheet) => (
          <div key={sheet.id} className="rounded-2xl border border-border/50 bg-card p-5 hover:shadow-lg transition-all duration-200">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                <FileSpreadsheet className="w-6 h-6 text-teal-500" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{sheet.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        Last sync: {formatRelativeTime(sheet.lastSync)}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Rows3 className="w-3 h-3" />
                        {sheet.rowsAdded} rows added
                      </span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2">
                        <Edit3 className="w-4 h-4" /> Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2" onClick={() => window.open(sheet.url, '_blank')}>
                        <ExternalLink className="w-4 h-4" /> Open in Google Sheets
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive" onClick={() => handleDelete(sheet.id)}>
                        <Trash2 className="w-4 h-4" /> Disconnect
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Actions row */}
                <div className="flex items-center gap-3 mt-4 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2 h-8 text-xs"
                    onClick={() => handleSync(sheet.id)}
                    disabled={syncing === sheet.id}
                  >
                    {syncing === sheet.id ? (
                      <><RefreshCw className="w-3 h-3 animate-spin" /> Syncing...</>
                    ) : (
                      <><RefreshCw className="w-3 h-3" /> Sync Now</>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2 h-8 text-xs"
                    onClick={() => window.open(sheet.url, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3" /> Open Sheet
                  </Button>

                  <div className="flex items-center gap-2 ml-auto">
                    {sheet.autoSync ? (
                      <Wifi className="w-3.5 h-3.5 text-green-500" />
                    ) : (
                      <WifiOff className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                    <span className="text-xs text-muted-foreground">Auto-sync</span>
                    <Switch
                      checked={sheet.autoSync}
                      onCheckedChange={() => handleToggleAutoSync(sheet.id)}
                      className="scale-75"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sync animation */}
            {syncing === sheet.id && (
              <div className="mt-4 h-1 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-shimmer" />
              </div>
            )}
          </div>
        ))}

        {sheets.length === 0 && (
          <div className="py-16 text-center">
            <FileSpreadsheet className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No spreadsheets connected</h3>
            <p className="text-sm text-muted-foreground mb-4">Create a new spreadsheet to start saving scan results.</p>
            <Button onClick={handleCreate} className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
              <Plus className="w-4 h-4 mr-2" /> Create First Sheet
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
