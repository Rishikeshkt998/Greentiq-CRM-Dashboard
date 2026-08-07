'use client';

import { Sun, Moon, Menu } from 'lucide-react';
import { Avatar } from '@/components/atoms/avatar';
import { TopHeaderProps } from '@/types/layout';

export type { TopHeaderProps };


export function TopHeader({ title, isDarkMode, onToggleTheme, user, onToggleMobileSidebar }: TopHeaderProps) {
  return (
    <header className="flex h-14 flex-shrink-0 items-center justify-between rounded-xl border border-gray-200/80 dark:border-border bg-card px-4 sm:px-5 shadow-xs transition-colors duration-200">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Toggle Button */}
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors border border-border/60"
            title="Toggle Menu"
          >
            <Menu className="h-4 w-4" />
          </button>
        )}
        <h1 className="text-base font-bold text-foreground tracking-tight">{title}</h1>
      </div>

      {/* Top Bar Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors border border-border/60"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-600" />}
        </button>

        {/* User Profile Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-border/60">
          <Avatar src={user?.avatarUrl} name={user?.name ?? 'Rishikesh KT'} size="sm" />
          <div className="hidden md:block text-left leading-tight">
            <p className="text-xs font-bold text-foreground truncate">{user?.name ?? 'Rishikesh KT'}</p>
            <p className="text-[11px] font-light text-muted-foreground truncate">{user?.email ?? 'rishikt8465@gmail.com'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
