'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { User, FileSpreadsheet, ScanLine, Bell, Moon, Sun, Monitor, LogOut, ChevronRight, Check, Shield, Zap, FileSliders as Sliders, Globe } from 'lucide-react';
import { mockUser, mockSpreadsheets } from '@/lib/mock-data';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

function SettingRow({ icon: Icon, iconColor, label, description, control }: {
  icon: React.ElementType;
  iconColor: string;
  label: string;
  description?: string;
  control: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 py-4">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconColor}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{label}</div>
        {description && <div className="text-xs text-muted-foreground mt-0.5">{description}</div>}
      </div>
      <div className="flex-shrink-0">{control}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
      <div className="px-5 py-3 border-b border-border/50 bg-muted/30">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</h3>
      </div>
      <div className="px-5 divide-y divide-border/50">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({ syncComplete: true, scanFailed: true, weeklyReport: false });
  const [ocrSettings, setOcrSettings] = useState({ language: 'en', autoDetect: true, handwriting: true, tables: true });
  const [defaultSheet, setDefaultSheet] = useState(mockSpreadsheets[0].id);
  const [disconnecting, setDisconnecting] = useState(false);

  const handleDisconnect = () => {
    setDisconnecting(true);
    setTimeout(() => setDisconnecting(false), 2000);
  };

  const themeOptions = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold">Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and app preferences.</p>
      </div>

      {/* Account */}
      <Section title="Account">
        <div className="py-5">
          <div className="flex items-center gap-4">
            <img src={mockUser.avatar} alt={mockUser.name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-border" />
            <div className="flex-1">
              <div className="font-semibold">{mockUser.name}</div>
              <div className="text-sm text-muted-foreground">{mockUser.email}</div>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">Google Connected</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDisconnect}
              disabled={disconnecting}
              className="gap-2 text-destructive border-destructive/20 hover:bg-destructive/10"
            >
              <LogOut className="w-3.5 h-3.5" />
              {disconnecting ? 'Disconnecting...' : 'Disconnect'}
            </Button>
          </div>
        </div>
        <SettingRow
          icon={GoogleIcon}
          iconColor="bg-blue-500/10 text-blue-500"
          label="Google Account"
          description="Connected for Sheets access and sign-in"
          control={
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Active</span>
            </div>
          }
        />
        <SettingRow
          icon={Shield}
          iconColor="bg-green-500/10 text-green-500"
          label="Permissions"
          description="Only spreadsheets created by SheetScan"
          control={
            <button className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600">
              Review <ChevronRight className="w-3 h-3" />
            </button>
          }
        />
      </Section>

      {/* OCR Settings */}
      <Section title="OCR & Scanner">
        <SettingRow
          icon={Globe}
          iconColor="bg-blue-500/10 text-blue-500"
          label="Primary Language"
          description="Language used for text recognition"
          control={
            <select
              value={ocrSettings.language}
              onChange={(e) => setOcrSettings(prev => ({ ...prev, language: e.target.value }))}
              className="text-sm bg-muted rounded-lg px-2.5 py-1.5 outline-none border border-border/50"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="zh">Chinese</option>
            </select>
          }
        />
        <SettingRow
          icon={Zap}
          iconColor="bg-orange-500/10 text-orange-500"
          label="Auto-detect Language"
          description="Automatically identify document language"
          control={<Switch checked={ocrSettings.autoDetect} onCheckedChange={(v) => setOcrSettings(p => ({ ...p, autoDetect: v }))} />}
        />
        <SettingRow
          icon={ScanLine}
          iconColor="bg-cyan-500/10 text-cyan-500"
          label="Handwriting Recognition"
          description="Enable AI handwriting detection"
          control={<Switch checked={ocrSettings.handwriting} onCheckedChange={(v) => setOcrSettings(p => ({ ...p, handwriting: v }))} />}
        />
        <SettingRow
          icon={Sliders}
          iconColor="bg-teal-500/10 text-teal-500"
          label="Table Detection"
          description="Recognize and preserve table structure"
          control={<Switch checked={ocrSettings.tables} onCheckedChange={(v) => setOcrSettings(p => ({ ...p, tables: v }))} />}
        />
      </Section>

      {/* Spreadsheet preferences */}
      <Section title="Spreadsheet Preferences">
        <SettingRow
          icon={FileSpreadsheet}
          iconColor="bg-teal-500/10 text-teal-500"
          label="Default Spreadsheet"
          description="Where new scans are saved by default"
          control={
            <select
              value={defaultSheet}
              onChange={(e) => setDefaultSheet(e.target.value)}
              className="text-sm bg-muted rounded-lg px-2.5 py-1.5 outline-none border border-border/50 max-w-[160px]"
            >
              {mockSpreadsheets.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          }
        />
      </Section>

      {/* Notifications */}
      <Section title="Notifications">
        <SettingRow
          icon={Bell}
          iconColor="bg-blue-500/10 text-blue-500"
          label="Sync Complete"
          description="Notify when scans sync to Sheets"
          control={<Switch checked={notifications.syncComplete} onCheckedChange={(v) => setNotifications(p => ({ ...p, syncComplete: v }))} />}
        />
        <SettingRow
          icon={Bell}
          iconColor="bg-red-500/10 text-red-500"
          label="Sync Failed"
          description="Alert on sync failures"
          control={<Switch checked={notifications.scanFailed} onCheckedChange={(v) => setNotifications(p => ({ ...p, scanFailed: v }))} />}
        />
        <SettingRow
          icon={Bell}
          iconColor="bg-orange-500/10 text-orange-500"
          label="Weekly Report"
          description="Summary of weekly scan activity"
          control={<Switch checked={notifications.weeklyReport} onCheckedChange={(v) => setNotifications(p => ({ ...p, weeklyReport: v }))} />}
        />
      </Section>

      {/* Theme */}
      <Section title="Appearance">
        <div className="py-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium">Theme</span>
          </div>
          <div className="flex gap-2">
            {themeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                  theme === opt.value
                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400'
                    : 'border-border hover:bg-muted'
                }`}
              >
                <opt.icon className="w-4 h-4" />
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* Danger zone */}
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
        <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-3">Danger Zone</h3>
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-medium">Delete account & data</div>
            <div className="text-xs text-muted-foreground">Permanently delete your SheetScan account and all scan history.</div>
          </div>
          <Button variant="outline" size="sm" className="text-destructive border-destructive/20 hover:bg-destructive/10 flex-shrink-0">
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}
