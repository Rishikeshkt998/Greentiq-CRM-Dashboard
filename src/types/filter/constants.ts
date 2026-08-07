import { CustomerStatus } from '../customer/entity';

export interface StatusOption {
  key: CustomerStatus;
  label: string;
}

export interface PresetSavedFilterOption {
  id: string;
  name: string;
  isSelected: boolean;
  isStarred?: boolean;
}

export const STATUSES: StatusOption[] = [
  { key: 'Active', label: 'Active Customer' },
  { key: 'Prospect', label: 'Prospect' },
  { key: 'Lead', label: 'Lead' },
  { key: 'Inactive', label: 'Inactive Customer' },
  { key: 'Archive', label: 'Archive' },
];

export const PRESET_SAVED_FILTERS: PresetSavedFilterOption[] = [
  { id: '1', name: 'Active Customers', isSelected: true },
  { id: '2', name: 'Recent Contacts', isSelected: false },
  { id: '3', name: 'Inactive Leads', isSelected: false },
  { id: '4', name: 'High-value prospects', isSelected: false, isStarred: true },
];
