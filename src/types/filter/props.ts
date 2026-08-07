import { CustomerFilterState } from './state';
import { SavedFilterPreset } from './preset';

export interface FilterPanelProps {
  open: boolean;
  onClose: () => void;
  filters: CustomerFilterState;
  onApply: (filters: Partial<CustomerFilterState>) => void;
  availableCompanies: string[];
}

export interface SavedFiltersBarProps {
  onApplyFilter: (state: Partial<CustomerFilterState>) => void;
}

export interface SortableFilterChipProps {
  preset: SavedFilterPreset;
  onApply: () => void;
}
