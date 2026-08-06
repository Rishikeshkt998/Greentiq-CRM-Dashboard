'use client';

import { cn } from '@/lib/utils/cn';

type Status = 'Active' | 'Inactive' | 'Prospect' | 'Lead' | 'Archive';

const statusConfig: Record<Status, { label: string; dot: string; className: string }> = {
  Active: {
    label: 'Active',
    dot: 'bg-green-400',
    className: 'bg-green-500/15 text-green-400 ring-1 ring-green-500/30',
  },
  Inactive: {
    label: 'Inactive',
    dot: 'bg-gray-400',
    className: 'bg-gray-500/15 text-gray-400 ring-1 ring-gray-500/30',
  },
  Prospect: {
    label: 'Prospect',
    dot: 'bg-amber-400',
    className: 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30',
  },
  Lead: {
    label: 'Lead',
    dot: 'bg-blue-400',
    className: 'bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/30',
  },
  Archive: {
    label: 'Archive',
    dot: 'bg-red-400',
    className: 'bg-red-500/15 text-red-400 ring-1 ring-red-500/30',
  },
};

export function StatusPill({ status }: { status: string }) {
  const config = statusConfig[status as Status] ?? {
    label: status,
    dot: 'bg-gray-400',
    className: 'bg-gray-500/15 text-gray-400 ring-1 ring-gray-500/30',
  };

  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium', config.className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full flex-shrink-0', config.dot)} />
      {config.label}
    </span>
  );
}
