'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableFilterChipProps } from '@/types/filter';
import { GripVertical, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export type { SortableFilterChipProps };

export function SortableFilterChip({ preset, onApply }: SortableFilterChipProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: preset.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer select-none flex-shrink-0',
        isDragging
          ? 'border-blue-500 bg-blue-500/20 text-blue-400 opacity-90 scale-105 shadow-md z-20'
          : 'border-border/80 bg-card text-muted-foreground hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-foreground',
        preset.isSystemPreset && 'border-blue-500/30 bg-blue-500/5'
      )}
    >
      {!preset.isSystemPreset && (
        <span
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-foreground transition-colors p-0.5"
          title="Drag to reorder filter chip"
        >
          <GripVertical className="h-3 w-3" />
        </span>
      )}
      <button
        type="button"
        onClick={onApply}
        className="flex items-center gap-1.5 cursor-pointer font-medium"
      >
        {preset.isSystemPreset && <Sparkles className="h-3 w-3 text-blue-400" />}
        <span>{preset.name}</span>
      </button>
    </div>
  );
}
