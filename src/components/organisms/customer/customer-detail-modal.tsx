'use client';

import { X, Pencil, Mail, Phone, Building2, Calendar, DollarSign, FileText, User } from 'lucide-react';
import { Customer } from '@/types/customer/entity';
import { StatusPill } from '@/components/atoms/status-pill';
import { Avatar } from '@/components/atoms/avatar';
import { formatDate, formatCurrency } from '@/lib/utils/formatters';
import { useAuth } from '@/hooks/auth/use-auth';

interface CustomerDetailModalProps {
  customer: Customer;
  open: boolean;
  onClose: () => void;
  onEdit: (customer: Customer) => void;
}

export function CustomerDetailModal({ customer, open, onClose, onEdit }: CustomerDetailModalProps) {
  const { permissions } = useAuth();
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-white/10 bg-card shadow-2xl">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-violet-600/20 via-indigo-600/10 to-transparent p-5 pb-4">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.15),transparent_70%)]" />
          <div className="relative flex items-start gap-4">
            <Avatar src={customer.avatarUrl} name={customer.name} size="lg" />
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-white truncate">{customer.name}</h2>
              <p className="text-sm text-muted-foreground">{customer.title || 'Contact'}</p>
              <div className="mt-2">
                <StatusPill status={customer.status} />
              </div>
            </div>
            <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/10 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3 p-5">
          <div className="grid grid-cols-2 gap-3">
            <DetailRow icon={Mail} label="Email" value={customer.email} />
            <DetailRow icon={Phone} label="Phone" value={customer.phone} />
            <DetailRow icon={Building2} label="Company" value={customer.company} />
            <DetailRow icon={Calendar} label="Last Contact" value={formatDate(customer.lastContactDate)} />
            <DetailRow icon={DollarSign} label="Deal Value" value={formatCurrency(customer.dealValue)} />
            <DetailRow icon={User} label="Account Owner" value={customer.accountOwner || '—'} />
          </div>

          {customer.notes && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <FileText className="h-3.5 w-3.5" /> Notes
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">{customer.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-white/[0.06] px-5 py-3">
          <button onClick={onClose} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            Close
          </button>
          {permissions.canEditCustomer && (
            <button onClick={() => onEdit(customer)} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:from-violet-500 hover:to-indigo-500 transition-all">
              <Pencil className="h-4 w-4" /> Edit Customer
            </button>
          )}
        </div>
      </div>
    </>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 space-y-1">
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <p className="text-sm font-medium text-foreground truncate">{value || '—'}</p>
    </div>
  );
}
