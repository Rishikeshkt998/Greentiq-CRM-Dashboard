'use client';

import { Customer } from '@/types/customer/entity';
import { StatusPill } from '@/components/atoms/status-pill';
import { Avatar } from '@/components/atoms/avatar';
import { GripVertical, Eye, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CustomerRowProps {
  customer: Customer;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  canEdit: boolean;
  canDelete: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function CustomerTableRow({
  customer,
  onView,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
  isSelected,
  onSelect,
}: CustomerRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: customer.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : undefined,
  };

  const contactDate = customer.lastContactDate
    ? new Date(customer.lastContactDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—';

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={cn(
        'group transition-colors border-b border-border/40 hover:bg-muted/40',
        isSelected && 'bg-primary/5 hover:bg-primary/10',
        isDragging && 'shadow-lg bg-card'
      )}
    >
      {/* Drag Handle + Checkbox */}
      <td className="px-2 py-2.5 whitespace-nowrap w-10">
        <div className="flex items-center gap-1">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-muted-foreground/30 hover:text-muted-foreground transition-colors p-0.5 touch-none"
            title="Drag to reorder"
          >
            <GripVertical className="h-3.5 w-3.5" />
          </button>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(customer.id)}
            className="h-3.5 w-3.5 rounded border-border text-primary cursor-pointer accent-blue-600"
          />
        </div>
      </td>
      {/* Name + Avatar */}
      <td className="px-4 py-2.5 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <Avatar src={customer.avatarUrl} name={customer.name} size="sm" />
          <span className="text-xs font-bold text-foreground">{customer.name}</span>
        </div>
      </td>
      {/* Email */}
      <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap font-normal">
        {customer.email}
      </td>
      {/* Phone */}
      <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap font-normal">
        {customer.phone}
      </td>
      {/* Company */}
      <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap font-normal">
        {customer.company}
      </td>
      {/* Status Pill */}
      <td className="px-4 py-2.5 whitespace-nowrap">
        <StatusPill status={customer.status} />
      </td>
      {/* Last Contact */}
      <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap font-normal">
        {contactDate}
      </td>
      {/* Actions */}
      <td className="px-4 py-2.5 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-2 text-muted-foreground/70 group-hover:text-muted-foreground transition-opacity">
          <button
            onClick={onView}
            className="p-1 hover:text-blue-400 transition-colors"
            title="View Details"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
          {canEdit && (
            <button
              onClick={onEdit}
              className="p-1 hover:text-foreground transition-colors"
              title="Edit"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}
          {canDelete && (
            <button
              onClick={onDelete}
              className="p-1 hover:text-red-500 transition-colors"
              title="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
