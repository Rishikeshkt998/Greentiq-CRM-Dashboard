import React from 'react';
import { AuthState } from './session';
import { PermissionMatrix } from './rbac';

export interface AuthContextValue extends AuthState {
  accessToken: string | null;
  permissions: PermissionMatrix;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthEnabled: boolean;
}

export interface AuthProviderProps {
  children: React.ReactNode;
  isAuthEnabled: boolean;
}
