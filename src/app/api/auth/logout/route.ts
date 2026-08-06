import { NextResponse } from 'next/server';
import { securityConfig } from '@/config/security.config';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.delete(securityConfig.jwt.refreshTokenCookieName);
  return response;
}
