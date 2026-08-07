'use client';

import { AlertTriangle, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDangerous = true,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border/80 bg-card p-6 shadow-2xl transition-all duration-200 animate-in zoom-in-95">
        <div className="flex items-start gap-4">
          {/* Warning Icon Badge */}
          <div
            className={cn(
              'flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl',
              isDangerous
                ? 'bg-rose-500/15 text-rose-500 dark:bg-rose-500/20'
                : 'bg-blue-500/15 text-blue-500'
            )}
          >
            {isDangerous ? <Trash2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
          </div>

          <div className="flex-1 space-y-1">
            <h3 className="text-sm font-bold text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border/80 bg-muted/50 hover:bg-muted px-4 py-2 text-xs font-semibold text-foreground transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={cn(
              'rounded-lg px-4 py-2 text-xs font-bold text-white transition-colors shadow-xs',
              isDangerous
                ? 'bg-rose-600 hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-500'
                : 'bg-blue-600 hover:bg-blue-700'
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </>
  );
}
