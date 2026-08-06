import { NextResponse, type NextRequest } from 'next/server';
import { verifyRefreshToken, signAccessToken } from '@/lib/utils/jwt';
import { securityConfig } from '@/config/security.config';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get(securityConfig.jwt.refreshTokenCookieName)?.value;
    if (!refreshToken) {
      return NextResponse.json({ error: 'Refresh token missing' }, { status: 401 });
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired refresh token' }, { status: 401 });
    }

    const newAccessToken = signAccessToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      name: payload.name,
    });

    return NextResponse.json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Token refresh failed' }, { status: 500 });
  }
}
