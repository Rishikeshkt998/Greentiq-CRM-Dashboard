import { CustomerStatus } from '../customer/entity';

export interface DateRange {
  from?: string; // YYYY-MM-DD
  to?: string;   // YYYY-MM-DD
}

export interface CustomerFilterState {
  search: string;
  statuses: CustomerStatus[];
  companies: string[];
  dateRange: DateRange;
  phone: string;
  email: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  page: number;
  pageSize: number;
}
