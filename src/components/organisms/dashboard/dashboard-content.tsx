'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useCustomerFilters } from '@/hooks/filter/use-customer-filters';
import { useCustomers, useDeleteCustomer, useUpdateCustomer } from '@/hooks/customer/use-customers';
import { useDebounce } from '@/hooks/common/use-debounce';
import { useAuth } from '@/hooks/auth/use-auth';
import { Customer, CustomerStatus } from '@/types/customer/entity';
import { useTheme } from 'next-themes';
import { Tag, CheckSquare, Settings } from 'lucide-react';
import { CustomerFormSheet } from '@/components/organisms/customer/customer-form-sheet';
import { CustomerDetailModal } from '@/components/organisms/customer/customer-detail-modal';
import { FilterPanel } from '@/components/organisms/filter/filter-panel';
import { AuthModal } from '@/components/organisms/auth/auth-modal';
import { Sidebar, DashboardTab } from '@/components/organisms/layout/sidebar';
import { TopHeader } from '@/components/organisms/layout/top-header';
import { MetricsOverview } from '@/components/organisms/dashboard/metrics-overview';
import { CustomerToolbar } from '@/components/organisms/customer/customer-toolbar';
import { BulkActionsBar } from '@/components/organisms/customer/bulk-actions-bar';
import { CustomerTable } from '@/components/organisms/customer/customer-table';
import { SavedFiltersBar } from '@/components/organisms/filter/saved-filters-bar';
import { exportToCSV } from '@/lib/utils/csv-exporter';
import { toast } from 'sonner';

import { PointerSensor, KeyboardSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { ConfirmModal } from '@/components/molecules/confirm-modal';
import { DealsView } from '@/components/organisms/deals/deals-view';
import { TasksView } from '@/components/organisms/tasks/tasks-view';
import { SettingsView } from '@/components/organisms/settings/settings-view';

export function DashboardContent() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('Dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { filters, updateFilters, resetFilters, activeFilterCount } = useCustomerFilters();
  const [searchInput, setSearchInput] = useState(filters.search ?? '');
  const debouncedSearch = useDebounce(searchInput, 300);
  const { user, isAuthenticated, isAuthEnabled, logout, permissions } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showFormSheet, setShowFormSheet] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [companyFilter, setCompanyFilter] = useState('All');

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState('');
  const [rowOrder, setRowOrder] = useState<string[]>([]);
  
  // Confirmation Modal state for Bulk & Single Deletion
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'single' | 'bulk'; id?: string; count?: number } | null>(null);
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  const activeFilters = useMemo(() => ({ ...filters, search: debouncedSearch }), [filters, debouncedSearch]);
  const { data, isLoading } = useCustomers(activeFilters, !isAuthEnabled || isAuthenticated);

  // Separate unfiltered query for Dashboard global metrics — never affected by Customer tab filters
  const { data: globalData, isLoading: isGlobalLoading } = useCustomers({}, !isAuthEnabled || isAuthenticated);
  const globalMeta = globalData?.meta;

  const { mutate: deleteCustomer } = useDeleteCustomer();
  const { mutate: updateCustomer } = useUpdateCustomer();

  const serverCustomers = data?.data ?? [];
  const meta = data?.meta;
  const availableCompanies = data?.availableCompanies ?? [];

  useEffect(() => {
    setRowOrder(serverCustomers.map((c) => c.id));
    setSelectedIds(new Set());
  }, [data]);

  const orderedCustomers = useMemo(() => {
    if (rowOrder.length === 0) return serverCustomers;
    const map = new Map(serverCustomers.map((c) => [c.id, c]));
    return rowOrder.map((id) => map.get(id)).filter(Boolean) as Customer[];
  }, [serverCustomers, rowOrder]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); searchInputRef.current?.focus(); }
      else if ((e.metaKey || e.ctrlKey) && e.key === 'b') { e.preventDefault(); setShowFilterPanel((prev) => !prev); }
      else if ((e.metaKey || e.ctrlKey) && e.key === 'n') { e.preventDefault(); setEditCustomer(null); setShowFormSheet(true); }
      else if (e.key === 'Escape') { setShowFilterPanel(false); setShowFormSheet(false); setViewCustomer(null); setSelectedIds(new Set()); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSort = (column: string) => {
    updateFilters({ sortBy: column, sortOrder: filters.sortBy === column && filters.sortOrder === 'asc' ? 'desc' : 'asc', page: 1 });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setRowOrder((prev) => arrayMove(prev, prev.indexOf(active.id as string), prev.indexOf(over.id as string)));
  }, []);

  const handleSelectOne = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedIds(selectedIds.size === orderedCustomers.length ? new Set() : new Set(orderedCustomers.map((c) => c.id)));
  }, [orderedCustomers, selectedIds.size]);

  const handleBulkDelete = useCallback(() => {
    if (selectedIds.size === 0) return;
    setDeleteTarget({ type: 'bulk', count: selectedIds.size });
    setDeleteConfirmOpen(true);
  }, [selectedIds.size]);

  const handleSingleDelete = useCallback((id: string) => {
    setDeleteTarget({ type: 'single', id });
    setDeleteConfirmOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (deleteTarget?.type === 'bulk') {
      const count = selectedIds.size;
      selectedIds.forEach((id) => deleteCustomer({ id, silent: true }));
      setSelectedIds(new Set());
      toast.success(`Deleted ${count} customer(s) successfully`);
    } else if (deleteTarget?.type === 'single' && deleteTarget.id) {
      deleteCustomer({ id: deleteTarget.id });
    }
  }, [deleteTarget, selectedIds, deleteCustomer]);

  const handleBulkStatusChange = useCallback((newStatus: string) => {
    if (!newStatus) return;
    selectedIds.forEach((id) => {
      const customer = orderedCustomers.find((c) => c.id === id);
      if (customer) updateCustomer({ ...customer, status: newStatus as CustomerStatus, silent: true });
    });
    toast.success(`Updated ${selectedIds.size} customers to "${newStatus}"`);
    setSelectedIds(new Set());
    setBulkStatus('');
  }, [selectedIds, orderedCustomers, updateCustomer]);

  const handleResetAllFilters = useCallback(() => {
    resetFilters();
    setStatusFilter('All');
    setCompanyFilter('All');
    setSearchInput('');
  }, [resetFilters]);

  const handleExportCSV = useCallback(() => {
    const toExport = selectedIds.size > 0 ? orderedCustomers.filter((c) => selectedIds.has(c.id)) : orderedCustomers;
    exportToCSV(toExport);
    toast.success(`Exported ${toExport.length} customers to CSV`);
  }, [orderedCustomers, selectedIds]);

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (isAuthEnabled && !isAuthenticated) return <AuthModal onSuccess={() => {}} />;

  const isDarkMode = mounted ? (resolvedTheme === 'dark' || theme === 'dark') : true;

  return (
    <div className="flex h-screen overflow-hidden bg-[#f3f4f6] dark:bg-[#0b0f19] text-foreground p-3.5 gap-3.5 font-sans transition-colors duration-200">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        onLogout={logout}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      <div className="flex-1 flex flex-col gap-3.5 min-w-0 h-full overflow-hidden">
        <TopHeader
          title={activeTab}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setTheme(isDarkMode ? 'light' : 'dark')}
          user={user}
          onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
        />

        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {activeTab === 'Dashboard' && (
            <MetricsOverview
              totalCount={globalMeta?.total}
              activeLeads={globalMeta?.activeLeads}
              contactedThisWeek={globalMeta?.contactedThisWeek}
              isLoading={isGlobalLoading}
            />
          )}

          {activeTab === 'Customers' && (
            <div className="flex-1 flex flex-col min-h-0 gap-3">
              <CustomerToolbar
                searchInput={searchInput}
                onSearchChange={(val) => { setSearchInput(val); updateFilters({ page: 1 }); }}
                searchInputRef={searchInputRef}
                statusFilter={statusFilter}
                onStatusChange={(val) => { setStatusFilter(val); updateFilters({ statuses: val === 'All' ? [] : [val as any], page: 1 }); }}
                companyFilter={companyFilter}
                onCompanyChange={(val) => { setCompanyFilter(val); updateFilters({ companies: val === 'All' ? [] : [val], page: 1 }); }}
                availableCompanies={availableCompanies}
                selectedCount={selectedIds.size}
                onExportCSV={handleExportCSV}
                activeFilterCount={activeFilterCount}
                onToggleFilterPanel={() => setShowFilterPanel(true)}
                canAddCustomer={permissions.canAddCustomer}
                onAddCustomer={() => { setEditCustomer(null); setShowFormSheet(true); }}
              />

              <SavedFiltersBar
                onApplyFilter={(f) => {
                  updateFilters({ ...f, page: 1 });
                  if (f.statuses && f.statuses.length === 1) setStatusFilter(f.statuses[0]);
                  else if (!f.statuses || f.statuses.length === 0) setStatusFilter('All');
                  if (f.companies && f.companies.length === 1) setCompanyFilter(f.companies[0]);
                  else if (!f.companies || f.companies.length === 0) setCompanyFilter('All');
                }}
              />

              <BulkActionsBar
                selectedCount={selectedIds.size}
                bulkStatus={bulkStatus}
                onBulkStatusChange={handleBulkStatusChange}
                onBulkDelete={handleBulkDelete}
                onClearSelection={() => setSelectedIds(new Set())}
                canEdit={permissions.canEditCustomer}
                canDelete={permissions.canDeleteCustomer}
              />

              <CustomerTable
                isLoading={isLoading}
                orderedCustomers={orderedCustomers}
                rowOrder={rowOrder}
                sensors={sensors}
                handleDragEnd={handleDragEnd}
                allSelected={orderedCustomers.length > 0 && selectedIds.size === orderedCustomers.length}
                onSelectAll={handleSelectAll}
                selectedIds={selectedIds}
                onSelectOne={handleSelectOne}
                sortBy={filters.sortBy}
                sortOrder={filters.sortOrder}
                onSort={handleSort}
                activeFilterCount={activeFilterCount}
                onResetFilters={handleResetAllFilters}
                onViewCustomer={(c) => setViewCustomer(c)}
                onEditCustomer={(c) => { setEditCustomer(c); setShowFormSheet(true); }}
                onDeleteCustomer={handleSingleDelete}
                canEdit={permissions.canEditCustomer}
                canDelete={permissions.canDeleteCustomer}
                meta={meta}
                onPageChange={(page) => updateFilters({ page })}
              />
            </div>
          )}

          {activeTab === 'Deals' && <DealsView />}

          {activeTab === 'Tasks' && <TasksView />}

          {activeTab === 'Settings' && <SettingsView />}
        </main>
      </div>

      <FilterPanel
        open={showFilterPanel}
        onClose={() => setShowFilterPanel(false)}
        filters={filters}
        onApply={(f) => {
          updateFilters({ ...f, page: 1 });
          if (!f.statuses?.length) setStatusFilter('All'); else if (f.statuses.length === 1) setStatusFilter(f.statuses[0]);
          if (!f.companies?.length) setCompanyFilter('All'); else if (f.companies.length === 1) setCompanyFilter(f.companies[0]);
          if (f.search !== undefined) setSearchInput(f.search);
          setShowFilterPanel(false);
        }}
        availableCompanies={availableCompanies}
      />
      <CustomerFormSheet open={showFormSheet} onClose={() => { setShowFormSheet(false); setEditCustomer(null); }} customer={editCustomer} />
      {viewCustomer && <CustomerDetailModal customer={viewCustomer} open={!!viewCustomer} onClose={() => setViewCustomer(null)} onEdit={(c) => { setViewCustomer(null); setEditCustomer(c); setShowFormSheet(true); }} />}
      
      <ConfirmModal
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title={deleteTarget?.type === 'bulk' ? `Delete ${deleteTarget.count} Selected Customers?` : 'Delete Customer?'}
        description={
          deleteTarget?.type === 'bulk'
            ? `Are you sure you want to delete ${deleteTarget?.count} selected customer(s)? This action will permanently remove their records from the CRM.`
            : 'Are you sure you want to delete this customer record? This action cannot be undone.'
        }
        confirmText={deleteTarget?.type === 'bulk' ? `Delete ${deleteTarget.count} Customers` : 'Delete Customer'}
      />
    </div>
  );
}
