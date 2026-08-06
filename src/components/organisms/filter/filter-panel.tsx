'use client';

import { useState } from 'react';
import { X, Search, Save, Trash2, Phone, Mail } from 'lucide-react';
import { CustomerFilterState } from '@/types/filter/state';
import { CustomerStatus } from '@/types/customer/entity';
import { cn } from '@/lib/utils/cn';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { saveFilterPreset, fetchSavedFilters } from '@/services/filter/filter-service';
import { savedFilterKeys } from '@/services/customer/query-keys';
import { toast } from 'sonner';

interface FilterPanelProps {
  open: boolean;
  onClose: () => void;
  filters: CustomerFilterState;
  onApply: (filters: Partial<CustomerFilterState>) => void;
  availableCompanies: string[];
}

const STATUSES: { key: CustomerStatus; label: string }[] = [
  { key: 'Active', label: 'Active Customer' },
  { key: 'Prospect', label: 'Prospect' },
  { key: 'Lead', label: 'Lead' },
  { key: 'Inactive', label: 'Inactive Customer' },
  { key: 'Archive', label: 'Archive' },
];

export function FilterPanel({ open, onClose, filters, onApply, availableCompanies }: FilterPanelProps) {
  const queryClient = useQueryClient();
  const [localFilters, setLocalFilters] = useState(filters);
  const [savePresetName, setSavePresetName] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [companyInput, setCompanyInput] = useState('');

  const { data: savedFiltersData } = useQuery({
    queryKey: savedFilterKeys.all,
    queryFn: fetchSavedFilters,
  });

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
    setLocalFilters((prev) => ({
      ...prev,
      statuses: prev.statuses.includes(status)
        ? prev.statuses.filter((s) => s !== status)
        : [...prev.statuses, status],
    }));
  };

  const addCompany = (company: string) => {
    if (!localFilters.companies.includes(company)) {
      setLocalFilters((prev) => ({ ...prev, companies: [...prev.companies, company] }));
    }
    setCompanyInput('');
  };

  const removeCompany = (company: string) => {
    setLocalFilters((prev) => ({ ...prev, companies: prev.companies.filter((c) => c !== company) }));
  };

  const handleReset = () => {
    setLocalFilters({ ...filters, statuses: [], companies: [], dateRange: {}, phone: '', email: '' });
  };

  const filteredCompanies = availableCompanies.filter(
    (c) => c.toLowerCase().includes(companyInput.toLowerCase()) && !localFilters.companies.includes(c)
  );

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[340px] flex-col border-l border-white/[0.08] bg-[hsl(220,40%,9%)] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
          <h2 className="text-base font-bold text-white">Filters</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-5">
          {/* Save Filter button */}
          {showSaveInput ? (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Filter name..."
                value={savePresetName}
                onChange={(e) => setSavePresetName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && savePresetName.trim()) {
                    savePreset({ name: savePresetName.trim(), state: localFilters });
                  }
                }}
                autoFocus
                className="flex-1 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button
                onClick={() => { if (savePresetName.trim()) savePreset({ name: savePresetName.trim(), state: localFilters }); }}
                className="rounded-lg bg-primary px-3 py-2 text-white hover:bg-primary/90 transition-colors"
              >
                <Save className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowSaveInput(false)}
                className="rounded-lg border border-white/10 px-3 py-2 text-muted-foreground hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowSaveInput(true)}
              className="w-full rounded-lg border border-white/15 bg-white/[0.03] py-2.5 text-sm font-medium text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              Save Filter
            </button>
          )}

          {/* Status */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Status</h3>
              {localFilters.statuses.length > 0 && (
                <button
                  onClick={() => setLocalFilters((prev) => ({ ...prev, statuses: [] }))}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
            <div className="space-y-2">
              {STATUSES.map(({ key, label }) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer group">
                  <div
                    className={cn(
                      'flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-all',
                      localFilters.statuses.includes(key)
                        ? 'border-primary bg-primary'
                        : 'border-white/25 bg-white/[0.04] group-hover:border-primary/50'
                    )}
                    onClick={() => toggleStatus(key)}
                  >
                    {localFilters.statuses.includes(key) && (
                      <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span
                    className="text-sm text-muted-foreground group-hover:text-foreground transition-colors"
                    onClick={() => toggleStatus(key)}
                  >
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {/* Company */}
          {availableCompanies.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-white">Company</h3>
              {/* Selected company tags */}
              {localFilters.companies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {localFilters.companies.map((c) => (
                    <span
                      key={c}
                      className="inline-flex items-center gap-1 rounded-lg bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary ring-1 ring-primary/30"
                    >
                      {c}
                      <button onClick={() => removeCompany(c)} className="hover:text-white transition-colors">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              {/* Company input/dropdown */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Add..."
                  value={companyInput}
                  onChange={(e) => setCompanyInput(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
                {companyInput && filteredCompanies.length > 0 && (
                  <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-lg border border-white/10 bg-[hsl(220,38%,11%)] shadow-xl overflow-hidden">
                    {filteredCompanies.slice(0, 5).map((c) => (
                      <button
                        key={c}
                        onClick={() => addCompany(c)}
                        className="w-full px-3 py-2 text-left text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Date Range */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-white">Date Range (Last Contact)</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">From</label>
                <input
                  type="date"
                  value={localFilters.dateRange?.from || ''}
                  onChange={(e) => setLocalFilters((prev) => ({ ...prev, dateRange: { ...prev.dateRange, from: e.target.value } }))}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">To</label>
                <input
                  type="date"
                  value={localFilters.dateRange?.to || ''}
                  onChange={(e) => setLocalFilters((prev) => ({ ...prev, dateRange: { ...prev.dateRange, to: e.target.value } }))}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
          </section>

          {/* Phone Number */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-white">Phone Number</h3>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="(555) 123-4567"
                value={localFilters.phone}
                onChange={(e) => setLocalFilters((prev) => ({ ...prev, phone: e.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </section>

          {/* Email */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-white">Email Contains</h3>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="e.g., @gmail.com"
                value={localFilters.email}
                onChange={(e) => setLocalFilters((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </section>

          {/* Apply Filters */}
          <button
            onClick={() => onApply(localFilters)}
            className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            Apply Filters
          </button>

          {/* Saved Filters */}
          {savedFiltersData && savedFiltersData.length > 0 && (
            <section className="space-y-2 pt-1">
              <h3 className="text-sm font-semibold text-white">Saved Filters</h3>
              <div className="space-y-1">
                {savedFiltersData.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      onApply(preset.filterState);
                      onClose();
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-white/[0.04] hover:text-foreground transition-colors"
                  >
                    <span>{preset.name}</span>
                    {preset.isSystemPreset && (
                      <span className="text-xs text-muted-foreground/50">★</span>
                    )}
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Reset footer */}
        <div className="border-t border-white/[0.08] p-4">
          <button
            onClick={handleReset}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 py-2 text-sm text-muted-foreground hover:border-red-500/30 hover:text-red-400 transition-colors"
          >
            <Trash2 className="h-4 w-4" /> Reset All Filters
          </button>
        </div>
      </div>
    </>
  );
}
