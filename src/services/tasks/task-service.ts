export interface TaskItem {
  id: string;
  title: string;
  customerName: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  category: 'Call' | 'Meeting' | 'Email' | 'Follow-up' | 'Contract';
  completed: boolean;
}

const STORAGE_KEY = 'greentiq_crm_tasks_v1';

const DEFAULT_TASKS: TaskItem[] = [
  { id: 'task-1', title: 'Schedule product demo call with John Doe', customerName: 'John Doe', dueDate: '2026-08-10', priority: 'High', category: 'Call', completed: false },
  { id: 'task-2', title: 'Send revised enterprise pricing proposal', customerName: 'Jane Smith', dueDate: '2026-08-12', priority: 'High', category: 'Email', completed: false },
  { id: 'task-3', title: 'Review SLA terms & contract details', customerName: 'Robert Johnson', dueDate: '2026-08-15', priority: 'Medium', category: 'Contract', completed: true },
  { id: 'task-4', title: 'Follow-up on integration timeline setup', customerName: 'Emily Davis', dueDate: '2026-08-18', priority: 'Low', category: 'Follow-up', completed: false },
  { id: 'task-5', title: 'Quarterly review meeting with leadership', customerName: 'Michael Brown', dueDate: '2026-08-22', priority: 'Medium', category: 'Meeting', completed: false },
];

export function getStoredTasks(): TaskItem[] {
  if (typeof window === 'undefined') return DEFAULT_TASKS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TASKS));
      return DEFAULT_TASKS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_TASKS;
  }
}

export function saveStoredTasks(tasks: TaskItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Ignore write errors
  }
}
