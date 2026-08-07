'use client';

import { Users, Rocket, Phone, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { MetricsOverviewProps } from '@/types/dashboard';

export function MetricsOverview({
  totalCount = 150,
  activeLeads = 60,
  contactedThisWeek = 45,
  isLoading = false,
}: MetricsOverviewProps) {
  const displayTotal = totalCount;
  const displayLeads = activeLeads;
  const displayContacted = contactedThisWeek;

  const totalTrend = '+3.2%';
  const leadsTrend = '+5.8%';
  const contactedTrend = '-1.5%';

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto scrollbar-thin pr-1 pb-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-gray-200/80 dark:border-border bg-card p-6 shadow-xs min-h-[175px] flex flex-col justify-between animate-pulse">
              <div className="flex items-center justify-between">
                <div className="h-11 w-11 rounded-xl bg-muted" />
                <div className="h-9 w-24 rounded-lg bg-muted" />
              </div>
              <div className="pt-3 space-y-2">
                <div className="h-3.5 w-28 rounded bg-muted" />
                <div className="h-3.5 w-20 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
              {displayTotal.toLocaleString()}
            </span>
          </div>
          <div className="pt-3">
            <p className="text-xs font-medium text-muted-foreground">Total Customers</p>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs font-semibold text-emerald-500">
              <ArrowUpRight className="h-4 w-4" />
              <span>Trend {totalTrend} ↑</span>
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
              {displayLeads.toLocaleString()}
            </span>
          </div>
          <div className="pt-3">
            <p className="text-xs font-medium text-muted-foreground">Active Leads</p>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs font-semibold text-emerald-500">
              <ArrowUpRight className="h-4 w-4" />
              <span>Trend {leadsTrend} ↑</span>
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
              {displayContacted.toLocaleString()}
            </span>
          </div>
          <div className="pt-3">
            <p className="text-xs font-medium text-muted-foreground">Contacted This Week</p>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs font-semibold text-rose-500">
              <ArrowDownRight className="h-4 w-4" />
              <span>Trend {contactedTrend} ↓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
