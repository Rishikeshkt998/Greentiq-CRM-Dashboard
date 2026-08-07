'use client';

import { useState, useEffect } from 'react';
import { CheckSquare, Plus, Search, Calendar, User, Clock, CheckCircle2, Circle, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { toast } from 'sonner';
import { TaskItem, getStoredTasks, saveStoredTasks } from '@/services/tasks/task-service';

export function TasksView() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // Initialize from persistent storage
  useEffect(() => {
    setTasks(getStoredTasks());
  }, []);

  // Save changes to persistent storage
  const updateTasksState = (newTasks: TaskItem[]) => {
    setTasks(newTasks);
    saveStoredTasks(newTasks);
  };

  // New Task state
  const [newTitle, setNewTitle] = useState('');
  const [newCustomer, setNewCustomer] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState<TaskItem['priority']>('Medium');
  const [newCategory, setNewCategory] = useState<TaskItem['category']>('Follow-up');

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesCat = filterCategory === 'All' || t.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  const toggleTask = (id: string) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    updateTasksState(updated);
    toast.success('Task status updated');
  };

  const deleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    updateTasksState(updated);
    toast.success('Task removed');
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCustomer.trim()) {
      toast.error('Please enter task title and customer name');
      return;
    }

    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      customerName: newCustomer.trim(),
      dueDate: newDueDate || new Date().toISOString().split('T')[0],
      priority: newPriority,
      category: newCategory,
      completed: false,
    };

    updateTasksState([newTask, ...tasks]);
    toast.success(`Task "${newTask.title}" created`);
    setNewTitle('');
    setNewCustomer('');
    setNewDueDate('');
    setShowAddModal(false);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 space-y-3.5 overflow-hidden">
      {/* Header Cards Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-shrink-0">
        <div className="rounded-xl border border-gray-200/80 dark:border-border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-muted-foreground">Total Active Tasks</p>
            <h3 className="text-xl font-black text-foreground mt-0.5">{tasks.length} Tasks</h3>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
            <CheckSquare className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200/80 dark:border-border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-muted-foreground">Pending Follow-ups</p>
            <h3 className="text-xl font-black text-amber-500 mt-0.5">{pendingCount} Pending</h3>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200/80 dark:border-border bg-card p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-muted-foreground">Completed Tasks</p>
            <h3 className="text-xl font-black text-emerald-500 mt-0.5">{completedCount} Completed</h3>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 flex-shrink-0">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-border/80 bg-card pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-1 overflow-x-auto scrollbar-thin">
            {['All', 'Call', 'Meeting', 'Email', 'Follow-up', 'Contract'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={cn(
                  'rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap',
                  filterCategory === cat
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 text-xs font-bold text-white transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Task
        </button>
      </div>

      {/* Task Items List */}
      <div className="flex-1 rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto scrollbar-thin divide-y divide-border/40 p-2">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground space-y-1">
              <CheckSquare className="h-8 w-8 text-muted-foreground/50 mx-auto" />
              <p className="font-semibold">No tasks found</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={cn(
                  'flex items-center justify-between gap-3 p-3 rounded-lg transition-all',
                  task.completed ? 'opacity-60 bg-muted/20' : 'hover:bg-muted/30'
                )}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="text-muted-foreground hover:text-blue-500 transition-colors cursor-pointer flex-shrink-0"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-500/20" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <h4
                      className={cn(
                        'text-xs font-bold text-foreground leading-snug truncate',
                        task.completed && 'line-through text-muted-foreground'
                      )}
                    >
                      {task.title}
                    </h4>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1 font-medium">
                        <User className="h-3 w-3" /> {task.customerName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Due: {task.dueDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Priority & Category Badges */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded-md text-[10px] font-extrabold border',
                      task.priority === 'High'
                        ? 'border-rose-500/40 text-rose-400 bg-rose-500/10'
                        : task.priority === 'Medium'
                        ? 'border-amber-500/40 text-amber-400 bg-amber-500/10'
                        : 'border-blue-500/40 text-blue-400 bg-blue-500/10'
                    )}
                  >
                    {task.priority}
                  </span>

                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-muted text-foreground border border-border/60">
                    {task.category}
                  </span>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="rounded p-1 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-colors cursor-pointer"
                    title="Delete task"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <>
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs" onClick={() => setShowAddModal(false)} />
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <CheckSquare className="h-4 w-4 text-blue-500" />
                Add Follow-up Task
              </h3>
              <button onClick={() => setShowAddModal(false)} className="rounded p-1 text-muted-foreground hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-foreground">Task Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Call client for feedback"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full mt-1 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-foreground">Customer Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Jane Smith"
                  value={newCustomer}
                  onChange={(e) => setNewCustomer(e.target.value)}
                  className="w-full mt-1 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs text-foreground focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-foreground">Due Date</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full mt-1 rounded-lg border border-border bg-muted/40 px-2 py-1.5 text-xs text-foreground focus:outline-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-foreground">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as TaskItem['priority'])}
                    className="w-full mt-1 rounded-lg border border-border bg-muted/40 px-2 py-1.5 text-xs text-foreground focus:outline-none cursor-pointer"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-foreground">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as TaskItem['category'])}
                    className="w-full mt-1 rounded-lg border border-border bg-muted/40 px-2 py-1.5 text-xs text-foreground focus:outline-none cursor-pointer"
                  >
                    <option value="Call">Call</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Email">Email</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Contract">Contract</option>
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
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
