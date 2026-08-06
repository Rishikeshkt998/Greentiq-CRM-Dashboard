'use client';

import { Users } from 'lucide-react';
import { Customer } from '@/types/customer/entity';
import { CustomerTableRow } from './customer-table-row';
import { PaginationFooter } from './pagination-footer';
import {
  DndContext,
  closestCenter,
  SensorDescriptor,
  SensorOptions,
  DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface CustomerTableProps {
  isLoading: boolean;
  orderedCustomers: Customer[];
  rowOrder: string[];
  sensors: SensorDescriptor<SensorOptions>[];
  handleDragEnd: (event: DragEndEvent) => void;
  allSelected: boolean;
  onSelectAll: () => void;
  selectedIds: Set<string>;
  onSelectOne: (id: string) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort: (column: string) => void;
  activeFilterCount: number;
  onResetFilters: () => void;
  onViewCustomer: (customer: Customer) => void;
  onEditCustomer: (customer: Customer) => void;
  onDeleteCustomer: (id: string) => void;
  canEdit: boolean;
  canDelete: boolean;
  meta?: {
    page: number;
    totalPages: number;
    pageSize: number;
    total: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
  };
  onPageChange: (page: number) => void;
}

export function CustomerTable({
  isLoading,
  orderedCustomers,
  rowOrder,
  sensors,
  handleDragEnd,
  allSelected,
  onSelectAll,
  selectedIds,
  onSelectOne,
  sortBy,
  sortOrder,
  onSort,
  activeFilterCount,
  onResetFilters,
  onViewCustomer,
  onEditCustomer,
  onDeleteCustomer,
  canEdit,
  canDelete,
  meta,
  onPageChange,
}: CustomerTableProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0 rounded-xl border border-gray-200/80 dark:border-border bg-card overflow-hidden shadow-xs transition-colors duration-200">
      <div className="flex-1 overflow-auto scrollbar-thin">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-card border-b border-border/60 shadow-2xs">
              <tr className="bg-muted/20">
                <th className="px-2 py-3 w-10">
                  <div className="flex items-center gap-1">
                    <div className="w-[18px] h-3.5 flex-shrink-0" />
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={onSelectAll}
                      className="h-3.5 w-3.5 rounded border-border cursor-pointer accent-blue-600"
                      title="Select all"
                    />
                  </div>
                </th>
                {[
                  { key: 'name', label: 'Name' },
                  { key: 'email', label: 'Email' },
                  { key: 'phone', label: 'Phone' },
                  { key: 'company', label: 'Company' },
                  { key: 'status', label: 'Status' },
                  { key: 'lastContactDate', label: 'Last Contact' },
                ].map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors select-none"
                    onClick={() => onSort(col.key)}
                  >
                    {col.label}
                    {sortBy === col.key && (
                      <span className="ml-1 text-primary">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                ))}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="animate-pulse border-b border-border/50">
                    <td className="px-2 py-3">
                      <div className="h-3.5 w-3.5 rounded bg-muted" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-7 w-7 rounded-full bg-muted" />
                        <div className="h-3.5 w-24 rounded bg-muted" />
                      </div>
                    </td>
                    {[1, 2, 3, 4, 5].map((j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-3.5 w-20 rounded bg-muted" />
                      </td>
                    ))}
                    <td className="px-4 py-3" />
                  </tr>
                ))
              ) : orderedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="h-8 w-8 text-muted-foreground/30" />
                      <p className="text-xs font-medium text-muted-foreground">No customers found</p>
                      {activeFilterCount > 0 && (
                        <button
                          onClick={onResetFilters}
                          className="rounded-lg border border-primary/30 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                <SortableContext
                  items={rowOrder.length > 0 ? rowOrder : orderedCustomers.map((c) => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {orderedCustomers.map((customer) => (
                    <CustomerTableRow
                      key={customer.id}
                      customer={customer}
                      onView={() => onViewCustomer(customer)}
                      onEdit={() => onEditCustomer(customer)}
                      onDelete={() => onDeleteCustomer(customer.id)}
                      canEdit={canEdit}
                      canDelete={canDelete}
                      isSelected={selectedIds.has(customer.id)}
                      onSelect={onSelectOne}
                    />
                  ))}
                </SortableContext>
              )}
            </tbody>
          </table>
        </DndContext>
      </div>

      {/* Pagination Footer */}
      {meta && (
        <PaginationFooter
          currentPage={meta.page}
          totalPages={meta.totalPages}
          pageSize={meta.pageSize}
          total={meta.total}
          hasPrevPage={meta.hasPrevPage}
          hasNextPage={meta.hasNextPage}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
