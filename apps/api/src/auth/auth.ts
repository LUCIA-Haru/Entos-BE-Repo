import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@entos/database';
import { env } from '../config/env.js';
import { logger } from '../lib/logger.js';

/**
 * better-auth instance — structure only for this scaffold.
 *
 * What is wired:
 * - Prisma adapter pointing at our User / Session / Account / Verification tables
 * - Secret + base URL from env
 * - Google / Facebook social providers *only if* client IDs are present
 *
 * What is NOT wired yet (by design for EB-3):
 * - Real OAuth app credentials
 * - Email OTP delivery (SMTP / Resend)
 * - Production cookie / trustedOrigins hardening beyond CORS list
 *
 * When you are ready for Milestone 5, fill GOOGLE_* / FACEBOOK_* in .env and
 * add an email OTP plugin + mailer.
 */

const socialProviders: NonNullable<Parameters<typeof betterAuth>[0]>['socialProviders'] = {};

if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
  };
} else {
  logger.debug('Google OAuth not configured (GOOGLE_CLIENT_ID / SECRET empty)');
}

if (env.FACEBOOK_CLIENT_ID && env.FACEBOOK_CLIENT_SECRET) {
  socialProviders.facebook = {
    clientId: env.FACEBOOK_CLIENT_ID,
    clientSecret: env.FACEBOOK_CLIENT_SECRET,
  };
} else {
  logger.debug('Facebook OAuth not configured (FACEBOOK_CLIENT_ID / SECRET empty)');
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  // Mounted under /api/auth in Express (see auth.routes.ts)
  basePath: '/api/auth',
  emailAndPassword: {
    // V1 product uses OTP / social — password login stays disabled.
    enabled: false,
  },
  socialProviders,
  // trustedOrigins will be tightened when a real frontend origin is known
  trustedOrigins: env.CORS_ORIGIN.split(',')
    .map((s) => s.trim())
    .filter(Boolean),
});

export type Auth = typeof auth;
