export interface SystemSettings {
  userName: string;
  userEmail: string;
  userRole: 'Admin' | 'Manager' | 'Viewer';
  pageSize: number;
  exportFormat: 'CSV' | 'JSON';
  autoRefresh: boolean;
}

const STORAGE_KEY = 'greentiq_crm_settings_v1';

const DEFAULT_SETTINGS: SystemSettings = {
  userName: 'Administrator',
  userEmail: 'admin@greentiq.com',
  userRole: 'Admin',
  pageSize: 8,
  exportFormat: 'CSV',
  autoRefresh: true,
};

export function getStoredSettings(): SystemSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: SystemSettings) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Ignore write errors
  }
}
