'use client';

import { useState, useEffect } from 'react';
import { Settings, User, Shield, Sliders, Moon, Sun, Save, Check } from 'lucide-react';
import { useAuth } from '@/hooks/auth/use-auth';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import { cn } from '@/lib/utils/cn';
import { getStoredSettings, saveStoredSettings, SystemSettings } from '@/services/settings/settings-service';

export function SettingsView() {
  const { user, isAuthEnabled } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const [settings, setSettings] = useState<SystemSettings>(getStoredSettings());

  useEffect(() => {
    setSettings(getStoredSettings());
  }, []);

  const isDarkMode = resolvedTheme === 'dark' || theme === 'dark';

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredSettings(settings);
    toast.success('CRM System Preferences saved to persistent storage!');
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 space-y-4 overflow-y-auto scrollbar-thin pr-1 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3 flex-shrink-0">
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-500" />
            CRM Settings & System Preferences
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage system configurations, user security, data preferences, and theme.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white transition-colors shadow-xs cursor-pointer"
        >
          <Save className="h-4 w-4" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: User Profile & Role */}
        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-foreground flex items-center gap-2 border-b border-border/40 pb-2.5">
            <User className="h-4 w-4 text-blue-500" />
            Account Profile & Active Role
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-foreground">Full Name</label>
              <input
                type="text"
                value={settings.userName}
                onChange={(e) => setSettings((prev) => ({ ...prev, userName: e.target.value }))}
                className="w-full mt-1 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs text-foreground focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-foreground">Email Address</label>
              <input
                type="email"
                value={settings.userEmail}
                onChange={(e) => setSettings((prev) => ({ ...prev, userEmail: e.target.value }))}
                className="w-full mt-1 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs text-foreground focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-foreground">Assigned Role</label>
              <select
                value={settings.userRole}
                onChange={(e) => setSettings((prev) => ({ ...prev, userRole: e.target.value as any }))}
                className="w-full mt-1 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs text-foreground focus:outline-none cursor-pointer"
              >
                <option value="Admin">Admin (Full Access & Customer Management)</option>
                <option value="Manager">Manager (Edit & View Access)</option>
                <option value="Viewer">Viewer (Read-Only Mode)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card 2: Security & Authentication */}
        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-foreground flex items-center gap-2 border-b border-border/40 pb-2.5">
            <Shield className="h-4 w-4 text-emerald-500" />
            Security & Authentication Policy
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/60">
              <div>
                <h4 className="text-xs font-semibold text-foreground">JWT Session Refresh</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">Auto-refreshes token every 12 minutes</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-500 text-[10px] font-bold">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/60">
              <div>
                <h4 className="text-xs font-semibold text-foreground">Authentication System</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {isAuthEnabled ? 'Backend API Enabled' : 'Local Demo Mode'}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-500 text-[10px] font-bold">
                {isAuthEnabled ? 'OAuth2 / Bearer' : 'Mock Admin Session'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Data & Export Preferences */}
        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-foreground flex items-center gap-2 border-b border-border/40 pb-2.5">
            <Sliders className="h-4 w-4 text-purple-500" />
            Data & Table Preferences
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-foreground">Default Page Size</label>
              <select
                value={settings.pageSize}
                onChange={(e) => setSettings((prev) => ({ ...prev, pageSize: Number(e.target.value) }))}
                className="w-full mt-1 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs text-foreground focus:outline-none cursor-pointer"
              >
                <option value={8}>8 records per page (Default)</option>
                <option value={15}>15 records per page</option>
                <option value={25}>25 records per page</option>
                <option value={50}>50 records per page</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-foreground">Export Data Format</label>
              <select
                value={settings.exportFormat}
                onChange={(e) => setSettings((prev) => ({ ...prev, exportFormat: e.target.value as any }))}
                className="w-full mt-1 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs text-foreground focus:outline-none cursor-pointer"
              >
                <option value="CSV">Comma Separated Values (.csv)</option>
                <option value="JSON">JavaScript Object Notation (.json)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card 4: Appearance & Theme */}
        <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-foreground flex items-center gap-2 border-b border-border/40 pb-2.5">
            {isDarkMode ? <Moon className="h-4 w-4 text-amber-400" /> : <Sun className="h-4 w-4 text-amber-500" />}
            Theme & Visual Appearance
          </h3>

          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">Select your preferred color theme mode for the CRM dashboard.</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={cn(
                  'flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer text-left',
                  !isDarkMode ? 'border-blue-600 bg-blue-500/10 font-bold' : 'border-border/80 bg-muted/30 hover:bg-muted/60'
                )}
              >
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-amber-500" />
                  <span className="text-xs text-foreground">Light Mode</span>
                </div>
                {!isDarkMode && <Check className="h-4 w-4 text-blue-600" />}
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={cn(
                  'flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer text-left',
                  isDarkMode ? 'border-blue-500 bg-blue-500/10 font-bold' : 'border-border/80 bg-muted/30 hover:bg-muted/60'
                )}
              >
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4 text-amber-400" />
                  <span className="text-xs text-foreground">Dark Mode</span>
                </div>
                {isDarkMode && <Check className="h-4 w-4 text-blue-500" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
