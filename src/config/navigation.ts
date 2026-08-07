import { LayoutGrid, Users, Tag, CheckSquare, Settings } from 'lucide-react';
import { DashboardTab } from '@/types/layout';

export const NAV_ITEMS: { label: DashboardTab; icon: any }[] = [
  { label: 'Dashboard', icon: LayoutGrid },
  { label: 'Customers', icon: Users },
  { label: 'Deals', icon: Tag },
  { label: 'Tasks', icon: CheckSquare },
  { label: 'Settings', icon: Settings },
];
