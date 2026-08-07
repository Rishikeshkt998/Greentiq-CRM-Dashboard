export interface PaginatedMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  activeLeads?: number;
  contactedThisWeek?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
  availableCompanies: string[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
