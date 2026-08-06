'use client';

import React, { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { User, UserSession, AuthState } from '@/types/auth/session';
import { ROLE_PERMISSIONS, PermissionMatrix } from '@/types/auth/rbac';
import { loginUser, logoutUser, refreshAccessToken } from '@/services/auth/auth-service';
import { toast } from 'sonner';

// Default mock Admin session for when ENABLE_AUTH=false
const MOCK_ADMIN_USER: User = {
  id: 'usr-1',
  name: 'Alex Rivera',
  email: 'admin@greentiq.com',
  role: 'Admin',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  title: 'Senior CRM Director',
};

interface AuthContextValue extends AuthState {
  accessToken: string | null;
  permissions: PermissionMatrix;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthEnabled: boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
  isAuthEnabled: boolean;
}

export function AuthProvider({ children, isAuthEnabled }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: isAuthEnabled ? null : MOCK_ADMIN_USER,
    isAuthenticated: !isAuthEnabled,
    isLoading: false,
  });
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-refresh access token before expiry (every 12 minutes)
  const scheduleTokenRefresh = useCallback(() => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    refreshTimerRef.current = setTimeout(async () => {
      try {
        const data = await refreshAccessToken();
        setAccessToken(data.accessToken);
        scheduleTokenRefresh();
      } catch {
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
        setAccessToken(null);
        toast.error('Your session has expired. Please log in again.');
      }
    }, 12 * 60 * 1000); // 12 minutes
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      try {
        const { user, accessToken: token } = await loginUser({ email, password });
        setAuthState({ user, isAuthenticated: true, isLoading: false });
        setAccessToken(token);
        scheduleTokenRefresh();
        toast.success(`Welcome back, ${user.name}!`);
      } catch (error: any) {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        throw error;
      }
    },
    [scheduleTokenRefresh]
  );

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } finally {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
      setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      setAccessToken(null);
      toast.info('You have been logged out.');
    }
  }, []);

  useEffect(() => {
    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, []);

  const permissions: PermissionMatrix = authState.user
    ? ROLE_PERMISSIONS[authState.user.role]
    : {
        canViewCustomers: false,
        canAddCustomer: false,
        canEditCustomer: false,
        canDeleteCustomer: false,
        canReorderFilters: false,
      };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        accessToken,
        permissions,
        login,
        logout,
        isAuthEnabled,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
