export interface SystemSettings {
  userName: string;
  userEmail: string;
  userRole: 'Admin' | 'Manager' | 'Viewer';
  pageSize: number;
  exportFormat: 'CSV' | 'JSON';
  autoRefresh: boolean;
}

export const STORAGE_KEY = 'greentiq_crm_settings_v1';

export const DEFAULT_SETTINGS: SystemSettings = {
  userName: 'Administrator',
  userEmail: 'admin@greentiq.com',
  userRole: 'Admin',
  pageSize: 8,
  exportFormat: 'CSV',
  autoRefresh: true,
};
