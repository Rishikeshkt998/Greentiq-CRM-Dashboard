'use client';

import { LogOut, ChevronRight, ChevronLeft, X, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { DashboardTab, SidebarProps } from '@/types/layout';
import { NAV_ITEMS } from '@/config';

import { AppLogo } from '@/components/atoms/app-logo';

export type { DashboardTab, SidebarProps };
export { NAV_ITEMS };

export function Sidebar({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  onLogout,
  mobileOpen = false,
  setMobileOpen,
}: SidebarProps) {
  const isMobileDrawer = mobileOpen;
  const isCollapsed = collapsed && !isMobileDrawer;

  const content = (
    <aside
      className={cn(
        'flex flex-col h-full rounded-xl border border-gray-200/80 dark:border-border bg-card shadow-xs transition-all duration-300 flex-shrink-0',
        isCollapsed ? 'w-16 p-2.5' : 'w-64 p-4'
      )}
    >
      {/* Brand Header */}
      {!isCollapsed ? (
        <div className="flex items-center justify-between pb-4 pt-1 px-1 border-b border-border/40">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <AppLogo className="h-8 w-8 flex-shrink-0" />
            <span className="text-base font-extrabold tracking-tight text-foreground whitespace-nowrap">
              GreenTiq CRM
            </span>
          </div>
          {setMobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              title="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="Collapse sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 pb-3 pt-1 border-b border-border/40">
          <AppLogo className="h-8 w-8 flex-shrink-0" />
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="Expand sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      <nav className={cn('flex-1 space-y-0.5 pt-3', isCollapsed ? 'px-0' : 'px-1')}>
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.label;
          return (
            <div key={item.label} className="relative">
              <button
                onClick={() => {
                  setActiveTab(item.label);
                  if (setMobileOpen) setMobileOpen(false);
                }}
                className={cn(
                  'relative flex w-full items-center transition-all cursor-pointer select-none',
                  isCollapsed
                    ? cn(
                        'justify-center rounded-xl p-2.5 mx-auto',
                        isActive
                          ? 'bg-[#eef2ff] text-[#2563eb] dark:bg-blue-500/15 dark:text-blue-400'
                          : 'text-slate-400 hover:bg-slate-100/80 dark:text-slate-500 dark:hover:bg-slate-800/40'
                      )
                    : cn(
                        'gap-3 rounded-xl pl-5 pr-3 py-2.5 text-sm font-medium overflow-hidden',
                        isActive
                          ? 'bg-[#eef2ff] text-[#2563eb] dark:bg-blue-500/15 dark:text-blue-400 font-semibold'
                          : 'text-slate-500 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:bg-slate-800/40'
                      )
                )}
                title={isCollapsed ? item.label : undefined}
              >
                {/* Blue bar — only show in expanded mode */}
                {isActive && !isCollapsed && (
                  <span className="absolute left-0 top-0 bottom-0 w-[5px] bg-[#2563eb] dark:bg-blue-400 rounded-l-xl" />
                )}
                <item.icon className={cn('flex-shrink-0', isCollapsed ? 'h-5 w-5' : 'h-[18px] w-[18px]', isActive ? 'text-[#2563eb] dark:text-blue-400' : 'text-slate-400 dark:text-slate-500')} />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            </div>
          );
        })}
      </nav>

      {/* Sidebar Footer Logout */}
      <div className="pt-3 border-t border-border/40">
        <button
          onClick={onLogout}
          className={cn(
            'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors',
            isCollapsed && 'justify-center px-0'
          )}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && <span>Log Out</span>}
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
