'use client';

import { Search, ChevronDown, Download, SlidersHorizontal, X } from 'lucide-react';
import { CustomerStatus } from '@/types/customer/entity';
import { cn } from '@/lib/utils/cn';

const ALL_STATUSES: CustomerStatus[] = ['Active', 'Inactive', 'Prospect', 'Lead', 'Archive'];

interface CustomerToolbarProps {
  searchInput: string;
  onSearchChange: (value: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  companyFilter: string;
  onCompanyChange: (company: string) => void;
  availableCompanies: string[];
  selectedCount: number;
  onExportCSV: () => void;
  activeFilterCount: number;
  onToggleFilterPanel: () => void;
  canAddCustomer: boolean;
  onAddCustomer: () => void;
}

export function CustomerToolbar({
  searchInput,
  onSearchChange,
  searchInputRef,
  statusFilter,
  onStatusChange,
  companyFilter,
  onCompanyChange,
  availableCompanies,
  selectedCount,
  onExportCSV,
  activeFilterCount,
  onToggleFilterPanel,
  canAddCustomer,
  onAddCustomer,
}: CustomerToolbarProps) {
  return (
    <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1 overflow-visible pt-2 sm:pt-3 pb-1">
      <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">Customers</h2>

      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 sm:ml-auto overflow-visible">
        {/* Search Input */}
        <div className="relative w-full sm:w-56 md:w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search customers… (Ctrl+K)"
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-border/80 bg-card/80 py-1.5 pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-2xs font-normal"
          />
          {searchInput && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Status Dropdown */}
        <div className="relative flex-1 sm:flex-none">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full sm:w-auto appearance-none rounded-lg border border-border/80 bg-card/80 py-1.5 pl-3 pr-7 text-xs text-foreground cursor-pointer focus:border-primary/50 focus:outline-none transition-all shadow-2xs"
          >
            <option value="All">Status: All</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
        </div>

        {/* Company Dropdown */}
        <div className="relative flex-1 sm:flex-none">
          <select
            value={companyFilter}
            onChange={(e) => onCompanyChange(e.target.value)}
            className="w-full sm:w-auto appearance-none rounded-lg border border-border/80 bg-card/80 py-1.5 pl-3 pr-7 text-xs text-foreground cursor-pointer focus:border-primary/50 focus:outline-none transition-all shadow-2xs"
          >
            <option value="All">Company: All</option>
            {availableCompanies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
        </div>

        {/* Export CSV Button */}
        <button
          onClick={onExportCSV}
          className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-card/80 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-emerald-500/50 hover:text-emerald-500 transition-all shadow-2xs cursor-pointer"
          title={selectedCount > 0 ? `Export ${selectedCount} selected` : 'Export all to CSV'}
        >
          <Download className="h-3.5 w-3.5" />
          <span className="inline">{selectedCount > 0 ? `Export (${selectedCount})` : 'CSV'}</span>
        </button>

        {/* Filter Drawer Toggle Button */}
        <div className="relative">
          <button
            onClick={onToggleFilterPanel}
            className={cn(
              'flex items-center justify-center rounded-lg border border-border/80 bg-card/80 p-2 text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all shadow-2xs cursor-pointer',
              activeFilterCount > 0 && 'border-primary text-primary bg-primary/10'
            )}
            title="Filter Drawer (Ctrl+B)"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
          {activeFilterCount > 0 && (
            <span className="absolute -top-2.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-extrabold text-white pointer-events-none">
              {activeFilterCount}
            </span>
          )}
        </div>

        {/* Add Customer Button */}
        {canAddCustomer && (
          <button
            onClick={onAddCustomer}
            className="rounded-lg bg-blue-600 hover:bg-blue-700 px-3.5 sm:px-4 py-1.5 text-xs font-bold text-white transition-colors shadow-2xs cursor-pointer"
          >
            Add Customer
          </button>
        )}
      </div>
    </div>
  );
}
