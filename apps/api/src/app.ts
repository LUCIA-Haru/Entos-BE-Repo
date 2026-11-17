import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { corsOrigins } from './config/env.js';
import { requestLogger } from './middleware/request-logger.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';
import { healthRouter } from './routes/health.js';
import { authRouter } from './auth/auth.routes.js';

/**
 * Build the Express application (without listening).
 * Separating `app` from `listen` makes testing and graceful shutdown cleaner.
 */
export function createApp(): Express {
  const app = express();

  // Security headers (safe defaults for an API)
  app.use(helmet());

  // CORS — allow listed frontend origins (see CORS_ORIGIN in .env)
  app.use(
    cors({
      origin: corsOrigins(),
      credentials: true,
    }),
  );

  // Request logging (skips noisy /health)
  app.use(requestLogger);

  // Auth routes FIRST — better-auth needs the raw body stream for some flows.
  // Do not put express.json() above this mount.
  app.use('/api/auth', authRouter);

  // JSON body parser for our own routes
  app.use(express.json({ limit: '1mb' }));

  // Public health endpoints
  app.use(healthRouter);

  // --- Future routers (Milestone 3+) ---
  // app.use('/cafes', cafesRouter);
  // app.use('/admin', adminRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
