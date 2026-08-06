import { NextResponse } from 'next/server';
import { mockUsers } from '@/lib/db/mock-db';
import { signAccessToken, signRefreshToken } from '@/lib/utils/jwt';
import { securityConfig } from '@/config/security.config';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const user = mockUsers.find((u) => u.email.toLowerCase() === email?.toLowerCase());
    if (!user || user.passwordHash !== password) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        title: user.title,
      },
      accessToken,
    });

    // Set Refresh Token in httpOnly Cookie
    response.cookies.set(securityConfig.jwt.refreshTokenCookieName, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
