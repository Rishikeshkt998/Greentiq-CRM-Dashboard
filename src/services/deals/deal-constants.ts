export interface Deal {
  id: string;
  title: string;
  customerName: string;
  value: number;
  stage: 'Prospecting' | 'Qualified' | 'Proposal' | 'Closed Won';
  probability: number;
  expectedClose: string;
}

export const STORAGE_KEY = 'greentiq_crm_deals_v1';

export const DEFAULT_DEALS: Deal[] = [
  { id: 'deal-1', title: 'Acme Enterprise License Expansion', customerName: 'John Doe', value: 45000, stage: 'Proposal', probability: 75, expectedClose: '2026-08-20' },
  { id: 'deal-2', title: 'Starlight Retail Analytics Integration', customerName: 'Jane Smith', value: 28000, stage: 'Qualified', probability: 50, expectedClose: '2026-08-25' },
  { id: 'deal-3', title: 'TechCorp Cloud Migration Package', customerName: 'Robert Johnson', value: 65000, stage: 'Closed Won', probability: 100, expectedClose: '2026-08-01' },
  { id: 'deal-4', title: 'Apex Global Logistics Custom ERP', customerName: 'Emily Davis', value: 35000, stage: 'Prospecting', probability: 30, expectedClose: '2026-09-10' },
  { id: 'deal-5', title: 'Nexus Health CRM Implementation', customerName: 'Michael Brown', value: 50000, stage: 'Proposal', probability: 80, expectedClose: '2026-08-30' },
  { id: 'deal-6', title: 'Horizon Solar Analytics Setup', customerName: 'Sarah Wilson', value: 22000, stage: 'Closed Won', probability: 100, expectedClose: '2026-08-05' },
];
