'use client';

import { Users, Rocket, Phone, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function MetricsOverview() {
  return (
    <div className="flex-1 overflow-auto scrollbar-thin pr-1 pb-2">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric Card 1: Total Customers */}
        <div className="rounded-xl border border-gray-200/80 dark:border-border bg-card p-6 shadow-xs min-h-[175px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex-shrink-0">
              <Users className="h-5.5 w-5.5" />
            </div>
            <span className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              14,782
            </span>
          </div>
          <div className="pt-3">
            <p className="text-xs font-medium text-muted-foreground">Total Customers</p>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs font-semibold text-emerald-500">
              <ArrowUpRight className="h-4 w-4" />
              <span>Trend +3.2% ↑</span>
            </div>
          </div>
        </div>

        {/* Metric Card 2: Active Leads */}
        <div className="rounded-xl border border-gray-200/80 dark:border-border bg-card p-6 shadow-xs min-h-[175px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400 flex-shrink-0">
              <Rocket className="h-5.5 w-5.5" />
            </div>
            <span className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              3,105
            </span>
          </div>
          <div className="pt-3">
            <p className="text-xs font-medium text-muted-foreground">Active Leads</p>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs font-semibold text-emerald-500">
              <ArrowUpRight className="h-4 w-4" />
              <span>Trend +5.8% ↑</span>
            </div>
          </div>
        </div>

        {/* Metric Card 3: Contacted This Week */}
        <div className="rounded-xl border border-gray-200/80 dark:border-border bg-card p-6 shadow-xs min-h-[175px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400 flex-shrink-0">
              <Phone className="h-5.5 w-5.5" />
            </div>
            <span className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              947
            </span>
          </div>
          <div className="pt-3">
            <p className="text-xs font-medium text-muted-foreground">Contacted This Week</p>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs font-semibold text-rose-500">
              <ArrowDownRight className="h-4 w-4" />
              <span>Trend -1.5% ↓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
