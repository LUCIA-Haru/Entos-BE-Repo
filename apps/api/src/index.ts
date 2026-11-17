import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';
import { prisma } from '@entos/database';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(
    {
      port: env.PORT,
      env: env.NODE_ENV,
      baseUrl: env.API_BASE_URL,
    },
    `Entos API listening on http://localhost:${env.PORT}`,
  );
  logger.info('Try: GET /health  and  GET /health/ready');
});

async function shutdown(signal: string) {
  logger.info({ signal }, 'Shutting down gracefully…');
  server.close(async () => {
    try {
      await prisma.$disconnect();
    } catch (err) {
      logger.error({ err }, 'Error disconnecting Prisma');
    }
    process.exit(0);
  });

  // Force-exit if connections hang
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10_000).unref();
}

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));
