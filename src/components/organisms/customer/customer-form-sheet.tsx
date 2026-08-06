'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2, Calendar } from 'lucide-react';
import { Customer } from '@/types/customer/entity';
import { customerSchema, CustomerFormValues } from '@/schemas/customer/customer.schema';
import { useCreateCustomer, useUpdateCustomer } from '@/hooks/customer/use-customers';
import { cn } from '@/lib/utils/cn';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

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

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    mode: 'onChange',
    defaultValues: {
      name: customer?.name ?? '',
      email: customer?.email ?? '',
      phone: customer?.phone ?? '',
      company: customer?.company ?? '',
      status: customer?.status ?? 'Active',
      lastContactDate: customer?.lastContactDate ?? '',
      notes: customer?.notes ?? '',
      dealValue: customer?.dealValue,
    },
  });

  const { watch, reset, formState: { errors } } = form;
  const watchName = watch('name');
  const watchEmail = watch('email');

  useEffect(() => {
    if (open) {
      reset({
        name: customer?.name ?? '',
        email: customer?.email ?? '',
        phone: customer?.phone ?? '',
        company: customer?.company ?? '',
        status: customer?.status ?? 'Active',
        lastContactDate: customer?.lastContactDate ?? '',
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

  const isNameValid = Boolean(watchName && watchName.trim().length > 2 && !errors.name);
  const isEmailValid = Boolean(watchEmail && watchEmail.includes('@') && !errors.email);

  const inputBase = 'w-full rounded-lg border bg-muted/40 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-all';

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs" onClick={onClose} />

      {/* Modal — theme-aware */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border/80 bg-card shadow-2xl transition-colors duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 px-5 pt-3.5 pb-1">
          <h2 className="text-sm font-bold text-foreground">
            {isEdit ? 'Edit Customer' : 'Add Customer'}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Shadcn Form Body */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2 px-5 py-2">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <FormLabel className="text-[11px] font-semibold text-foreground/90">
                      Name <span className="text-[10px] font-normal text-muted-foreground">*required *</span>
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <input
                          {...field}
                          placeholder="John Doe"
                          className={cn(
                            inputBase,
                            isNameValid || isEdit
                              ? 'border-emerald-500 ring-1 ring-emerald-500/20'
                              : errors.name ? 'border-red-500/80' : 'border-border/80'
                          )}
                        />
                      </FormControl>
                      {(isNameValid || isEdit) && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-white pointer-events-none">
                          <svg className="h-2 w-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <FormLabel className="text-[11px] font-semibold text-foreground/90">
                      Email <span className="text-[10px] font-normal text-muted-foreground">*required *</span>
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <input
                          {...field}
                          type="email"
                          placeholder="john.doe@example.com"
                          className={cn(
                            inputBase,
                            isEmailValid || isEdit
                              ? 'border-emerald-500 ring-1 ring-emerald-500/20'
                              : errors.email ? 'border-red-500/80' : 'border-border/80'
                          )}
                        />
                      </FormControl>
                      {(isEmailValid || isEdit) && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-white pointer-events-none">
                          <svg className="h-2 w-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <FormLabel className="text-[11px] font-semibold text-foreground/90">
                      Phone <span className="text-muted-foreground">*</span>
                    </FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        placeholder="+1 (555) 123-4567"
                        className={cn(inputBase, errors.phone ? 'border-red-500/80' : 'border-border/80')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Company */}
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <FormLabel className="text-[11px] font-semibold text-foreground/90">Company</FormLabel>
                    <FormControl>
                      <input {...field} placeholder="Acme Corp" className={cn(inputBase, 'border-border/80')} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status + Last Contact Date */}
              <div className="grid grid-cols-2 gap-2.5">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="space-y-0.5">
                      <FormLabel className="text-[11px] font-semibold text-foreground/90">Status</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <select
                            {...field}
                            className={cn(inputBase, 'border-border/80 cursor-pointer appearance-none pr-7')}
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>{s === 'Active' ? 'Active Customer' : s}</option>
                            ))}
                          </select>
                        </FormControl>
                        <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastContactDate"
                  render={({ field }) => (
                    <FormItem className="space-y-0.5">
                      <FormLabel className="text-[11px] font-semibold text-foreground/90">Last Contact Date</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <input
                            {...field}
                            type="text"
                            placeholder="15/10/2023"
                            className={cn(inputBase, 'border-border/80 pr-8')}
                          />
                        </FormControl>
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <FormLabel className="text-[11px] font-semibold text-foreground/90">Notes</FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        rows={2}
                        placeholder="Meeting notes and follow-up items..."
                        className={cn(inputBase, 'border-border/80 resize-none p-2.5')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2.5 border-t border-border/60 px-5 pt-2 pb-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg bg-muted hover:bg-muted/70 px-3.5 py-1.5 text-xs font-semibold text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-1.5 text-xs font-bold text-white transition-colors shadow-xs disabled:opacity-60"
              >
                {isPending ? (
                  <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...</>
                ) : isEdit ? 'Update Customer' : 'Add Customer'}
              </button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
