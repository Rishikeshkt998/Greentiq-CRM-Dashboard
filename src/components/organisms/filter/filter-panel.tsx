'use client';

import { useState, useEffect } from 'react';
import { X, Save, Trash2, Phone, Mail, Search, Calendar, Star } from 'lucide-react';
import { CustomerFilterState, FilterPanelProps, STATUSES, PRESET_SAVED_FILTERS } from '@/types/filter';
import { CustomerStatus } from '@/types/customer/entity';
import { cn } from '@/lib/utils/cn';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { saveFilterPreset, fetchSavedFilters } from '@/services/filter/filter-service';
import { savedFilterKeys } from '@/services/customer/query-keys';
import { toast } from 'sonner';

export type { FilterPanelProps };

export function FilterPanel({ open, onClose, filters, onApply, availableCompanies }: FilterPanelProps) {
  const queryClient = useQueryClient();
  const [localFilters, setLocalFilters] = useState<CustomerFilterState>({
    ...filters,
    statuses: filters.statuses ?? [],
    companies: filters.companies ?? [],
  });

  useEffect(() => {
    if (open) {
      setLocalFilters({
        ...filters,
        statuses: filters.statuses ?? [],
        companies: filters.companies ?? [],
      });
    }
  }, [open, filters]);

  const [savePresetName, setSavePresetName] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [companyInput, setCompanyInput] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState('1');

  const { data: savedFiltersData } = useQuery({
    queryKey: savedFilterKeys.all,
    queryFn: fetchSavedFilters,
  });

  const { mutate: savePreset } = useMutation({
    mutationFn: ({ name, state }: { name: string; state: Partial<CustomerFilterState> }) =>
      saveFilterPreset(name, state),
    onSuccess: (savedData) => {
      queryClient.invalidateQueries({ queryKey: savedFilterKeys.all });
      toast.success(`Saved filter preset "${savedData.name}"!`);
      onApply(localFilters);
      setSavePresetName('');
      setShowSaveInput(false);
      onClose();
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

  const removeCompany = (company: string) => {
    setLocalFilters((prev) => ({ ...prev, companies: prev.companies.filter((c) => c !== company) }));
  };

  const addCompany = (company: string) => {
    if (!localFilters.companies.includes(company)) {
      setLocalFilters((prev) => ({ ...prev, companies: [...prev.companies, company] }));
    }
    setCompanyInput('');
  };

  const handleReset = () => {
    const cleared: CustomerFilterState = {
      search: '',
      statuses: [],
      companies: [],
      dateRange: {},
      phone: '',
      email: '',
      sortBy: filters.sortBy || 'name',
      sortOrder: filters.sortOrder || 'asc',
      page: 1,
      pageSize: filters.pageSize || 8,
    };
    setLocalFilters(cleared);
    onApply(cleared);
  };

  const filteredCompanies = availableCompanies.filter(
    (c) => c.toLowerCase().includes(companyInput.toLowerCase()) && !localFilters.companies.includes(c)
  );

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[310px] flex-col border-l border-border/80 bg-card shadow-2xl transition-colors duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-2.5 flex-shrink-0">
          <h2 className="text-sm font-bold text-foreground">Filters</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Compact Form Body (All visible at first glance) */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-3 space-y-3">
          {/* Save Custom Filter Section */}
          <section className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-2.5 space-y-1.5">
            <label className="text-[11px] font-bold text-foreground flex items-center gap-1">
              <Save className="h-3.5 w-3.5 text-blue-400" />
              Save Custom Filter
            </label>
            <div className="flex gap-1.5">
              <input
                type="text"
                placeholder="Preset name..."
                value={savePresetName}
                onChange={(e) => setSavePresetName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && savePresetName.trim()) {
                    savePreset({ name: savePresetName.trim(), state: localFilters });
                  }
                }}
                className="flex-1 rounded-lg border border-border/80 bg-card px-2.5 py-1 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => {
                  if (savePresetName.trim()) {
                    savePreset({ name: savePresetName.trim(), state: localFilters });
                  } else {
                    toast.error('Please enter a preset name');
                  }
                }}
                className="rounded-lg bg-blue-600 hover:bg-blue-700 px-3 py-1 text-xs font-bold text-white transition-colors cursor-pointer flex-shrink-0"
              >
                Save Filter
              </button>
            </div>
          </section>

          {/* Status Section */}
          <section className="space-y-1.5">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-bold text-foreground">Status</h3>
              <button
                onClick={handleReset}
                className="text-[10px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title="Clear all filters"
              >
                Clear All
              </button>
            </div>
            <div className="space-y-1">
              {STATUSES.map(({ key, label }) => {
                const isChecked = localFilters.statuses.includes(key);
                return (
                  <label key={key} className="flex items-center gap-2 cursor-pointer select-none group">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleStatus(key)}
                      className="h-3.5 w-3.5 rounded border-border/80 bg-background accent-blue-600 cursor-pointer"
                    />
                    <span className="text-[11px] font-medium text-foreground/90 group-hover:text-foreground">
                      {label}
                    </span>
                  </label>
                );
              })}
            </div>
          </section>

          {/* Company Section */}
          <section className="space-y-1.5">
            <h3 className="text-[11px] font-bold text-foreground">Company</h3>
            <div className="rounded-lg border border-border/80 bg-muted/30 p-1.5 space-y-1">
              <div className="flex flex-wrap gap-1">
                {localFilters.companies.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-foreground border border-border/60"
                  >
                    {c}
                    <button onClick={() => removeCompany(c)} className="text-muted-foreground hover:text-foreground">
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Add..."
                  value={companyInput}
                  onChange={(e) => setCompanyInput(e.target.value)}
                  className="w-full rounded-md border-0 bg-transparent px-1 py-0.5 text-[11px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                />
                {companyInput && filteredCompanies.length > 0 && (
                  <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-lg border border-border bg-card shadow-xl overflow-hidden">
                    {filteredCompanies.slice(0, 5).map((c) => (
                      <button
                        key={c}
                        onClick={() => addCompany(c)}
                        className="w-full px-2.5 py-1.5 text-left text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Date Range (Last Contact) */}
          <section className="space-y-1">
            <h3 className="text-[11px] font-bold text-foreground">Date Range (Last Contact)</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <span className="text-[10px] text-muted-foreground">From</span>
                <div className="relative">
                  <input
                    type="date"
                    value={localFilters.dateRange?.from || ''}
                    onChange={(e) => setLocalFilters((prev) => ({ ...prev, dateRange: { ...prev.dateRange, from: e.target.value } }))}
                    className="w-full rounded-lg border border-border/80 bg-muted/30 px-2.5 py-1 text-[11px] text-foreground focus:border-blue-500/50 focus:outline-none cursor-pointer"
                  />
                </div>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-muted-foreground">To</span>
                <div className="relative">
                  <input
                    type="date"
                    value={localFilters.dateRange?.to || ''}
                    onChange={(e) => setLocalFilters((prev) => ({ ...prev, dateRange: { ...prev.dateRange, to: e.target.value } }))}
                    className="w-full rounded-lg border border-border/80 bg-muted/30 px-2.5 py-1 text-[11px] text-foreground focus:border-blue-500/50 focus:outline-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Phone Number */}
          <section className="space-y-1">
            <h3 className="text-[11px] font-bold text-foreground">Phone Number</h3>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="(555) 123-4567"
                value={localFilters.phone}
                onChange={(e) => setLocalFilters((prev) => ({ ...prev, phone: e.target.value }))}
                className="w-full rounded-lg border border-border/80 bg-muted/30 pl-7 pr-2.5 py-1 text-[11px] text-foreground placeholder:text-muted-foreground/50 focus:border-blue-500/50 focus:outline-none"
              />
            </div>
          </section>

          {/* Email Contains */}
          <section className="space-y-1">
            <h3 className="text-[11px] font-bold text-foreground">Email Contains</h3>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-semibold">@</span>
              <input
                type="text"
                placeholder="e.g., @gmail.com"
                value={localFilters.email}
                onChange={(e) => setLocalFilters((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full rounded-lg border border-border/80 bg-muted/30 pl-7 pr-2.5 py-1 text-[11px] text-foreground placeholder:text-muted-foreground/50 focus:border-blue-500/50 focus:outline-none"
              />
            </div>
          </section>

          {/* Apply Filters Sky Blue Button */}
          <button
            onClick={() => {
              onApply(localFilters);
              onClose();
            }}
            className="w-full rounded-lg bg-[#60a5fa] hover:bg-[#3b82f6] py-2 text-xs font-extrabold text-slate-950 transition-colors shadow-xs text-center cursor-pointer"
          >
            Apply Filters
          </button>

          {/* Saved Filters (Bottom Section visible at first glance) */}
          <section className="space-y-1 pt-1.5 border-t border-border/40">
            <h3 className="text-[11px] font-bold text-foreground">Saved Filters</h3>
            <div className="space-y-0.5">
              {(savedFiltersData && savedFiltersData.length > 0 ? savedFiltersData : PRESET_SAVED_FILTERS).map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setSelectedPresetId(preset.id);
                      if ('filterState' in preset && preset.filterState) {
                        onApply(preset.filterState as Partial<CustomerFilterState>);
                      } else if (preset.name === 'Active Customers') {
                        onApply({ statuses: ['Active'] });
                      } else if (preset.name === 'Inactive Leads') {
                        onApply({ statuses: ['Inactive', 'Lead'] });
                      } else if (preset.name === 'High-value prospects') {
                        onApply({ statuses: ['Prospect'] });
                      } else {
                        onApply(localFilters);
                      }
                      onClose();
                    }}
                    className={cn(
                      'flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-colors text-left cursor-pointer',
                      isSelected
                        ? 'bg-muted/80 text-foreground font-bold shadow-2xs'
                        : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                    )}
                  >
                    <span>{preset.name}</span>
                    {'isStarred' in preset && preset.isStarred && <Star className="h-3 w-3 fill-muted-foreground text-muted-foreground" />}
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
