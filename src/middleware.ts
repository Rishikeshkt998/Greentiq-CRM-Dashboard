import { NextResponse, type NextRequest } from 'next/server';
import { generateCspHeader } from '@/lib/security/csp';
import { rateLimiter } from '@/lib/security/rate-limiter';
import { env } from '@/config/env';
import { verifyAccessToken } from '@/lib/utils/jwt';

export async function middleware(request: NextRequest) {
  // 1. API Rate Limiting Check
  if (request.nextUrl.pathname.startsWith('/api')) {
    const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? '127.0.0.1';
    const rateLimit = await rateLimiter.check(ip, env.RATE_LIMIT_MAX_REQUESTS, env.RATE_LIMIT_WINDOW_MS);

    if (!rateLimit.success) {
      return new NextResponse(
        JSON.stringify({ error: 'Too Many Requests', retryAfter: rateLimit.retryAfter }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(rateLimit.retryAfter),
            'X-RateLimit-Limit': String(env.RATE_LIMIT_MAX_REQUESTS),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }
  }

  // 2. Feature-Flagged Auth Protection
  const isAuthRequired = process.env.ENABLE_AUTH === 'true';
  if (isAuthRequired && request.nextUrl.pathname.startsWith('/api/customers')) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token || !verifyAccessToken(token)) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized. Invalid or expired token.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // 3. Content Security Policy Headers
  const { cspHeader, nonce } = generateCspHeader(env.ENABLE_CSP_NONCE);

  const response = NextResponse.next();

  if (nonce) {
    response.headers.set('x-csp-nonce', nonce);
  }

  // Inject Security Headers
  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
