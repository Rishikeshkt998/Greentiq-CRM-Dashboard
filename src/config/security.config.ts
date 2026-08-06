export const securityConfig = {
  rateLimit: {
    maxRequests: 60,
    windowMs: 60 * 1000, // 1 minute
  },
  jwt: {
    accessTokenExpiry: '15m',
    refreshTokenExpiry: '7d',
    refreshTokenCookieName: 'greentiq_refresh_token',
  },
  csp: {
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "blob:", "data:", "https://images.unsplash.com", "https://avatar.vercel.sh"],
    fontSrc: ["'self'", "data:"],
  },
};
