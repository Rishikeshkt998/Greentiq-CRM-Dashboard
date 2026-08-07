import { SavedFilterPreset } from '@/types/filter/preset';

export const STORAGE_KEY = 'greentiq_crm_saved_filters_v2';

export const INITIAL_PRESETS: SavedFilterPreset[] = [
  {
    id: 'flt-1',
    name: 'Active Customers',
    filterState: { statuses: ['Active'] },
    isSystemPreset: true,
    order: 0,
  },
  {
    id: 'flt-2',
    name: 'Hot Prospects',
    filterState: { statuses: ['Prospect'] },
    isSystemPreset: false,
    order: 1,
  },
  {
    id: 'flt-3',
    name: 'Acme Corp Accounts',
    filterState: { companies: ['Acme Corp'] },
    isSystemPreset: false,
    order: 2,
  },
  {
    id: 'flt-4',
    name: 'Lead Pipeline',
    filterState: { statuses: ['Lead'] },
    isSystemPreset: false,
    order: 3,
  },
];
