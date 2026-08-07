'use client';

import { useState, useEffect } from 'react';
import { Tag, Plus, Search, DollarSign, TrendingUp, CheckCircle, Clock, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { toast } from 'sonner';
import { Deal, getStoredDeals, saveStoredDeals } from '@/services/deals/deal-service';

const STAGES: { key: Deal['stage']; label: string; color: string }[] = [
  { key: 'Prospecting', label: 'Prospecting', color: 'border-sky-500/40 text-sky-400 bg-sky-500/10' },
  { key: 'Qualified', label: 'Qualified', color: 'border-amber-500/40 text-amber-400 bg-amber-500/10' },
  { key: 'Proposal', label: 'Proposal Sent', color: 'border-purple-500/40 text-purple-400 bg-purple-500/10' },
  { key: 'Closed Won', label: 'Closed Won', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' },
];

export function DealsView() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Initialize from persistent storage
  useEffect(() => {
    setDeals(getStoredDeals());
  }, []);

  // Save changes to persistent storage
  const updateDealsState = (newDeals: Deal[]) => {
    setDeals(newDeals);
    saveStoredDeals(newDeals);
  };

  // New Deal Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCustomer, setNewCustomer] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newStage, setNewStage] = useState<Deal['stage']>('Prospecting');

  const filteredDeals = deals.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.customerName.toLowerCase().includes(search.toLowerCase())
  );

  const totalPipeline = deals.reduce((acc, d) => acc + d.value, 0);
  const totalWon = deals.filter((d) => d.stage === 'Closed Won').reduce((acc, d) => acc + d.value, 0);
  const activeCount = deals.filter((d) => d.stage !== 'Closed Won').length;

  const handleAddDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCustomer.trim() || !newValue) {
      toast.error('Please fill out all required deal fields');
      return;
    }

    const created: Deal = {
      id: `deal-${Date.now()}`,
      title: newTitle.trim(),
      customerName: newCustomer.trim(),
      value: Number(newValue) || 10000,
      stage: newStage,
      probability: newStage === 'Closed Won' ? 100 : newStage === 'Proposal' ? 75 : 40,
      expectedClose: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };

    updateDealsState([created, ...deals]);
    toast.success(`Created deal "${created.title}" ($${created.value.toLocaleString()})`);
    setNewTitle('');
    setNewCustomer('');
    setNewValue('');
    setShowAddModal(false);
  };

  const handleMoveStage = (id: string, stage: Deal['stage']) => {
    const updated = deals.map((d) =>
      d.id === id
        ? {
            ...d,
            stage,
            probability: stage === 'Closed Won' ? 100 : stage === 'Proposal' ? 75 : 50,
          }
        : d
    );
    updateDealsState(updated);
    toast.success(`Moved deal to "${stage}"`);
  };

  const handleDeleteDeal = (id: string, title: string) => {
    const updated = deals.filter((d) => d.id !== id);
    updateDealsState(updated);
    toast.success(`Deleted deal "${title}"`);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 space-y-3.5 overflow-hidden">
      {/* Metrics Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-shrink-0">
        <div className="rounded-xl border border-gray-200/80 dark:border-border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-muted-foreground">Total Pipeline Value</p>
            <h3 className="text-xl font-black text-foreground mt-0.5">${totalPipeline.toLocaleString()}</h3>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200/80 dark:border-border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-muted-foreground">Closed Won Revenue</p>
            <h3 className="text-xl font-black text-emerald-500 mt-0.5">${totalWon.toLocaleString()}</h3>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
            <CheckCircle className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200/80 dark:border-border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-muted-foreground">Active Opportunities</p>
            <h3 className="text-xl font-black text-amber-500 mt-0.5">{activeCount} Deals</h3>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Toolbar & Filter Bar */}
      <div className="flex items-center justify-between gap-3 flex-shrink-0">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search deals or customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border/80 bg-card pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
          />
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 text-xs font-bold text-white transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          New Deal
        </button>
      </div>

      {/* Kanban Stages Board */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3 min-h-0 overflow-x-auto scrollbar-thin pb-2">
        {STAGES.map((s) => {
          const stageDeals = filteredDeals.filter((d) => d.stage === s.key);
          const stageTotal = stageDeals.reduce((sum, d) => sum + d.value, 0);

          return (
            <div key={s.key} className="flex flex-col rounded-xl border border-border/70 bg-card/60 p-3 min-h-0 shadow-2xs">
              {/* Stage Header */}
              <div className="flex items-center justify-between border-b border-border/50 pb-2 mb-2 flex-shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className={cn('px-2 py-0.5 rounded-md text-[10px] font-extrabold border', s.color)}>
                    {s.label}
                  </span>
                  <span className="text-[11px] font-bold text-muted-foreground">({stageDeals.length})</span>
                </div>
                <span className="text-xs font-black text-foreground">${stageTotal.toLocaleString()}</span>
              </div>

              {/* Stage Cards Scroll Area */}
              <div className="flex-1 overflow-y-auto scrollbar-thin space-y-2.5 pr-0.5">
                {stageDeals.length === 0 ? (
                  <div className="p-4 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-lg">
                    No deals
                  </div>
                ) : (
                  stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="rounded-lg border border-border/80 bg-card p-3 shadow-xs space-y-2 hover:border-blue-500/40 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-foreground leading-snug">{deal.title}</h4>
                        <div className="flex items-center gap-1">
                          <select
                            value={deal.stage}
                            onChange={(e) => handleMoveStage(deal.id, e.target.value as Deal['stage'])}
                            className="text-[10px] font-semibold bg-muted/60 text-foreground border border-border/60 rounded px-1 py-0.5 cursor-pointer focus:outline-none"
                          >
                            {STAGES.map((st) => (
                              <option key={st.key} value={st.key}>{st.label}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleDeleteDeal(deal.id, deal.title)}
                            className="p-1 text-muted-foreground hover:text-rose-500 transition-colors"
                            title="Delete deal"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      <p className="text-[11px] text-muted-foreground font-medium">{deal.customerName}</p>

                      <div className="flex items-center justify-between border-t border-border/40 pt-2 text-[11px]">
                        <span className="font-extrabold text-foreground">${deal.value.toLocaleString()}</span>
                        <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-semibold">
                          <Clock className="h-3 w-3" />
                          <span>{deal.probability}% probability</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Deal Modal */}
      {showAddModal && (
        <>
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs" onClick={() => setShowAddModal(false)} />
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Tag className="h-4 w-4 text-blue-500" />
                Create New Deal
              </h3>
              <button onClick={() => setShowAddModal(false)} className="rounded p-1 text-muted-foreground hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddDeal} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-foreground">Deal Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Acme Enterprise License"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full mt-1 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-foreground">Customer Name *</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={newCustomer}
                  onChange={(e) => setNewCustomer(e.target.value)}
                  className="w-full mt-1 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs text-foreground focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-foreground">Value ($) *</label>
                  <input
                    type="number"
                    placeholder="25000"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="w-full mt-1 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs text-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-foreground">Initial Stage</label>
                  <select
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value as Deal['stage'])}
                    className="w-full mt-1 rounded-lg border border-border bg-muted/40 px-2 py-1.5 text-xs text-foreground focus:outline-none cursor-pointer"
                  >
                    {STAGES.map((s) => (
                      <option key={s.key} value={s.key}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg bg-muted px-3.5 py-1.5 text-xs font-semibold text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-1.5 text-xs font-bold text-white shadow-xs"
                >
                  Save Deal
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
