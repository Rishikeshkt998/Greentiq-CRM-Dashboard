interface RateLimitRecord {
  count: number;
  resetTime: number;
}

class TokenBucketRateLimiter {
  private cache = new Map<string, RateLimitRecord>();

  async check(ip: string, limit: number = 60, windowMs: number = 60000) {
    const now = Date.now();
    const record = this.cache.get(ip);

    if (!record || now > record.resetTime) {
      this.cache.set(ip, { count: 1, resetTime: now + windowMs });
      return { success: true, remaining: limit - 1, retryAfter: 0 };
    }

    if (record.count >= limit) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      return { success: false, remaining: 0, retryAfter };
    }

    record.count += 1;
    return { success: true, remaining: limit - record.count, retryAfter: 0 };
  }
}

export const rateLimiter = new TokenBucketRateLimiter();
