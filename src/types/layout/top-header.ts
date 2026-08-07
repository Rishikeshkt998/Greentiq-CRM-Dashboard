import { User } from '../auth/session';

export interface TopHeaderProps {
  title: string;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  user: User | null;
  onToggleMobileSidebar?: () => void;
}
