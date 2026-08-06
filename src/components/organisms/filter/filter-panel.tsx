'use client';

import { useState } from 'react';
import { X, SlidersHorizontal, Trash2, Save, Calendar } from 'lucide-react';
import { CustomerFilterState } from '@/types/filter/state';
import { CustomerStatus } from '@/types/customer/entity';
import { cn } from '@/lib/utils/cn';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { saveFilterPreset } from '@/services/filter/filter-service';
import { savedFilterKeys } from '@/services/customer/query-keys';
import { toast } from 'sonner';

interface FilterPanelProps {
  open: boolean;
  onClose: () => void;
  filters: CustomerFilterState;
  onApply: (filters: Partial<CustomerFilterState>) => void;
  availableCompanies: string[];
}

const STATUSES: CustomerStatus[] = ['Active', 'Inactive', 'Prospect', 'Lead', 'Archive'];
const STATUS_COLORS: Record<CustomerStatus, string> = {
  Active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Inactive: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  Prospect: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  Lead: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Archive: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
};

export function FilterPanel({ open, onClose, filters, onApply, availableCompanies }: FilterPanelProps) {
  const queryClient = useQueryClient();
  const [localFilters, setLocalFilters] = useState(filters);
  const [savePresetName, setSavePresetName] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);

  const { mutate: savePreset } = useMutation({
    mutationFn: ({ name, state }: { name: string; state: Partial<CustomerFilterState> }) =>
      saveFilterPreset(name, state),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: savedFilterKeys.all });
      toast.success('Filter preset saved!');
      setSavePresetName('');
      setShowSaveInput(false);
    },
    onError: () => toast.error('Failed to save preset'),
  });

  const toggleStatus = (status: CustomerStatus) => {
    setLocalFilters(prev => ({
      ...prev,
      statuses: prev.statuses.includes(status)
        ? prev.statuses.filter(s => s !== status)
        : [...prev.statuses, status],
    }));
  };

  const toggleCompany = (company: string) => {
    setLocalFilters(prev => ({
      ...prev,
      companies: prev.companies.includes(company)
        ? prev.companies.filter(c => c !== company)
        : [...prev.companies, company],
    }));
  };

  const handleReset = () => {
    setLocalFilters({
      ...filters,
      statuses: [],
      companies: [],
      dateRange: {},
      phone: '',
      email: '',
    });
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-white/10 bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-violet-400" />
            <h2 className="text-sm font-bold text-white">Advanced Filters</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/10 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto scrollbar-thin p-5">
          {/* Status Filter */}
          <section className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</h3>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map(status => (
                <button
                  key={status}
                  onClick={() => toggleStatus(status)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-all",
                    localFilters.statuses.includes(status)
                      ? STATUS_COLORS[status]
                      : "border-white/10 text-muted-foreground hover:border-white/20"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </section>

          {/* Company Filter */}
          {availableCompanies.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Company</h3>
              <div className="grid grid-cols-2 gap-1.5">
                {availableCompanies.slice(0, 10).map(company => (
                  <button
                    key={company}
                    onClick={() => toggleCompany(company)}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-left text-xs font-medium transition-all",
                      localFilters.companies.includes(company)
                        ? "border-violet-500/50 bg-violet-500/10 text-violet-300"
                        : "border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground"
                    )}
                  >
                    {company}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Date Range Filter */}
          <section className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Last Contact Date Range</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] text-muted-foreground">From</label>
                <input
                  type="date"
                  value={localFilters.dateRange.from || ''}
                  onChange={e => setLocalFilters(prev => ({ ...prev, dateRange: { ...prev.dateRange, from: e.target.value } }))}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-foreground focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] text-muted-foreground">To</label>
                <input
                  type="date"
                  value={localFilters.dateRange.to || ''}
                  onChange={e => setLocalFilters(prev => ({ ...prev, dateRange: { ...prev.dateRange, to: e.target.value } }))}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-foreground focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                />
              </div>
            </div>
          </section>

          {/* Email / Phone Partial Search */}
          <section className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact Search</h3>
            <div className="space-y-2.5">
              <input
                type="text"
                placeholder="Filter by email..."
                value={localFilters.email}
                onChange={e => setLocalFilters(prev => ({ ...prev, email: e.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
              />
              <input
                type="text"
                placeholder="Filter by phone..."
                value={localFilters.phone}
                onChange={e => setLocalFilters(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
              />
            </div>
          </section>

          {/* Save Preset */}
          <section className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Save Filter Preset</h3>
            {showSaveInput ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Preset name..."
                  value={savePresetName}
                  onChange={e => setSavePresetName(e.target.value)}
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />
                <button
                  onClick={() => {
                    if (savePresetName.trim()) {
                      savePreset({ name: savePresetName.trim(), state: localFilters });
                    }
                  }}
                  className="rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-500 transition-colors"
                >
                  <Save className="h-4 w-4" />
                </button>
                <button onClick={() => setShowSaveInput(false)} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-muted-foreground hover:text-white transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSaveInput(true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 px-4 py-2.5 text-xs font-medium text-muted-foreground hover:border-violet-500/40 hover:text-violet-400 transition-all"
              >
                <Save className="h-3.5 w-3.5" /> Save Current Filters as Preset
              </button>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 border-t border-white/[0.06] p-4">
          <button onClick={handleReset} className="flex items-center gap-1.5 rounded-lg border border-white/10 px-4 py-2 text-sm text-muted-foreground hover:text-red-400 hover:border-red-500/30 transition-colors">
            <Trash2 className="h-4 w-4" /> Reset
          </button>
          <button
            onClick={() => onApply(localFilters)}
            className="flex-1 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:from-violet-500 hover:to-indigo-500 transition-all"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
}
