import { CustomerFilterState } from '@/types/filter/state';
import { CreateCustomerInput, UpdateCustomerInput, Customer } from '@/types/customer/entity';
import { PaginatedResponse } from '@/types/api/response';
import { getAccessToken } from '@/services/auth/token-store';

function getAuthHeaders(headers: Record<string, string> = {}): Record<string, string> {
  const token = getAccessToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

function buildQueryString(filters: Partial<CustomerFilterState>): string {
  const params = new URLSearchParams();

  if (filters.search) params.set('search', filters.search);
  if (filters.phone) params.set('phone', filters.phone);
  if (filters.email) params.set('email', filters.email);
  if (filters.sortBy) params.set('sortBy', filters.sortBy);
  if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);
  if (filters.page) params.set('page', String(filters.page));
  if (filters.pageSize) params.set('pageSize', String(filters.pageSize));
  if (filters.dateRange?.from) params.set('dateFrom', filters.dateRange.from);
  if (filters.dateRange?.to) params.set('dateTo', filters.dateRange.to);

  filters.statuses?.forEach((s) => params.append('statuses[]', s));
  filters.companies?.forEach((c) => params.append('companies[]', c));

  return params.toString();
}

export async function fetchCustomers(filters: Partial<CustomerFilterState>): Promise<PaginatedResponse<Customer>> {
  const qs = buildQueryString(filters);
  const response = await fetch(`/api/customers?${qs}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch customers');
  }
  return response.json();
}

export async function fetchCustomerById(id: string): Promise<Customer> {
  const response = await fetch(`/api/customers/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Customer not found');
  const data = await response.json();
  return data.data;
}

export async function createCustomer(input: CreateCustomerInput): Promise<Customer> {
  const response = await fetch('/api/customers', {
    method: 'POST',
    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create customer');
  }
  const data = await response.json();
  return data.data;
}

export async function updateCustomer(input: UpdateCustomerInput): Promise<Customer> {
  const response = await fetch(`/api/customers/${input.id}`, {
    method: 'PATCH',
    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to update customer');
  }
  const data = await response.json();
  return data.data;
}

export async function deleteCustomer(id: string): Promise<void> {
  const response = await fetch(`/api/customers/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to delete customer');
  }
}
