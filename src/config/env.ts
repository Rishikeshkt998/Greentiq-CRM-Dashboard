import { z } from 'zod';

const envSchema = z.object({
  // Public Client Variables
  NEXT_PUBLIC_APP_NAME: z.string().default('Greentiq Innovations CRM'),
  NEXT_PUBLIC_APP_URL: z.string().default('http://localhost:3000'),
  NEXT_PUBLIC_DEFAULT_PAGE_SIZE: z.coerce.number().default(8),

  // Feature Flags
  ENABLE_AUTH: z.preprocess((val) => val === 'true' || val === true, z.boolean()).default(false),
  ENABLE_MOCK_DELAY: z.preprocess((val) => val === 'true' || val === true, z.boolean()).default(true),

  // Server Secrets
  JWT_ACCESS_SECRET: z.string().default('greentiq_access_token_secret_2026_super_key'),
  JWT_REFRESH_SECRET: z.string().default('greentiq_refresh_token_secret_2026_super_key'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(60),
  MOCK_API_SIMULATED_LATENCY_MS: z.coerce.number().default(400),
  ENABLE_CSP_NONCE: z.preprocess((val) => val === 'true' || val === true, z.boolean()).default(false),

  // Database Connection (Optional)
  MONGODB_URI: z.string().optional(),
});

const parseEnv = () => {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_DEFAULT_PAGE_SIZE: process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE,

    ENABLE_AUTH: process.env.ENABLE_AUTH,
    ENABLE_MOCK_DELAY: process.env.ENABLE_MOCK_DELAY,
    ENABLE_CSP_NONCE: process.env.ENABLE_CSP_NONCE,

    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS,
    RATE_LIMIT_MAX_REQUESTS: process.env.RATE_LIMIT_MAX_REQUESTS,
    MOCK_API_SIMULATED_LATENCY_MS: process.env.MOCK_API_SIMULATED_LATENCY_MS,

    MONGODB_URI: process.env.MONGODB_URI,
  });

  if (!parsed.success) {
    console.error('❌ Invalid Environment Variables Configuration:', parsed.error.format());
    throw new Error('Invalid Environment Variables');
  }

  return parsed.data;
};

export const env = parseEnv();
