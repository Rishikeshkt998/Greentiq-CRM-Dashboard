import { CustomerFilterState } from './state';

export interface SavedFilterPreset {
  id: string;
  name: string;
  filterState: Partial<CustomerFilterState>;
  isSystemPreset?: boolean;
  order: number;
}
