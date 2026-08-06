'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2, CheckCircle2 } from 'lucide-react';
import { Customer } from '@/types/customer/entity';
import { customerSchema, CustomerFormValues } from '@/schemas/customer/customer.schema';
import { useCreateCustomer, useUpdateCustomer } from '@/hooks/customer/use-customers';
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

  const { register, handleSubmit, formState: { errors, dirtyFields, isValid }, reset, watch } =
    useForm<CustomerFormValues>({
      resolver: zodResolver(customerSchema),
      mode: 'onChange',
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

  useEffect(() => {
    if (open) {
      reset({
        name: customer?.name ?? '',
        email: customer?.email ?? '',
        phone: customer?.phone ?? '',
        company: customer?.company ?? '',
        status: customer?.status ?? 'Active',
        lastContactDate: customer?.lastContactDate ?? new Date().toISOString().split('T')[0],
        notes: customer?.notes ?? '',
        dealValue: customer?.dealValue,
      });
    }
  }, [open, customer, reset]);

  const onSubmit = (values: CustomerFormValues) => {
    if (isEdit && customer) {
      updateCustomer({ id: customer.id, ...values }, { onSuccess: () => { onClose(); } });
    } else {
      createCustomer(values, { onSuccess: () => { onClose(); } });
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-[hsl(220,38%,11%)] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-4">
          <h2 className="text-lg font-bold text-white">
            {isEdit ? 'Edit Customer' : 'Add Customer'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 p-6">
            {/* Name */}
            <Field
              label="Name"
              required
              error={errors.name?.message}
              isValid={dirtyFields.name && !errors.name}
            >
              <input
                {...register('name')}
                placeholder="John Doe"
                className={inputClass(!!errors.name)}
              />
            </Field>

            {/* Email */}
            <Field
              label="Email"
              required
              error={errors.email?.message}
              isValid={dirtyFields.email && !errors.email}
            >
              <input
                {...register('email')}
                type="email"
                placeholder="john.doe@example.com"
                className={inputClass(!!errors.email)}
              />
            </Field>

            {/* Phone */}
            <Field label="Phone" required error={errors.phone?.message}>
              <input
                {...register('phone')}
                placeholder="+1 (555) 123-4567"
                className={inputClass(!!errors.phone)}
              />
            </Field>

            {/* Company */}
            <Field label="Company" error={errors.company?.message}>
              <input
                {...register('company')}
                placeholder="Acme Corp"
                className={inputClass(!!errors.company)}
              />
            </Field>

            {/* Status + Last Contact Date */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Status" error={errors.status?.message}>
                <select {...register('status')} className={inputClass(!!errors.status)}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s === 'Active' ? 'Active Customer' : s}</option>
                  ))}
                </select>
              </Field>
              <Field label="Last Contact Date" error={errors.lastContactDate?.message}>
                <input
                  {...register('lastContactDate')}
                  type="date"
                  className={inputClass(!!errors.lastContactDate)}
                />
              </Field>
            </div>

            {/* Notes */}
            <Field label="Notes" error={errors.notes?.message}>
              <textarea
                {...register('notes')}
                rows={3}
                placeholder="Meeting notes and follow-up items..."
                className={cn(inputClass(!!errors.notes), 'resize-none')}
              />
            </Field>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-white/[0.07] px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-white/15 px-5 py-2 text-sm font-medium text-muted-foreground hover:border-white/25 hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex min-w-[140px] items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60 transition-colors"
            >
              {isPending ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
              ) : isEdit ? 'Update Customer' : 'Add Customer'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    'w-full rounded-lg border bg-white/[0.05] px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 transition-all',
    hasError
      ? 'border-red-500/50 focus:ring-red-500/20'
      : 'border-white/10 focus:border-primary/60 focus:ring-primary/20'
  );
}

function Field({
  label,
  required,
  error,
  isValid,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  isValid?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground/80">
        {label}
        {required && <span className="ml-1 text-xs text-muted-foreground">* required *</span>}
      </label>
      <div className="relative">
        {children}
        {isValid && (
          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-400 pointer-events-none" />
        )}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
