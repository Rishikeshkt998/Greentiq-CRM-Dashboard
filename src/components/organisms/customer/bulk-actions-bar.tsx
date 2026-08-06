'use client';

import { CheckSquare2, Trash2 } from 'lucide-react';
import { CustomerStatus } from '@/types/customer/entity';

const ALL_STATUSES: CustomerStatus[] = ['Active', 'Inactive', 'Prospect', 'Lead', 'Archive'];

interface BulkActionsBarProps {
  selectedCount: number;
  bulkStatus: string;
  onBulkStatusChange: (status: string) => void;
  onBulkDelete: () => void;
  onClearSelection: () => void;
  canEdit: boolean;
  canDelete: boolean;
}

export function BulkActionsBar({
  selectedCount,
  bulkStatus,
  onBulkStatusChange,
  onBulkDelete,
  onClearSelection,
  canEdit,
  canDelete,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex-shrink-0 flex items-center gap-3 rounded-lg border border-blue-500/40 bg-blue-500/10 px-4 py-2">
      <CheckSquare2 className="h-4 w-4 text-blue-400 flex-shrink-0" />
      <span className="text-xs font-semibold text-blue-400">
        {selectedCount} selected
      </span>

      {/* Bulk Status Dropdown */}
      {canEdit && (
        <div className="flex items-center gap-2 ml-2">
          <select
            value={bulkStatus}
            onChange={(e) => onBulkStatusChange(e.target.value)}
            className="rounded-lg border border-border/80 bg-card py-1 pl-2 pr-6 text-xs text-foreground cursor-pointer focus:outline-none appearance-none"
          >
            <option value="">Change Status…</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Bulk Delete */}
      {canDelete && (
        <button
          onClick={onBulkDelete}
          className="flex items-center gap-1.5 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete Selected
        </button>
      )}

      {/* Clear Selection */}
      <button
        onClick={onClearSelection}
        className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        Clear
      </button>
    </div>
  );
}
