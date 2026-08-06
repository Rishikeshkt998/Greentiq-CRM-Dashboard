'use client';

import { Play } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface PaginationFooterProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  total: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
}

export function PaginationFooter({
  currentPage,
  totalPages,
  pageSize,
  total,
  hasPrevPage,
  hasNextPage,
  onPageChange,
}: PaginationFooterProps) {
  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1];
    if (currentPage > 3) pages.push('...');
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    if (!pages.includes(totalPages)) pages.push(totalPages);
    return pages;
  };

  return (
    <div className="flex-shrink-0 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 px-5 py-3 bg-card">
      <p className="text-xs text-muted-foreground">
        Showing {total > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, total)} of {total} entries
      </p>

      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          disabled={!hasPrevPage}
          onClick={() => onPageChange(currentPage - 1)}
          className="rounded-lg border border-border/80 bg-muted/30 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          Previous
        </button>

        {/* Dynamic Page Number Buttons */}
        {getPageNumbers().map((page, idx) =>
          page === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-1 text-xs text-muted-foreground">
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={cn(
                'min-w-[32px] h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center',
                currentPage === page
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'border border-border/80 bg-muted/20 text-muted-foreground hover:border-primary/40 hover:text-primary'
              )}
            >
              {page}
            </button>
          )
        )}

        {/* Play Icon Button */}
        <button
          disabled={!hasNextPage}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-8 w-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all shadow-2xs disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Play className="h-2.5 w-2.5 fill-current" />
        </button>

        {/* Next Button */}
        <button
          disabled={!hasNextPage}
          onClick={() => onPageChange(currentPage + 1)}
          className="rounded-lg border border-border/80 bg-muted/30 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          Next
        </button>
      </div>
    </div>
  );
}
