'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { User, UserSession, AuthState, AuthContextValue, AuthProviderProps } from '@/types/auth';
import { ROLE_PERMISSIONS, PermissionMatrix } from '@/types/auth/rbac';
import { loginUser, logoutUser, refreshAccessToken } from '@/services/auth/auth-service';
import { setAccessToken as saveTokenToStore } from '@/services/auth/token-store';
import { verifyAccessToken } from '@/lib/utils/jwt';
import { MOCK_ADMIN_USER } from '@/config';
import { AuthContext } from './auth-context';
import { toast } from 'sonner';

export { AuthContext };
export type { AuthContextValue, AuthProviderProps };

export function AuthProvider({ children, isAuthEnabled }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: isAuthEnabled ? null : MOCK_ADMIN_USER,
    isAuthenticated: !isAuthEnabled,
    isLoading: false,
  });
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  const updateAccessToken = (token: string | null) => {
    setAccessTokenState(token);
    saveTokenToStore(token);
  };

  // Auto-refresh access token before expiry (every 12 minutes)
  const scheduleTokenRefresh = useCallback(() => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    refreshTimerRef.current = setTimeout(async () => {
      try {
        const data = await refreshAccessToken();
        updateAccessToken(data.accessToken);
        const payload = verifyAccessToken(data.accessToken);
        if (payload) {
          setAuthState({
            user: {
              id: payload.userId,
              name: payload.name,
              email: payload.email,
              role: payload.role,
            },
            isAuthenticated: true,
            isLoading: false,
          });
        }
        scheduleTokenRefresh();
      } catch {
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
        updateAccessToken(null);
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
        updateAccessToken(token);
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
      updateAccessToken(null);
      toast.info('You have been logged out.');
    }
  }, []);

  useEffect(() => {
    if (isAuthEnabled) {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      refreshAccessToken()
        .then((data) => {
          updateAccessToken(data.accessToken);
          const payload = verifyAccessToken(data.accessToken);
          setAuthState({
            user: payload
              ? { id: payload.userId, name: payload.name, email: payload.email, role: payload.role }
              : MOCK_ADMIN_USER,
            isAuthenticated: true,
            isLoading: false,
          });
          scheduleTokenRefresh();
        })
        .catch(() => {
          setAuthState({ user: null, isAuthenticated: false, isLoading: false });
          updateAccessToken(null);
        });
    }
    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, [isAuthEnabled, scheduleTokenRefresh]);

  const permissions: PermissionMatrix = authState.user
    ? ROLE_PERMISSIONS[authState.user.role]
    : ROLE_PERMISSIONS['Admin'];


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
