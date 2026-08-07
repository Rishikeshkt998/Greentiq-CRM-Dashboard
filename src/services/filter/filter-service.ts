import { SavedFilterPreset } from '@/types/filter/preset';
import { CustomerFilterState } from '@/types/filter/state';
import { STORAGE_KEY, INITIAL_PRESETS } from './filter-constants';

export async function fetchSavedFilters(): Promise<SavedFilterPreset[]> {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PRESETS));
      return INITIAL_PRESETS;
    } catch {
      // Fallback to API fetch
    }
  }

  try {
    const response = await fetch('/api/saved-filters');
    if (response.ok) {
      const data = await response.json();
      if (data.data && Array.isArray(data.data) && data.data.length > 0) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data.data));
        }
        return data.data;
      }
    }
  } catch {
    // Ignore fetch errors
  }

  return INITIAL_PRESETS;
}

export async function saveFilterPreset(name: string, filterState: Partial<CustomerFilterState>): Promise<SavedFilterPreset> {
  const current = await fetchSavedFilters();
  const newPreset: SavedFilterPreset = {
    id: `preset-${Date.now()}`,
    name,
    filterState,
    isSystemPreset: false,
    order: current.length,
  };

  const updated = [...current, newPreset];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  // Also sync to API asynchronously
  fetch('/api/saved-filters', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, filterState }),
  }).catch(() => {});

  return newPreset;
}

export async function reorderFilterPresets(orderedIds: string[]): Promise<SavedFilterPreset[]> {
  const current = await fetchSavedFilters();
  const map = new Map(current.map((f) => [f.id, f]));
  const reordered: SavedFilterPreset[] = [];

  orderedIds.forEach((id, idx) => {
    const item = map.get(id);
    if (item) {
      item.order = idx;
      reordered.push(item);
    }
  });

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reordered));
  }

  // Also sync to API asynchronously
  fetch('/api/saved-filters', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderedIds }),
  }).catch(() => {});

  return reordered;
}
