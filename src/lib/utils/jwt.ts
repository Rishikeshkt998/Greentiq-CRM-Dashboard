import { env } from '@/config/env';
import { UserRole } from '@/types/auth/rbac';

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
  exp?: number;
}

// Simple, Edge-compatible Web Crypto JWT helper
function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  return Buffer.from(base64, 'base64').toString('utf-8');
}

export function signAccessToken(payload: JwtPayload): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Math.floor(Date.now() / 1000) + 15 * 60; // 15 mins
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify({ ...payload, exp }));
  const signature = base64UrlEncode(`${encodedHeader}.${encodedPayload}.${env.JWT_ACCESS_SECRET}`);
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function signRefreshToken(payload: JwtPayload): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify({ ...payload, exp }));
  const signature = base64UrlEncode(`${encodedHeader}.${encodedPayload}.${env.JWT_REFRESH_SECRET}`);
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function verifyAccessToken(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload: JwtPayload = JSON.parse(base64UrlDecode(parts[1]));
    if (payload.exp && Date.now() / 1000 > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload: JwtPayload = JSON.parse(base64UrlDecode(parts[1]));
    if (payload.exp && Date.now() / 1000 > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}
