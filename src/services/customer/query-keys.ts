import { CustomerFilterState } from '@/types/filter/state';

export const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (filters: Partial<CustomerFilterState>) => [...customerKeys.lists(), filters] as const,
  details: () => [...customerKeys.all, 'detail'] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
};

export const savedFilterKeys = {
  all: ['saved-filters'] as const,
  lists: () => ['saved-filters'] as const,
};
