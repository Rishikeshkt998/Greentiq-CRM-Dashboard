'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { fetchSavedFilters, reorderFilterPresets } from '@/services/filter/filter-service';
import { savedFilterKeys } from '@/services/customer/query-keys';
import { SavedFilterPreset } from '@/types/filter/preset';
import { CustomerFilterState } from '@/types/filter/state';
import { GripVertical, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface SavedFiltersBarProps {
  onApplyFilter: (state: Partial<CustomerFilterState>) => void;
}

function SortableFilterChip({ preset, onApply }: { preset: SavedFilterPreset; onApply: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: preset.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition-all cursor-pointer group select-none',
        isDragging
          ? 'border-primary bg-primary/20 text-primary opacity-80 scale-105 shadow-md z-10'
          : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:bg-primary/10 hover:text-primary',
        preset.isSystemPreset && 'border-primary/20 bg-primary/5'
      )}
    >
      {!preset.isSystemPreset && (
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground transition-colors">
          <GripVertical className="h-3 w-3" />
        </button>
      )}
      <button onClick={onApply} className="flex items-center gap-1.5">
        {preset.isSystemPreset && <Sparkles className="h-3 w-3 text-primary/70" />}
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
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = savedFilters.findIndex((f) => f.id === active.id);
      const newIndex = savedFilters.findIndex((f) => f.id === over.id);
      const reordered = arrayMove(savedFilters, oldIndex, newIndex);
      reorder(reordered.map((f) => f.id));
    }
  };

  if (savedFilters.length === 0) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin pb-0.5">
      <span className="flex-shrink-0 text-xs font-semibold text-muted-foreground">Quick Filters:</span>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={savedFilters.map((f) => f.id)} strategy={horizontalListSortingStrategy}>
          <div className="flex items-center gap-2">
            {savedFilters.map((preset) => (
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
