import { cn } from '@/lib/utils/cn';
import { CustomerStatus } from '@/types/customer/entity';

const statusConfig: Record<CustomerStatus, { label: string; className: string }> = {
  Active: { label: 'Active', className: 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30' },
  Inactive: { label: 'Inactive', className: 'bg-slate-500/15 text-slate-400 ring-1 ring-slate-500/30' },
  Prospect: { label: 'Prospect', className: 'bg-violet-500/15 text-violet-400 ring-1 ring-violet-500/30' },
  Lead: { label: 'Lead', className: 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30' },
  Archive: { label: 'Archive', className: 'bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30' },
};

interface StatusPillProps {
  status: CustomerStatus;
  className?: string;
}

export function StatusPill({ status, className }: StatusPillProps) {
  const config = statusConfig[status] || statusConfig['Active'];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide',
        config.className,
        className
      )}
    >
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}
