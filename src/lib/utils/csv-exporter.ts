import { Customer } from '@/types/customer/entity';

export function exportToCSV(customers: Customer[]) {
  const headers = ['Name', 'Email', 'Phone', 'Company', 'Status', 'Last Contact', 'Deal Value', 'Account Owner', 'Title', 'Notes'];
  const rows = customers.map((c) => [
    `"${c.name}"`,
    `"${c.email}"`,
    `"${c.phone}"`,
    `"${c.company}"`,
    `"${c.status}"`,
    `"${c.lastContactDate || ''}"`,
    `"${c.dealValue ?? ''}"`,
    `"${c.accountOwner || ''}"`,
    `"${c.title || ''}"`,
    `"${(c.notes || '').replace(/"/g, "'")}"`,
  ]);
  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `customers_export_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
