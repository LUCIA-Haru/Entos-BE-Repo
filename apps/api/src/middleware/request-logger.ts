import { pinoHttp } from 'pino-http';
import type { IncomingMessage } from 'node:http';
import { logger } from '../lib/logger.js';

/** Attach request logging (method, URL, status, response time). */
export const requestLogger = pinoHttp({
  logger,
  autoLogging: {
    ignore: (req: IncomingMessage) =>
      req.url === '/health' || req.url === '/health/live',
  },
  customProps: () => ({
    service: 'entos-api',
  }),
});
