'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2 } from 'lucide-react';
import { Customer } from '@/types/customer/entity';
import { customerSchema, CustomerFormValues } from '@/schemas/customer/customer.schema';
import { useCreateCustomer, useUpdateCustomer } from '@/hooks/customer/use-customers';
import { StatusPill } from '@/components/atoms/status-pill';
import { cn } from '@/lib/utils/cn';

interface CustomerFormSheetProps {
  open: boolean;
  onClose: () => void;
  customer?: Customer | null;
}

const STATUSES = ['Active', 'Inactive', 'Prospect', 'Lead', 'Archive'] as const;

export function CustomerFormSheet({ open, onClose, customer }: CustomerFormSheetProps) {
  const isEdit = !!customer;
  const { mutate: createCustomer, isPending: isCreating } = useCreateCustomer();
  const { mutate: updateCustomer, isPending: isUpdating } = useUpdateCustomer();
  const isPending = isCreating || isUpdating;

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: customer?.name ?? '',
      email: customer?.email ?? '',
      phone: customer?.phone ?? '',
      company: customer?.company ?? '',
      status: customer?.status ?? 'Active',
      lastContactDate: customer?.lastContactDate ?? new Date().toISOString().split('T')[0],
      notes: customer?.notes ?? '',
      dealValue: customer?.dealValue,
    },
  });

  const onSubmit = (values: CustomerFormValues) => {
    if (isEdit && customer) {
      updateCustomer({ id: customer.id, ...values }, { onSuccess: () => { onClose(); reset(); } });
    } else {
      createCustomer(values, { onSuccess: () => { onClose(); reset(); } });
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-white/10 bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-white">{isEdit ? 'Edit Customer' : 'Add New Customer'}</h2>
            <p className="text-xs text-muted-foreground">{isEdit ? `Editing ${customer?.name}` : 'Fill in the customer details below'}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/10 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-4 overflow-y-auto scrollbar-thin p-5">
            {/* Name & Email */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Full Name" error={errors.name?.message}>
                <input {...register('name')} placeholder="John Smith" className={inputClass(!!errors.name)} />
              </Field>
              <Field label="Email" error={errors.email?.message}>
                <input {...register('email')} type="email" placeholder="john@company.com" className={inputClass(!!errors.email)} />
              </Field>
            </div>

            {/* Phone & Company */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Phone" error={errors.phone?.message}>
                <input {...register('phone')} placeholder="+1 (555) 000-0000" className={inputClass(!!errors.phone)} />
              </Field>
              <Field label="Company" error={errors.company?.message}>
                <input {...register('company')} placeholder="Acme Corp" className={inputClass(!!errors.company)} />
              </Field>
            </div>

            {/* Status */}
            <Field label="Status" error={errors.status?.message}>
              <select {...register('status')} className={inputClass(!!errors.status)}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>

            {/* Last Contact Date & Deal Value */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Last Contact Date" error={errors.lastContactDate?.message}>
                <input {...register('lastContactDate')} type="date" className={inputClass(!!errors.lastContactDate)} />
              </Field>
              <Field label="Deal Value ($)" error={errors.dealValue?.message}>
                <input {...register('dealValue')} type="number" placeholder="25000" className={inputClass(!!errors.dealValue)} />
              </Field>
            </div>

            {/* Notes */}
            <Field label="Notes (Optional)" error={errors.notes?.message}>
              <textarea {...register('notes')} rows={3} placeholder="Customer notes, meeting details..." className={cn(inputClass(!!errors.notes), "resize-none")} />
            </Field>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2.5 border-t border-white/[0.06] p-4">
            <button type="button" onClick={onClose} className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-muted-foreground hover:border-white/20 hover:text-foreground transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex min-w-[120px] items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-70 transition-all"
            >
              {isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : isEdit ? 'Update Customer' : 'Add Customer'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    "w-full rounded-lg border bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 transition-all",
    hasError
      ? "border-red-500/50 focus:ring-red-500/20"
      : "border-white/10 focus:border-violet-500/50 focus:ring-violet-500/20"
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
      {error && <p className="text-[11px] text-red-400">{error}</p>}
    </div>
  );
}
