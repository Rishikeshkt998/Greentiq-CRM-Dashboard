'use client';

import { Suspense, useState } from 'react';
import { useCustomerFilters } from '@/hooks/filter/use-customer-filters';
import { useCustomers, useDeleteCustomer } from '@/hooks/customer/use-customers';
import { useDebounce } from '@/hooks/common/use-debounce';
import { useAuth } from '@/hooks/auth/use-auth';
import { Customer } from '@/types/customer/entity';
import { StatusPill } from '@/components/atoms/status-pill';
import { Avatar } from '@/components/atoms/avatar';
import { formatDate } from '@/lib/utils/formatters';
import {
  LayoutDashboard, Users, Tag, CheckSquare, Settings, Search,
  Bell, ChevronDown, Pencil, Trash2, Eye, Plus, RefreshCw,
  Download, TrendingUp, Activity, UserPlus, Phone, ChevronLeft,
  ChevronRight, X, Filter, LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { CustomerFormSheet } from '@/components/organisms/customer/customer-form-sheet';
import { CustomerDetailModal } from '@/components/organisms/customer/customer-detail-modal';
import { FilterPanel } from '@/components/organisms/filter/filter-panel';
import { AuthModal } from '@/components/organisms/auth/auth-modal';

/* ─── Sidebar nav items ─── */
const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Contacts', icon: Users },
  { label: 'Deals', icon: Tag },
  { label: 'Tasks', icon: CheckSquare },
  { label: 'Settings', icon: Settings },
];

/* ─── Metric Card ─── */
function MetricCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  trend,
  trendUp,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  trend: string;
  trendUp: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[hsl(220,38%,11%)] p-5 space-y-4">
      <div className={cn('inline-flex items-center justify-center rounded-xl p-2.5', iconBg)}>
        <Icon className={cn('h-5 w-5', iconColor)} />
      </div>
      <div>
        <p className="text-3xl font-bold text-white tracking-tight">{typeof value === 'number' ? value.toLocaleString() : value}</p>
        <p className="mt-1 text-sm text-muted-foreground">{label}</p>
        <p className="mt-1.5 text-xs">
          <span className="font-medium">Trend</span>{' '}
          <span className={trendUp ? 'text-green-400' : 'text-red-400'}>
            {trend} {trendUp ? '↑ Green' : '↓ Red'}
          </span>
        </p>
      </div>
    </div>
  );
}

/* ─── Status filter dropdown ─── */
const ALL_STATUSES = ['Active', 'Inactive', 'Prospect', 'Lead', 'Archive'] as const;

/* ─── Main Dashboard ─── */
function DashboardContent() {
  const { filters, updateFilters, resetFilters, activeFilterCount } = useCustomerFilters();
  const [searchInput, setSearchInput] = useState(filters.search ?? '');
  const debouncedSearch = useDebounce(searchInput, 300);
  const { user, isAuthenticated, isAuthEnabled, logout, permissions } = useAuth();

  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showFormSheet, setShowFormSheet] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [companyFilter, setCompanyFilter] = useState('All');

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

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Status', 'Last Contact'];
    const rows = customers.map((c) => [c.name, c.email, c.phone, c.company, c.status, c.lastContactDate]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isAuthEnabled && !isAuthenticated) {
    return <AuthModal onSuccess={() => {}} />;
  }

  const totalPages = meta?.totalPages ?? 1;
  const currentPage = meta?.page ?? 1;

  // Build page number list
  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1, 2, 3];
    if (currentPage > 4) pages.push('...');
    if (currentPage > 3 && currentPage < totalPages - 1) pages.push(currentPage);
    if (!pages.includes(totalPages)) {
      if (totalPages - 1 > (pages[pages.length - 1] as number)) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ─── Sidebar ─── */}
      <aside className="flex w-[180px] flex-shrink-0 flex-col border-r border-white/[0.06] sidebar-bg">
        {/* User profile */}
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/[0.06]">
          <Avatar src={user?.avatarUrl} name={user?.name ?? 'Alex R'} size="sm" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name?.split(' ')[0] ?? 'Alex'} {user?.name?.split(' ')[1]?.[0] ?? 'R'}.</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 p-2 pt-3">
          {navItems.map((item, idx) => (
            <button
              key={item.label}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                idx === 0
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        {isAuthEnabled && (
          <div className="border-t border-white/[0.06] p-3">
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-white/5 hover:text-red-400 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        )}
      </aside>

      {/* ─── Main ─── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-white/[0.06] bg-background px-5">
          {/* Global Search */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search CRM..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] py-1.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              {(user?.name ?? 'A')[0].toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto scrollbar-thin p-6 space-y-6">
          {/* ─── Metric Cards ─── */}
          <div className="grid grid-cols-3 gap-4">
            <MetricCard
              label="Total Customers"
              value={meta?.total ?? 0}
              icon={Users}
              iconBg="bg-teal-500/15"
              iconColor="text-teal-400"
              trend="+3.2%"
              trendUp={true}
            />
            <MetricCard
              label="Active Leads"
              value={customers.filter((c) => c.status === 'Lead').length}
              icon={Activity}
              iconBg="bg-orange-500/15"
              iconColor="text-orange-400"
              trend="+5.8%"
              trendUp={true}
            />
            <MetricCard
              label="Contacted This Week"
              value={customers.filter((c) => c.status === 'Active').length}
              icon={Phone}
              iconBg="bg-red-500/15"
              iconColor="text-red-400"
              trend="-1.5%"
              trendUp={false}
            />
          </div>

          {/* ─── Customers Table Section ─── */}
          <div className="rounded-2xl border border-white/[0.07] bg-[hsl(220,38%,11%)] overflow-hidden">
            {/* Table toolbar */}
            <div className="flex flex-wrap items-center gap-3 border-b border-white/[0.07] px-5 py-4">
              <h2 className="text-xl font-bold text-white mr-2">Customers</h2>

              {/* Search */}
              <div className="relative min-w-[220px] flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
                {searchInput && (
                  <button onClick={() => setSearchInput('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Status dropdown */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    if (e.target.value === 'All') {
                      updateFilters({ statuses: [], page: 1 });
                    } else {
                      updateFilters({ statuses: [e.target.value], page: 1 });
                    }
                  }}
                  className="appearance-none rounded-lg border border-white/15 bg-white/[0.04] pl-3 pr-8 py-2 text-sm font-medium text-foreground focus:border-primary/40 focus:outline-none cursor-pointer"
                >
                  <option value="All">Status: All</option>
                  {ALL_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>

              {/* Company dropdown */}
              <div className="relative">
                <select
                  value={companyFilter}
                  onChange={(e) => {
                    setCompanyFilter(e.target.value);
                    if (e.target.value === 'All') {
                      updateFilters({ companies: [], page: 1 });
                    } else {
                      updateFilters({ companies: [e.target.value], page: 1 });
                    }
                  }}
                  className="appearance-none rounded-lg border border-white/15 bg-white/[0.04] pl-3 pr-8 py-2 text-sm font-medium text-foreground focus:border-primary/40 focus:outline-none cursor-pointer"
                >
                  <option value="All">Company: All</option>
                  {availableCompanies.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>

              {/* Filter button */}
              <button
                onClick={() => setShowFilterPanel(true)}
                className={cn(
                  'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all',
                  activeFilterCount > 0
                    ? 'border-primary/50 bg-primary/10 text-primary'
                    : 'border-white/15 text-muted-foreground hover:border-white/25 hover:text-foreground'
                )}
              >
                <Filter className="h-4 w-4" />
                {activeFilterCount > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-2 ml-auto">
                {/* Refresh */}
                <button
                  onClick={() => refetch()}
                  className="rounded-lg border border-white/15 p-2 text-muted-foreground hover:border-white/25 hover:text-foreground transition-all"
                  title="Refresh"
                >
                  <RefreshCw className={cn('h-4 w-4', isFetching && 'animate-spin')} />
                </button>
                {/* Export */}
                <button
                  onClick={exportCSV}
                  className="hidden sm:flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-sm font-medium text-muted-foreground hover:border-white/25 hover:text-foreground transition-all"
                >
                  <Download className="h-4 w-4" /> Export
                </button>
                {/* Add Customer */}
                {permissions.canAddCustomer && (
                  <button
                    onClick={() => { setEditCustomer(null); setShowFormSheet(true); }}
                    className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                  >
                    <Plus className="h-4 w-4" /> Add Customer
                  </button>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.015]">
                    {[
                      { key: 'name', label: 'Name' },
                      { key: 'email', label: 'Email' },
                      { key: 'phone', label: 'Phone' },
                      { key: 'company', label: 'Company' },
                      { key: 'status', label: 'Status' },
                      { key: 'lastContactDate', label: 'Last Contact' },
                    ].map((col) => (
                      <th
                        key={col.key}
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground transition-colors select-none"
                        onClick={() => handleSort(col.key)}
                      >
                        {col.label}
                      </th>
                    ))}
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {isLoading ? (
                    Array.from({ length: 10 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-white/10" />
                            <div className="h-4 w-28 rounded bg-white/10" />
                          </div>
                        </td>
                        {[1, 2, 3, 4, 5].map((j) => (
                          <td key={j} className="px-4 py-3">
                            <div className="h-4 w-24 rounded bg-white/10" />
                          </td>
                        ))}
                        <td className="px-4 py-3" />
                      </tr>
                    ))
                  ) : customers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Users className="h-10 w-10 text-muted-foreground/30" />
                          <p className="text-sm font-medium text-muted-foreground">No customers found</p>
                          {activeFilterCount > 0 && (
                            <button onClick={resetFilters} className="rounded-lg border border-primary/30 px-4 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 transition-colors">
                              Clear Filters
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    customers.map((customer) => (
                      <tr
                        key={customer.id}
                        className="group hover:bg-white/[0.025] transition-colors"
                      >
                        {/* Name + Avatar */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <Avatar src={customer.avatarUrl} name={customer.name} size="sm" />
                            <span className="text-sm font-medium text-foreground">{customer.name}</span>
                          </div>
                        </td>
                        {/* Email */}
                        <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                          {customer.email}
                        </td>
                        {/* Phone */}
                        <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                          {customer.phone}
                        </td>
                        {/* Company */}
                        <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                          {customer.company}
                        </td>
                        {/* Status */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <StatusPill status={customer.status} />
                        </td>
                        {/* Last Contact */}
                        <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                          {formatDate(customer.lastContactDate)}
                        </td>
                        {/* Actions */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setViewCustomer(customer)}
                              className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-all"
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {permissions.canEditCustomer && (
                              <button
                                onClick={() => { setEditCustomer(customer); setShowFormSheet(true); }}
                                className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/10 hover:text-amber-400 transition-all"
                                title="Edit"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                            )}
                            {permissions.canDeleteCustomer && (
                              <button
                                onClick={() => deleteCustomer(customer.id)}
                                className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition-all"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            {meta && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] px-5 py-3.5">
                <p className="text-sm text-muted-foreground">
                  Showing{' '}
                  <span className="text-foreground font-medium">
                    {(currentPage - 1) * meta.pageSize + 1}
                  </span>{' '}
                  to{' '}
                  <span className="text-foreground font-medium">
                    {Math.min(currentPage * meta.pageSize, meta.total)}
                  </span>{' '}
                  of{' '}
                  <span className="text-foreground font-medium">{meta.total}</span>{' '}
                  entries
                </p>

                <div className="flex items-center gap-1">
                  {/* Previous */}
                  <button
                    disabled={!meta.hasPrevPage}
                    onClick={() => updateFilters({ page: currentPage - 1 })}
                    className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-muted-foreground hover:border-primary/40 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    Previous
                  </button>

                  {/* Page numbers */}
                  {getPageNumbers().map((page, idx) =>
                    page === '...' ? (
                      <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground">…</span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => updateFilters({ page: page as number })}
                        className={cn(
                          'min-w-[36px] rounded-lg border px-2.5 py-1.5 text-sm font-medium transition-all',
                          currentPage === page
                            ? 'border-primary bg-primary text-white'
                            : 'border-white/15 text-muted-foreground hover:border-primary/40 hover:text-primary'
                        )}
                      >
                        {page}
                      </button>
                    )
                  )}

                  {/* Next */}
                  <button
                    disabled={!meta.hasNextPage}
                    onClick={() => updateFilters({ page: currentPage + 1 })}
                    className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-muted-foreground hover:border-primary/40 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ─── Panels & Modals ─── */}
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
