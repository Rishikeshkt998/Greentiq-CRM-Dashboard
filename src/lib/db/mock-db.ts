import { Customer } from '@/types/customer/entity';
import { User } from '@/types/auth/session';
import { SavedFilterPreset } from '@/types/filter/preset';

export const mockUsers: (User & { passwordHash: string })[] = [
  {
    id: 'usr-1',
    name: 'Alex Rivera',
    email: 'admin@greentiq.com',
    role: 'Admin',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Senior CRM Director',
    passwordHash: 'password123', // Demo login password
  },
  {
    id: 'usr-2',
    name: 'Sarah Chen',
    email: 'manager@greentiq.com',
    role: 'Manager',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    title: 'Account Manager',
    passwordHash: 'password123',
  },
  {
    id: 'usr-3',
    name: 'Demo Viewer',
    email: 'viewer@greentiq.com',
    role: 'Viewer',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Sales Intern',
    passwordHash: 'password123',
  },
];

const companiesList = ['Acme Corp', 'Globex', 'Stark Industries', 'Innovatech Sol', 'Initech', 'Umbrella Corp'];
const statusesList: Customer['status'][] = ['Active', 'Inactive', 'Prospect', 'Lead', 'Archive'];

const namesList = [
  { name: 'Alice Green', email: 'alicegreen@gmail.com', company: 'Acme Corp', status: 'Active' as const },
  { name: 'Bob Ross', email: 'bobross.coh@email.com', company: 'Globex', status: 'Active' as const },
  { name: 'Charlie Davis', email: 'charliedavis@email.com', company: 'Stark Industries', status: 'Active' as const },
  { name: 'Charlie Baves', email: 'charlie.davis@email.com', company: 'Stark Industries', status: 'Active' as const },
  { name: 'Eoron Ross', email: 'bobiribonen@gmail.com', company: 'Acme Corp', status: 'Prospect' as const },
  { name: 'John Ross', email: 'alicextflob@jemail.com', company: 'Globex', status: 'Prospect' as const },
  { name: 'Alice Green', email: 'bobd@eme@email.com', company: 'Acme Corp', status: 'Active' as const },
  { name: 'Bob Ross', email: 'charlie.aavs@email.com', company: 'Stark Industries', status: 'Prospect' as const },
  { name: 'Bolo Ross', email: 'alicendavis@gmail.com', company: 'Stark Industries', status: 'Prospect' as const },
  { name: 'Charlie Davis', email: 'charliedastes@email.com', company: 'Acme Corp', status: 'Active' as const },
  { name: 'Charlie Davis', email: 'infor@.detes@email.com', company: 'Acme Corp', status: 'Prospect' as const },
  { name: 'Eleanor Henderson', email: 'eleanor.h@innovate.io', company: 'Innovatech Sol', status: 'Active' as const },
  { name: 'Sarah Chen', email: 'sarah.c@innovate.io', company: 'Innovatech Sol', status: 'Active' as const },
  { name: 'Marcus Vance', email: 'm.vance@initech.org', company: 'Initech', status: 'Lead' as const },
  { name: 'David Miller', email: 'david.m@umbrella.net', company: 'Umbrella Corp', status: 'Archive' as const },
];

function generate150Customers(): Customer[] {
  const customers: Customer[] = [];
  const baseCount = namesList.length;

  for (let i = 1; i <= 150; i++) {
    const seed = namesList[(i - 1) % baseCount];
    const company = companiesList[(i - 1) % companiesList.length];
    const status = statusesList[(i - 1) % statusesList.length];

    const year = 2023;
    const month = String(((i % 12) + 1)).padStart(2, '0');
    const day = String(((i % 28) + 1)).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    customers.push({
      id: `cust-${i}`,
      name: i <= baseCount ? seed.name : `${seed.name} ${Math.floor(i / baseCount) + 1}`,
      email: i <= baseCount ? seed.email : `customer${i}@${company.toLowerCase().replace(/\s+/g, '')}.com`,
      phone: `+1 (${800 + (i % 900)}) ${100 + (i % 899)}-${1000 + (i % 8999)}`,
      company: company,
      status: status,
      lastContactDate: dateStr,
      createdAt: '2022-01-10T10:00:00Z',
      updatedAt: '2023-11-12T14:30:00Z',
      avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + (i * 12345) % 1000000}?w=100&auto=format&fit=crop&q=80`,
      notes: `Met at TechSummit 2023. Discussed Q4 marketing strategy upgrade. Deal value estimated at $${(i * 1500) % 50000 + 10000}.`,
      dealValue: (i * 2500) % 75000 + 5000,
      accountOwner: i % 2 === 0 ? 'Alex Rivera' : 'Sarah Chen',
      title: i % 3 === 0 ? 'Marketing Director' : i % 3 === 1 ? 'VP of Procurement' : 'CTO',
    });
  }

  return customers;
}

export const initialMockCustomers: Customer[] = generate150Customers();

export const initialSavedFilters: SavedFilterPreset[] = [
  {
    id: 'flt-1',
    name: 'Active Customers',
    filterState: { statuses: ['Active'] },
    isSystemPreset: true,
    order: 0,
  },
  {
    id: 'flt-2',
    name: 'Recent Contacts',
    filterState: { sortBy: 'lastContactDate', sortOrder: 'desc' },
    isSystemPreset: true,
    order: 1,
  },
  {
    id: 'flt-3',
    name: 'Inactive Leads',
    filterState: { statuses: ['Inactive', 'Lead'] },
    isSystemPreset: true,
    order: 2,
  },
  {
    id: 'flt-4',
    name: 'High-value prospects',
    filterState: { statuses: ['Prospect'] },
    isSystemPreset: true,
    order: 3,
  },
];
