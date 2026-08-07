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

  // Restore session from localStorage on client mount to prevent SSR hydration mismatch
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('gt_user_session');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed && parsed.email) {
            setAuthState({ user: parsed, isAuthenticated: true, isLoading: false });
          }
        } catch (e) {}
      }
    }
  }, []);

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
          const userObj = {
            id: payload.userId,
            name: payload.name,
            email: payload.email,
            role: payload.role,
          };
          if (typeof window !== 'undefined') {
            localStorage.setItem('gt_user_session', JSON.stringify(userObj));
          }
          setAuthState({
            user: userObj,
            isAuthenticated: true,
            isLoading: false,
          });
        }
        scheduleTokenRefresh();
      } catch {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('gt_user_session');
        }
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
        if (typeof window !== 'undefined') {
          localStorage.setItem('gt_user_session', JSON.stringify(user));
        }
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
      if (typeof window !== 'undefined') {
        localStorage.removeItem('gt_user_session');
      }
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
          if (payload) {
            const userObj = { id: payload.userId, name: payload.name, email: payload.email, role: payload.role };
            if (typeof window !== 'undefined') {
              localStorage.setItem('gt_user_session', JSON.stringify(userObj));
            }
            setAuthState({
              user: userObj,
              isAuthenticated: true,
              isLoading: false,
            });
            scheduleTokenRefresh();
          } else {
            if (typeof window !== 'undefined') localStorage.removeItem('gt_user_session');
            setAuthState({ user: null, isAuthenticated: false, isLoading: false });
            updateAccessToken(null);
          }
        })
        .catch(() => {
          if (typeof window !== 'undefined') localStorage.removeItem('gt_user_session');
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
