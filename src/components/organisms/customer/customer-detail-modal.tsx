'use client';

import { X, Copy, TrendingUp } from 'lucide-react';
import { Customer } from '@/types/customer/entity';
import { useAuth } from '@/hooks/auth/use-auth';
import { useDeleteCustomer } from '@/hooks/customer/use-customers';
import { cn } from '@/lib/utils/cn';
import { toast } from 'sonner';

interface CustomerDetailModalProps {
  customer: Customer;
  open: boolean;
  onClose: () => void;
  onEdit: (customer: Customer) => void;
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
}

const avatarColors = [
  'bg-teal-600', 'bg-blue-600', 'bg-violet-600',
  'bg-rose-600', 'bg-amber-600', 'bg-emerald-600', 'bg-indigo-600',
];

function getAvatarColor(name: string) {
  return avatarColors[name.charCodeAt(0) % avatarColors.length];
}

function statusBadgeClass(status: string) {
  switch (status) {
    case 'Active':   return 'bg-emerald-600 text-white';
    case 'Prospect': return 'bg-amber-600 text-white';
    case 'Lead':     return 'bg-amber-500 text-white';
    case 'Inactive': return 'bg-gray-500 text-white';
    case 'Archive':  return 'bg-gray-600 text-white';
    default:         return 'bg-blue-600 text-white';
  }
}

function statusLabel(status: string) {
  return status === 'Active' ? 'Active Client' : status;
}

export function CustomerDetailModal({ customer, open, onClose, onEdit }: CustomerDetailModalProps) {
  const { permissions } = useAuth();
  const { mutate: deleteCustomer } = useDeleteCustomer();

  if (!open) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleDelete = () => {
    if (confirm(`Delete ${customer.name}?`)) {
      deleteCustomer(customer.id);
      onClose();
    }
  };

  const formatDate = (iso: string) => {
    if (!iso) return '—';
    try { return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); }
    catch { return iso; }
  };

  const formatDateTime = (iso: string) => {
    if (!iso) return '—';
    try { return new Date(iso).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }); }
    catch { return iso; }
  };

  const noteDate = customer.lastContactDate
    ? new Date(customer.lastContactDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })
    : '—';

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs" onClick={onClose} />

      {/* Modal — theme-aware */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border/80 bg-card shadow-2xl max-h-[92vh] overflow-y-auto scrollbar-thin transition-colors duration-200">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 px-5 pt-4 pb-3">
          <h2 className="text-sm font-bold text-foreground">Customer Details</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Hero Row */}
        <div className="flex items-start gap-4 px-5 pt-4 pb-3">
          <div className={cn('flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full text-base font-extrabold text-white shadow-md', getAvatarColor(customer.name))}>
            {getInitials(customer.name)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-foreground leading-snug">{customer.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{customer.title || 'Contact'}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <TrendingUp className="h-3 w-3 text-blue-500 flex-shrink-0" />
                  <span className="text-xs text-muted-foreground">{customer.company}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {permissions.canDeleteCustomer && (
                  <button
                    onClick={handleDelete}
                    className="rounded-lg border border-red-500/60 px-3 py-1.5 text-[11px] font-semibold text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    Delete
                  </button>
                )}
                {permissions.canEditCustomer && (
                  <button
                    onClick={() => onEdit(customer)}
                    className="rounded-lg bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-[11px] font-bold text-white transition-colors"
                  >
                    Edit Customer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid (Responsive 1-col on mobile, 2-col on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-0 px-5 pb-3 border-b border-border/40">
          {/* Left: Contact Information */}
          <div className="space-y-3 sm:pr-5 border-b sm:border-b-0 sm:border-r border-border/40 pb-3 sm:pb-0">
            <h4 className="text-xs font-bold text-foreground">Contact Information</h4>

            <div className="space-y-0.5">
              <p className="text-[10px] text-muted-foreground font-medium">Email</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-foreground">{customer.email}</span>
                <button onClick={() => handleCopy(customer.email)} className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-0.5">
              <p className="text-[10px] text-muted-foreground font-medium">Phone</p>
              <span className="text-xs text-foreground">{customer.phone}</span>
            </div>

            {/* Timelines */}
            <div className="pt-2 border-t border-border/40 space-y-1.5">
              <h4 className="text-xs font-bold text-foreground">Timelines</h4>
              <div className="space-y-0.5">
                <p className="text-[10px] text-muted-foreground font-medium">Last Contact</p>
                <span className="text-xs text-foreground">{formatDateTime(customer.lastContactDate)}</span>
              </div>
            </div>
          </div>

          {/* Right: Company & Status */}
          <div className="space-y-3 pl-5">
            <h4 className="text-xs font-bold text-foreground">Company &amp; Status</h4>

            <div className="space-y-0.5">
              <p className="text-[10px] text-muted-foreground font-medium">Company</p>
              <span className="text-xs text-foreground">{customer.company}</span>
            </div>

            <div className="space-y-0.5">
              <p className="text-[10px] text-muted-foreground font-medium">Status</p>
              <span className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold', statusBadgeClass(customer.status))}>
                {statusLabel(customer.status)}
              </span>
            </div>

            {customer.dealValue && (
              <div className="space-y-0.5">
                <p className="text-[10px] text-muted-foreground font-medium">Deal Value</p>
                <span className="text-xs text-foreground">${customer.dealValue.toLocaleString()}</span>
              </div>
            )}

            <div className="space-y-0.5">
              <p className="text-[10px] text-muted-foreground font-medium">Account Owner</p>
              <span className="text-xs text-foreground">{customer.accountOwner || 'Sarah Chen'}</span>
            </div>

            <div className="space-y-0.5">
              <p className="text-[10px] text-muted-foreground font-medium">Created Date</p>
              <span className="text-xs text-foreground">{formatDate(customer.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Notes & Interactions */}
        <div className="px-5 pt-3 pb-5 space-y-2">
          <h4 className="text-xs font-bold text-foreground">Notes &amp; Interactions</h4>

          {customer.notes ? (
            <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
              <div className="flex items-start justify-between gap-3">
                <p className="text-[11px] text-foreground/80 leading-relaxed flex-1">{customer.notes}</p>
                <span className="text-[10px] text-muted-foreground font-medium whitespace-nowrap flex-shrink-0">{noteDate}</span>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
              <p className="text-[11px] text-muted-foreground italic">No notes yet.</p>
            </div>
          )}

          <div className="flex items-center justify-end">
            <span className="text-[10px] text-muted-foreground/60">
              {customer.updatedAt ? new Date(customer.updatedAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }) : '—'}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
