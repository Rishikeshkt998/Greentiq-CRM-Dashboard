'use client';

import { X, Pencil, Mail, Phone, Building2, Calendar, DollarSign, User, Copy } from 'lucide-react';
import { Customer } from '@/types/customer/entity';
import { StatusPill } from '@/components/atoms/status-pill';
import { formatDate, formatCurrency } from '@/lib/utils/formatters';
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
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

const avatarColors = [
  'bg-teal-600',
  'bg-blue-600',
  'bg-violet-600',
  'bg-rose-600',
  'bg-amber-600',
  'bg-emerald-600',
  'bg-indigo-600',
];

function getAvatarColor(name: string) {
  const index = name.charCodeAt(0) % avatarColors.length;
  return avatarColors[index];
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

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-white/10 bg-[hsl(220,38%,11%)] shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-thin">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-4">
          <h2 className="text-lg font-bold text-white">Customer Details</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Customer Hero */}
        <div className="px-6 pt-5 pb-4">
          <div className="flex items-start gap-4">
            {/* Avatar / Initials */}
            <div
              className={cn(
                'flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full text-xl font-bold text-white shadow-lg',
                getAvatarColor(customer.name)
              )}
            >
              {getInitials(customer.name)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-white">{customer.name}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{customer.title || 'Contact'}</p>
                  {customer.company && (
                    <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Building2 className="h-3.5 w-3.5" />
                      {customer.company}
                    </div>
                  )}
                </div>
                {/* Action buttons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {permissions.canDeleteCustomer && (
                    <button
                      onClick={handleDelete}
                      className="rounded-lg border border-red-500/40 px-4 py-1.5 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                  {permissions.canEditCustomer && (
                    <button
                      onClick={() => onEdit(customer)}
                      className="rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
                    >
                      Edit Customer
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.07] mx-6" />

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-0 divide-x divide-white/[0.07] px-6 py-5">
          {/* Contact Information */}
          <div className="pr-6 space-y-4">
            <h4 className="text-sm font-semibold text-white">Contact Information</h4>
            <div className="space-y-3">
              <InfoRow label="Email">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground/90 truncate">{customer.email}</span>
                  <button
                    onClick={() => handleCopy(customer.email)}
                    className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              </InfoRow>
              <InfoRow label="Phone">
                <span className="text-sm text-foreground/90">{customer.phone}</span>
              </InfoRow>
            </div>

            {/* Timelines */}
            <h4 className="text-sm font-semibold text-white pt-2">Timelines</h4>
            <div className="space-y-3">
              <InfoRow label="Last Contact">
                <span className="text-sm text-foreground/90">{formatDate(customer.lastContactDate)}</span>
              </InfoRow>
              <InfoRow label="Created Date">
                <span className="text-sm text-foreground/90">
                  {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                </span>
              </InfoRow>
            </div>
          </div>

          {/* Company & Status */}
          <div className="pl-6 space-y-4">
            <h4 className="text-sm font-semibold text-white">Company &amp; Status</h4>
            <div className="space-y-3">
              <InfoRow label="Company">
                <span className="text-sm text-foreground/90">{customer.company || '—'}</span>
              </InfoRow>
              <InfoRow label="Status">
                <StatusPill status={customer.status} />
              </InfoRow>
              <InfoRow label="Deal Value">
                <span className="text-sm font-semibold text-foreground">
                  {customer.dealValue ? formatCurrency(customer.dealValue) : '—'}
                </span>
              </InfoRow>
              <InfoRow label="Account Owner">
                <span className="text-sm text-foreground/90">{customer.accountOwner || '—'}</span>
              </InfoRow>
            </div>
          </div>
        </div>

        {/* Notes */}
        {customer.notes && (
          <div className="border-t border-white/[0.07] mx-6 pt-5 pb-6">
            <h4 className="text-sm font-semibold text-white mb-3">Notes &amp; Interactions</h4>
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
              <p className="text-sm text-foreground/80 leading-relaxed">{customer.notes}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div>{children}</div>
    </div>
  );
}
