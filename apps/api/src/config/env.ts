import { z } from 'zod';

/**
 * Typed environment config.
 *
 * Why Zod here?
 * - process.env is all strings (or undefined). A typo like PORT=abc would
 *   silently become NaN without validation.
 * - Failing fast at startup is better than a confusing crash mid-request.
 */

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  API_BASE_URL: z.string().url().default('http://localhost:3000'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  BETTER_AUTH_SECRET: z
    .string()
    .min(32, 'BETTER_AUTH_SECRET must be at least 32 characters')
    .default('dev-only-change-me-please-use-openssl-rand'),
  BETTER_AUTH_URL: z.string().url().default('http://localhost:3000'),

  GOOGLE_CLIENT_ID: z.string().optional().default(''),
  GOOGLE_CLIENT_SECRET: z.string().optional().default(''),
  FACEBOOK_CLIENT_ID: z.string().optional().default(''),
  FACEBOOK_CLIENT_SECRET: z.string().optional().default(''),

  EMAIL_FROM: z.string().default('noreply@entos.local'),
  SMTP_HOST: z.string().optional().default(''),
  SMTP_PORT: z.coerce.number().int().positive().optional().default(587),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASSWORD: z.string().optional().default(''),
});

export type Env = z.infer<typeof EnvSchema>;

function loadEnv(): Env {
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error('❌ Invalid environment variables:');
    console.error(parsed.error.flatten().fieldErrors);
    console.error('Copy .env.example → .env and fill in the values.');
    process.exit(1);
  }
  return parsed.data;
}

export const env = loadEnv();

/** Parse CORS_ORIGIN into an allow-list array. */
export function corsOrigins(): string[] | boolean {
  const raw = env.CORS_ORIGIN.trim();
  if (raw === '*') {
    // Reflect request origin — fine for early local experiments only.
    return true;
  }
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}
