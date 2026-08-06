'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { CustomerFilterState } from '@/types/filter/state';
import { CustomerStatus } from '@/types/customer/entity';

const DEFAULT_FILTERS: CustomerFilterState = {
  search: '',
  statuses: [],
  companies: [],
  dateRange: {},
  phone: '',
  email: '',
  sortBy: 'name',
  sortOrder: 'asc',
  page: 1,
  pageSize: 8,
};

export function useCustomerFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<CustomerFilterState>(() => {
    const search = searchParams.get('search') || '';
    const status = searchParams.getAll('status') as CustomerStatus[];
    const page = Number(searchParams.get('page')) || 1;
    const pageSize = Number(searchParams.get('pageSize')) || 8;
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc';

    return {
      ...DEFAULT_FILTERS,
      search,
      statuses: status,
      page,
      pageSize,
      sortBy,
      sortOrder,
    };
  });

  // Sync filters to URL params for shareability
  const syncToUrl = useCallback(
    (newFilters: CustomerFilterState) => {
      const params = new URLSearchParams();
      if (newFilters.search) params.set('search', newFilters.search);
      if (newFilters.page > 1) params.set('page', String(newFilters.page));
      if (newFilters.pageSize !== 8) params.set('pageSize', String(newFilters.pageSize));
      if (newFilters.sortBy !== 'name') params.set('sortBy', newFilters.sortBy);
      if (newFilters.sortOrder !== 'asc') params.set('sortOrder', newFilters.sortOrder);
      newFilters.statuses.forEach((s) => params.append('status', s));

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname]
  );

  const updateFilters = useCallback(
    (updates: Partial<CustomerFilterState>) => {
      setFilters((prev) => {
        const next = { ...prev, ...updates };
        syncToUrl(next);
        return next;
      });
    },
    [syncToUrl]
  );

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    syncToUrl(DEFAULT_FILTERS);
  }, [syncToUrl]);

  const activeFilterCount =
    (filters.search ? 1 : 0) +
    filters.statuses.length +
    filters.companies.length +
    (filters.dateRange?.from ? 1 : 0) +
    (filters.phone ? 1 : 0) +
    (filters.email ? 1 : 0);

  return {
    filters,
    updateFilters,
    resetFilters,
    activeFilterCount,
  };
}
