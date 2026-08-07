import { LoginPayload, LoginResponse } from './auth-types';

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Login failed');
  }
  return response.json();
}

export async function refreshAccessToken(): Promise<{ accessToken: string }> {
  const response = await fetch('/api/auth/refresh', { method: 'POST' });
  if (!response.ok) throw new Error('Session expired. Please log in again.');
  return response.json();
}

export async function logoutUser(): Promise<void> {
  await fetch('/api/auth/logout', { method: 'POST' });
}
