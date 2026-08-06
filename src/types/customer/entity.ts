export type CustomerStatus = 'Active' | 'Inactive' | 'Prospect' | 'Lead' | 'Archive';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: CustomerStatus;
  lastContactDate: string; // ISO date string e.g. "2023-11-12"
  createdAt: string;
  updatedAt: string;
  avatarUrl?: string;
  notes?: string;
  dealValue?: number;
  accountOwner?: string;
  title?: string;
}

export interface CreateCustomerInput {
  name: string;
  email: string;
  phone: string;
  company: string;
  status: CustomerStatus;
  lastContactDate: string;
  notes?: string;
  dealValue?: number;
}

export interface UpdateCustomerInput extends Partial<CreateCustomerInput> {
  id: string;
}
