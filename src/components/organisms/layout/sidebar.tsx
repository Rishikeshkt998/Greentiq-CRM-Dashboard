'use client';

import { LayoutDashboard, Users, Tag, CheckSquare, Settings, LogOut, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export type DashboardTab = 'Dashboard' | 'Customers' | 'Deals' | 'Tasks' | 'Settings';

export const NAV_ITEMS: { label: DashboardTab; icon: any }[] = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Customers', icon: Users },
  { label: 'Deals', icon: Tag },
  { label: 'Tasks', icon: CheckSquare },
  { label: 'Settings', icon: Settings },
];

interface SidebarProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onLogout: () => void;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export function Sidebar({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  onLogout,
  mobileOpen = false,
  setMobileOpen,
}: SidebarProps) {
  const content = (
    <aside
      className={cn(
        'flex flex-col h-full rounded-xl border border-gray-200/80 dark:border-border bg-card shadow-xs p-4 transition-all duration-300 flex-shrink-0',
        collapsed ? 'w-16' : 'w-56'
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between pb-4 pt-1 px-1 border-b border-border/40">
        {!collapsed ? (
          <div>
            <h2 className="text-base font-black tracking-tight text-foreground flex items-center gap-1.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white font-black text-xs">
                GT
              </span>
              GREENTIQ
            </h2>
            <p className="text-[9px] text-muted-foreground font-semibold tracking-wider uppercase mt-0.5">
              CUSTOMER MANAGEMENT
            </p>
          </div>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-black text-xs mx-auto">
            GT
          </div>
        )}
        <button
          onClick={() => {
            if (setMobileOpen) setMobileOpen(false);
            setCollapsed(!collapsed);
          }}
          className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1 pt-4">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.label;
          return (
            <button
              key={item.label}
              onClick={() => {
                setActiveTab(item.label);
                if (setMobileOpen) setMobileOpen(false);
              }}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all cursor-pointer select-none',
                isActive
                  ? 'bg-blue-50 text-blue-600 dark:bg-primary/15 dark:text-primary font-semibold shadow-2xs'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer Logout */}
      <div className="pt-3 border-t border-border/40">
        <button
          onClick={onLogout}
          className={cn(
            'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors',
            collapsed && 'justify-center px-0'
          )}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span>Log Out</span>}
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile) */}
      <div className="hidden md:block h-full">{content}</div>

      {/* Mobile Drawer (visible on small screens when triggered) */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={() => setMobileOpen?.(false)} />
          <div className="relative z-10 h-full p-3.5">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
