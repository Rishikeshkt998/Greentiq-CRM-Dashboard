'use client';

import { Suspense, useState } from 'react';
import { useCustomerFilters } from '@/hooks/filter/use-customer-filters';
import { useCustomers, useDeleteCustomer } from '@/hooks/customer/use-customers';
import { useDebounce } from '@/hooks/common/use-debounce';
import { useAuth } from '@/hooks/auth/use-auth';
import { Customer } from '@/types/customer/entity';
import { StatusPill } from '@/components/atoms/status-pill';
import { Avatar } from '@/components/atoms/avatar';
import { TableRowSkeleton } from '@/components/atoms/skeleton';
import { formatDate, formatCurrency } from '@/lib/utils/formatters';
import {
  Users, TrendingUp, Activity, UserPlus, Search, Filter, SlidersHorizontal,
  ChevronUp, ChevronDown, ChevronsUpDown, MoreHorizontal, Pencil, Trash2,
  Eye, Download, ChevronLeft, ChevronRight, LogOut, Leaf, Menu, X,
  Building2, Phone, Mail, Calendar, ArrowUpDown, Plus, RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { CustomerFormSheet } from '@/components/organisms/customer/customer-form-sheet';
import { CustomerDetailModal } from '@/components/organisms/customer/customer-detail-modal';
import { FilterPanel } from '@/components/organisms/filter/filter-panel';
import { AuthModal } from '@/components/organisms/auth/auth-modal';
import { SavedFiltersBar } from '@/components/organisms/filter/saved-filters-bar';

function DashboardContent() {
  const { filters, updateFilters, resetFilters, activeFilterCount } = useCustomerFilters();
  const [searchInput, setSearchInput] = useState(filters.search);
  const debouncedSearch = useDebounce(searchInput, 300);
  const { user, isAuthenticated, isAuthEnabled, logout, permissions } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showFormSheet, setShowFormSheet] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sync debounced search to filters
  const activeFilters = { ...filters, search: debouncedSearch };
  const { data, isLoading, isFetching, refetch } = useCustomers(activeFilters);
  const { mutate: deleteCustomer } = useDeleteCustomer();

  const customers = data?.data ?? [];
  const meta = data?.meta;
  const availableCompanies = data?.availableCompanies ?? [];

  const handleSort = (column: string) => {
    if (filters.sortBy === column) {
      updateFilters({ sortBy: column, sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc', page: 1 });
    } else {
      updateFilters({ sortBy: column, sortOrder: 'asc', page: 1 });
    }
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (filters.sortBy !== column) return <ChevronsUpDown className="h-3.5 w-3.5 opacity-30" />;
    return filters.sortOrder === 'asc'
      ? <ChevronUp className="h-3.5 w-3.5 text-violet-400" />
      : <ChevronDown className="h-3.5 w-3.5 text-violet-400" />;
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === customers.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(customers.map(c => c.id)));
    }
  };

  const handleBulkDelete = () => {
    if (!permissions.canDeleteCustomer) return;
    Array.from(selectedIds).forEach(id => deleteCustomer(id));
    setSelectedIds(new Set());
  };

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Status', 'Last Contact', 'Deal Value'];
    const rows = customers.map(c => [
      c.name, c.email, c.phone, c.company, c.status, c.lastContactDate, c.dealValue?.toString() ?? ''
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'greentiq-customers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const metrics = [
    { label: 'Total Customers', value: meta?.total ?? 0, icon: Users, color: 'text-violet-400', bg: 'bg-violet-500/10', trend: '+12%' },
    { label: 'Active', value: (data?.data ?? []).filter(c => c.status === 'Active').length, icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10', trend: '+5%' },
    { label: 'New Leads', value: (data?.data ?? []).filter(c => c.status === 'Lead').length, icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10', trend: '+18%' },
    { label: 'Prospects', value: (data?.data ?? []).filter(c => c.status === 'Prospect').length, icon: UserPlus, color: 'text-indigo-400', bg: 'bg-indigo-500/10', trend: '+8%' },
  ];

  const navItems = [
    { label: 'Dashboard', icon: Activity, active: true },
    { label: 'Contacts', icon: Users, active: false },
    { label: 'Companies', icon: Building2, active: false },
    { label: 'Deals', icon: TrendingUp, active: false },
  ];

  if (isAuthEnabled && !isAuthenticated) {
    return <AuthModal onSuccess={() => {}} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/[0.06] bg-card transition-transform duration-300 lg:static lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="flex h-16 items-center gap-2.5 px-5 border-b border-white/[0.06]">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
            <Leaf className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight text-white">Greentiq</p>
            <p className="text-[10px] text-muted-foreground">CRM Platform</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 p-3 pt-4">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                item.active
                  ? "bg-violet-500/15 text-violet-300"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* User Profile Footer */}
        <div className="border-t border-white/[0.06] p-3">
          <div className="flex items-center gap-3 rounded-lg p-2">
            <Avatar src={user?.avatarUrl} name={user?.name ?? 'User'} size="sm" />
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-xs font-semibold text-foreground">{user?.name ?? 'Alex Rivera'}</p>
              <p className="truncate text-[10px] text-muted-foreground">{user?.role ?? 'Admin'}</p>
            </div>
            {isAuthEnabled && (
              <button onClick={logout} className="p-1 rounded text-muted-foreground hover:text-red-400 transition-colors">
                <LogOut className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-white/[0.06] bg-card px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground lg:hidden"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div>
              <h1 className="text-base font-bold text-white">Customer Management</h1>
              <p className="text-[11px] text-muted-foreground">
                {meta?.total ?? '—'} total customers
                {isFetching && !isLoading && <span className="ml-2 text-violet-400">• Syncing...</span>}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => refetch()} className="hidden rounded-lg border border-white/10 p-2 text-muted-foreground hover:border-violet-500/40 hover:text-violet-400 transition-all sm:flex">
              <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
            </button>
            <button onClick={exportCSV} className="hidden items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-muted-foreground hover:border-violet-500/40 hover:text-violet-400 transition-all sm:flex">
              <Download className="h-3.5 w-3.5" /> Export CSV
            </button>
            {permissions.canAddCustomer && (
              <button
                onClick={() => { setEditCustomer(null); setShowFormSheet(true); }}
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-violet-500/25 hover:from-violet-500 hover:to-indigo-500 transition-all"
              >
                <Plus className="h-3.5 w-3.5" /> Add Customer
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-auto scrollbar-thin p-4 lg:p-6 space-y-5">
          {/* Metric Cards */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="glass-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">{metric.label}</p>
                  <div className={cn("rounded-lg p-1.5", metric.bg)}>
                    <metric.icon className={cn("h-4 w-4", metric.color)} />
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{metric.value.toLocaleString()}</p>
                  <p className="text-[11px] text-emerald-400 mt-0.5">{metric.trend} from last month</p>
                </div>
              </div>
            ))}
          </div>

          {/* Saved Filters Bar */}
          <SavedFiltersBar onApplyFilter={(state) => updateFilters(state)} />

          {/* Search & Filter Bar */}
          <div className="glass-card p-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Search Input */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search name, email, or company..."
                  value={searchInput}
                  onChange={(e) => { setSearchInput(e.target.value); }}
                  className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                />
                {searchInput && (
                  <button onClick={() => { setSearchInput(''); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilterPanel(true)}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all",
                  activeFilterCount > 0
                    ? "border-violet-500/50 bg-violet-500/10 text-violet-300"
                    : "border-white/10 text-muted-foreground hover:border-violet-500/30 hover:text-foreground"
                )}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-violet-500 text-[10px] font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {activeFilterCount > 0 && (
                <button onClick={resetFilters} className="text-xs text-muted-foreground hover:text-red-400 transition-colors px-2 py-1">
                  Clear all
                </button>
              )}

              {/* Page Size Selector */}
              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Show:</span>
                <select
                  value={filters.pageSize}
                  onChange={(e) => updateFilters({ pageSize: Number(e.target.value), page: 1 })}
                  className="rounded-lg border border-white/10 bg-card px-2 py-1.5 text-xs text-foreground focus:border-violet-500/50 focus:outline-none"
                >
                  {[10, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-3 rounded-lg border border-violet-500/30 bg-violet-500/10 px-4 py-2.5">
              <span className="text-sm font-medium text-violet-300">{selectedIds.size} selected</span>
              {permissions.canDeleteCustomer && (
                <button onClick={handleBulkDelete} className="flex items-center gap-1.5 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors">
                  <Trash2 className="h-3.5 w-3.5" /> Delete Selected
                </button>
              )}
              <button onClick={() => setSelectedIds(new Set())} className="ml-auto text-xs text-muted-foreground hover:text-foreground">
                Cancel
              </button>
            </div>
          )}

          {/* Customer Table */}
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                    <th className="w-10 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={customers.length > 0 && selectedIds.size === customers.length}
                        onChange={toggleSelectAll}
                        className="rounded border-white/20 bg-white/5 accent-violet-500"
                      />
                    </th>
                    {[
                      { key: 'name', label: 'Customer' },
                      { key: 'phone', label: 'Phone' },
                      { key: 'company', label: 'Company' },
                      { key: 'status', label: 'Status' },
                      { key: 'lastContactDate', label: 'Last Contact' },
                    ].map(col => (
                      <th key={col.key} className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort(col.key)}
                          className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {col.label}
                          <SortIcon column={col.key} />
                        </button>
                      </th>
                    ))}
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading
                    ? Array.from({ length: filters.pageSize }).map((_, i) => <TableRowSkeleton key={i} />)
                    : customers.length === 0
                    ? (
                      <tr>
                        <td colSpan={7} className="py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <Users className="h-10 w-10 text-muted-foreground/30" />
                            <p className="text-sm font-medium text-muted-foreground">No customers found</p>
                            <p className="text-xs text-muted-foreground/60">Try adjusting your search or filter criteria</p>
                            {activeFilterCount > 0 && (
                              <button onClick={resetFilters} className="mt-1 rounded-lg border border-violet-500/30 px-4 py-1.5 text-xs font-medium text-violet-400 hover:bg-violet-500/10 transition-colors">
                                Clear Filters
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                    : customers.map(customer => (
                      <tr
                        key={customer.id}
                        className={cn(
                          "border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]",
                          selectedIds.has(customer.id) && "bg-violet-500/5"
                        )}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(customer.id)}
                            onChange={() => toggleSelect(customer.id)}
                            className="rounded border-white/20 bg-white/5 accent-violet-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar src={customer.avatarUrl} name={customer.name} size="sm" />
                            <div>
                              <p className="text-sm font-semibold text-foreground">{customer.name}</p>
                              <p className="text-xs text-muted-foreground">{customer.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{customer.phone}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{customer.company}</td>
                        <td className="px-4 py-3"><StatusPill status={customer.status} /></td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(customer.lastContactDate)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button onClick={() => setViewCustomer(customer)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/10 hover:text-violet-400 transition-all" title="View Details">
                              <Eye className="h-4 w-4" />
                            </button>
                            {permissions.canEditCustomer && (
                              <button onClick={() => { setEditCustomer(customer); setShowFormSheet(true); }} className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/10 hover:text-amber-400 transition-all" title="Edit Customer">
                                <Pencil className="h-4 w-4" />
                              </button>
                            )}
                            {permissions.canDeleteCustomer && (
                              <button onClick={() => deleteCustomer(customer.id)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition-all" title="Delete Customer">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            {meta && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] px-4 py-3">
                <p className="text-xs text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{((meta.page - 1) * meta.pageSize) + 1}</span>–<span className="font-semibold text-foreground">{Math.min(meta.page * meta.pageSize, meta.total)}</span> of <span className="font-semibold text-foreground">{meta.total}</span> customers
                </p>
                <div className="flex items-center gap-1">
                  <button disabled={!meta.hasPrevPage} onClick={() => updateFilters({ page: meta.page - 1 })} className="rounded-lg border border-white/10 p-1.5 text-muted-foreground hover:border-violet-500/40 hover:text-violet-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {Array.from({ length: Math.min(meta.totalPages, 5) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => updateFilters({ page })}
                        className={cn(
                          "min-w-[32px] rounded-lg border px-2.5 py-1 text-xs font-medium transition-all",
                          meta.page === page
                            ? "border-violet-500/50 bg-violet-500/15 text-violet-300"
                            : "border-white/10 text-muted-foreground hover:border-violet-500/30"
                        )}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button disabled={!meta.hasNextPage} onClick={() => updateFilters({ page: meta.page + 1 })} className="rounded-lg border border-white/10 p-1.5 text-muted-foreground hover:border-violet-500/40 hover:text-violet-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Panels & Modals */}
      <FilterPanel
        open={showFilterPanel}
        onClose={() => setShowFilterPanel(false)}
        filters={filters}
        onApply={(newFilters) => { updateFilters(newFilters); setShowFilterPanel(false); }}
        availableCompanies={availableCompanies}
      />
      <CustomerFormSheet
        open={showFormSheet}
        onClose={() => { setShowFormSheet(false); setEditCustomer(null); }}
        customer={editCustomer}
      />
      {viewCustomer && (
        <CustomerDetailModal
          customer={viewCustomer}
          open={!!viewCustomer}
          onClose={() => setViewCustomer(null)}
          onEdit={(c) => { setViewCustomer(null); setEditCustomer(c); setShowFormSheet(true); }}
        />
      )}
      {showAuthModal && <AuthModal onSuccess={() => setShowAuthModal(false)} />}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  );
}
