import { z } from 'zod';

export const filterQuerySchema = z.object({
  search: z.string().optional().default(''),
  statuses: z.array(z.enum(['Active', 'Inactive', 'Prospect', 'Lead', 'Archive'])).optional().default([]),
  companies: z.array(z.string()).optional().default([]),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  phone: z.string().optional().default(''),
  email: z.string().optional().default(''),
  sortBy: z.string().optional().default('name'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
  page: z.coerce.number().min(1).optional().default(1),
  pageSize: z.coerce.number().min(1).max(100).optional().default(10),
});

export const saveFilterPresetSchema = z.object({
  name: z.string().min(2, 'Filter preset name must be at least 2 characters'),
  filterState: z.record(z.unknown()),
});

export type FilterQueryParamsInput = z.infer<typeof filterQuerySchema>;
