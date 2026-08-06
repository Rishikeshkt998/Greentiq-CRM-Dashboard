import { CustomerStatus } from '@/types/customer/entity';
import { cn } from '@/lib/utils/cn';

interface StatusPillProps {
  status: CustomerStatus | string;
  className?: string;
}

export function StatusPill({ status, className }: StatusPillProps) {
  let badgeStyle = 'bg-[#16a34a] text-white';

  if (status === 'Active') {
    badgeStyle = 'bg-[#16a34a] text-white';
  } else if (status === 'Prospect' || status === 'Lead') {
    badgeStyle = 'bg-[#d97706] text-white';
  } else if (status === 'Inactive' || status === 'Archive') {
    badgeStyle = 'bg-[#4b5563] text-white';
  }

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center px-3 py-0.5 text-[11px] font-semibold rounded-full shadow-2xs select-none min-w-[70px]',
        badgeStyle,
        className
      )}
    >
      {status}
    </span>
  );
}
