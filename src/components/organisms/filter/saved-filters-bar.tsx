'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { fetchSavedFilters, reorderFilterPresets } from '@/services/filter/filter-service';
import { savedFilterKeys } from '@/services/customer/query-keys';
import { CustomerFilterState, SavedFiltersBarProps } from '@/types/filter';
import { SortableFilterChip } from './sortable-filter-chip';

export type { SavedFiltersBarProps };

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
    <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-thin px-2 py-0.5 ml-1 sm:ml-2">
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
