'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { fetchSavedFilters, reorderFilterPresets } from '@/services/filter/filter-service';
import { savedFilterKeys } from '@/services/customer/query-keys';
import { SavedFilterPreset } from '@/types/filter/preset';
import { CustomerFilterState } from '@/types/filter/state';
import { GripVertical, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface SavedFiltersBarProps {
  onApplyFilter: (state: Partial<CustomerFilterState>) => void;
}

function SortableFilterChip({ preset, onApply, onRemove }: { preset: SavedFilterPreset; onApply: () => void; onRemove?: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: preset.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer group",
        isDragging
          ? "border-violet-500/50 bg-violet-500/20 text-violet-300 opacity-80 scale-105 shadow-lg z-10"
          : "border-white/10 bg-white/5 text-muted-foreground hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-violet-300",
        preset.isSystemPreset && "border-violet-500/20 bg-violet-500/5"
      )}
    >
      {!preset.isSystemPreset && (
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-muted-foreground transition-colors">
          <GripVertical className="h-3 w-3" />
        </button>
      )}
      <button onClick={onApply} className="flex items-center gap-1.5">
        {preset.isSystemPreset && <Sparkles className="h-2.5 w-2.5 text-violet-400/70" />}
        {preset.name}
      </button>
    </div>
  );
}

export function SavedFiltersBar({ onApplyFilter }: SavedFiltersBarProps) {
  const queryClient = useQueryClient();
  const { data: savedFilters = [] } = useQuery({
    queryKey: savedFilterKeys.lists(),
    queryFn: fetchSavedFilters,
  });

  const { mutate: reorder } = useMutation({
    mutationFn: (ids: string[]) => reorderFilterPresets(ids),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: savedFilterKeys.all }),
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = savedFilters.findIndex(f => f.id === active.id);
      const newIndex = savedFilters.findIndex(f => f.id === over.id);
      const reordered = arrayMove(savedFilters, oldIndex, newIndex);
      reorder(reordered.map(f => f.id));
    }
  };

  if (savedFilters.length === 0) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin pb-0.5">
      <span className="flex-shrink-0 text-xs font-medium text-muted-foreground/60">Quick Filters:</span>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={savedFilters.map(f => f.id)} strategy={horizontalListSortingStrategy}>
          <div className="flex items-center gap-2">
            {savedFilters.map(preset => (
              <SortableFilterChip
                key={preset.id}
                preset={preset}
                onApply={() => onApplyFilter(preset.filterState as Partial<CustomerFilterState>)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
