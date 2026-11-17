import pino from 'pino';
import { env } from '../config/env.js';

/**
 * Structured logger (JSON in production, pretty in development).
 * Prefer `logger.info({ cafeId }, 'fetched café')` over string concatenation —
 * structured fields are searchable in log platforms later.
 */
export const logger = pino({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport:
    env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: { colorize: true, translateTime: 'SYS:standard' },
        }
      : undefined,
});
