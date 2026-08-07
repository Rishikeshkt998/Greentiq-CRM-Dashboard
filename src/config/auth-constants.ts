import { User } from '@/types/auth/session';

// Default mock Admin session for when ENABLE_AUTH=false
export const MOCK_ADMIN_USER: User = {
  id: 'usr-1',
  name: 'Alex Rivera',
  email: 'admin@greentiq.com',
  role: 'Admin',
  avatarUrl: undefined,
  title: 'Senior CRM Director',
};
