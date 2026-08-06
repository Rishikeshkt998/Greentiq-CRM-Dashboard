import { cn } from '@/lib/utils/cn';

interface SkeletonProps { className?: string }

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('animate-pulse rounded-md bg-white/5', className)} />
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-white/5">
      <td className="px-4 py-3"><Skeleton className="h-4 w-4 rounded" /></td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
      </td>
      <td className="px-4 py-3"><Skeleton className="h-3.5 w-28" /></td>
      <td className="px-4 py-3"><Skeleton className="h-3.5 w-24" /></td>
      <td className="px-4 py-3"><Skeleton className="h-6 w-20 rounded-full" /></td>
      <td className="px-4 py-3"><Skeleton className="h-3.5 w-20" /></td>
      <td className="px-4 py-3"><Skeleton className="h-8 w-8 rounded-lg" /></td>
    </tr>
  );
}
