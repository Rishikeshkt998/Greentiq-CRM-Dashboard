import { DEFAULT_DEALS, STORAGE_KEY, Deal } from './deal-constants';

export function getStoredDeals(): Deal[] {
  if (typeof window === 'undefined') return DEFAULT_DEALS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DEALS));
      return DEFAULT_DEALS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_DEALS;
  }
}

export function saveStoredDeals(deals: Deal[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deals));
  } catch {
    // Ignore write errors
  }
}
