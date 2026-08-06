import { SavedFilterPreset } from '@/types/filter/preset';
import { CustomerFilterState } from '@/types/filter/state';

export async function fetchSavedFilters(): Promise<SavedFilterPreset[]> {
  const response = await fetch('/api/saved-filters');
  if (!response.ok) throw new Error('Failed to fetch saved filters');
  const data = await response.json();
  return data.data;
}

export async function saveFilterPreset(name: string, filterState: Partial<CustomerFilterState>): Promise<SavedFilterPreset> {
  const response = await fetch('/api/saved-filters', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, filterState }),
  });
  if (!response.ok) throw new Error('Failed to save filter preset');
  const data = await response.json();
  return data.data;
}

export async function reorderFilterPresets(orderedIds: string[]): Promise<SavedFilterPreset[]> {
  const response = await fetch('/api/saved-filters', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderedIds }),
  });
  if (!response.ok) throw new Error('Failed to reorder filters');
  const data = await response.json();
  return data.data;
}
