import { Customer } from '@/types/customer/entity';
import { User } from '@/types/auth/session';
import { SavedFilterPreset } from '@/types/filter/preset';

export const mockUsers: (User & { passwordHash: string })[] = [
  {
    id: 'usr-1',
    name: 'Alex Rivera',
    email: 'admin@greentiq.com',
    role: 'Admin',
    avatarUrl: 'https://i.pravatar.cc/80?img=11',
    title: 'Senior CRM Director',
    passwordHash: 'password123',
  },
  {
    id: 'usr-2',
    name: 'Sarah Chen',
    email: 'manager@greentiq.com',
    role: 'Manager',
    avatarUrl: 'https://i.pravatar.cc/80?img=5',
    title: 'Account Manager',
    passwordHash: 'password123',
  },
  {
    id: 'usr-3',
    name: 'Demo Viewer',
    email: 'viewer@greentiq.com',
    role: 'Viewer',
    avatarUrl: 'https://i.pravatar.cc/80?img=33',
    title: 'Sales Intern',
    passwordHash: 'password123',
  },
];

const firstNames = [
  'Alice', 'Bob', 'Charlie', 'Diana', 'Ethan', 'Fiona', 'George', 'Hannah', 'Ian', 'Julia',
  'Kevin', 'Laura', 'Marcus', 'Nora', 'Oliver', 'Penelope', 'Quinn', 'Rachel', 'Samuel', 'Tina',
  'Ulysses', 'Victoria', 'William', 'Xena', 'Yusuf', 'Zoe', 'Alexander', 'Beatrice', 'Christopher', 'David'
];

const lastNames = [
  'Green', 'Ross', 'Davis', 'Baves', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas',
  'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez',
  'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'Hernandez', 'King', 'Wright', 'Lopez'
];

const companies = [
  'Acme Corp', 'Globex', 'Stark Industries', 'Innovatech Sol', 'Initech',
  'Umbrella Corp', 'Cyberdyne', 'Wayne Enterprises', 'Holloway Ltd', 'Apex Systems'
];

const statuses: Customer['status'][] = ['Active', 'Inactive', 'Prospect', 'Lead', 'Archive'];

function generate150UniqueCustomers(): Customer[] {
  const customers: Customer[] = [];

  for (let i = 1; i <= 150; i++) {
    const fn = firstNames[(i - 1) % firstNames.length];
    const ln = lastNames[(Math.floor((i - 1) / firstNames.length) + i) % lastNames.length];
    const fullName = `${fn} ${ln}`;
    const company = companies[(i - 1) % companies.length];
    const status = statuses[(i - 1) % statuses.length];

    const cleanEmailName = `${fn.toLowerCase()}.${ln.toLowerCase()}${i > 30 ? i : ''}`;
    const domain = company.toLowerCase().replace(/[^a-z]/g, '');

    const areaCode = 800 + (i * 7) % 199;
    const prefix = 100 + (i * 13) % 899;
    const lineNum = 1000 + (i * 37) % 8999;
    const phone = `${areaCode}-${prefix}-${lineNum}`;

    const month = String(((i % 12) + 1)).padStart(2, '0');
    const day = String(((i % 28) + 1)).padStart(2, '0');

    customers.push({
      id: `cust-${i}`,
      name: fullName,
      email: `${cleanEmailName}@${domain}.com`,
      phone: phone,
      company: company,
      status: status,
      lastContactDate: `2023-${month}-${day}`,
      createdAt: '2022-01-10T10:00:00Z',
      updatedAt: '2023-11-12T14:30:00Z',
      avatarUrl: `https://i.pravatar.cc/80?img=${((i - 1) % 70) + 1}`,
      notes: `Met at TechSummit 2023. Discussed Q4 marketing strategy upgrade. Deal value estimated at $${(i * 1500) % 50000 + 10000}.`,
      dealValue: (i * 2500) % 75000 + 5000,
      accountOwner: i % 2 === 0 ? 'Alex Rivera' : 'Sarah Chen',
      title: i % 3 === 0 ? 'Marketing Director' : i % 3 === 1 ? 'VP of Procurement' : 'CTO',
    });
  }

  return customers;
}

export const initialMockCustomers: Customer[] = generate150UniqueCustomers();

export const initialSavedFilters: SavedFilterPreset[] = [
  {
    id: 'flt-1',
    name: 'Active Customers',
    filterState: { statuses: ['Active'] },
    isSystemPreset: true,
    order: 0,
  },
];
