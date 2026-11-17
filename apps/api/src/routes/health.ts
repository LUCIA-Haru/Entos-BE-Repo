import { Router, type Router as ExpressRouter } from 'express';
import { checkDatabaseConnection } from '@entos/database';
import type { HealthResponse } from '@entos/shared';

export const healthRouter: ExpressRouter = Router();

/**
 * Liveness — process is up. Does not require Postgres.
 * Use this for basic "did the server start?" checks and load balancer pings.
 */
healthRouter.get('/health', (_req, res) => {
  const body: HealthResponse = {
    ok: true,
    service: 'entos-api',
    timestamp: new Date().toISOString(),
  };
  res.status(200).json(body);
});

/** Alias used by some orchestrators. */
healthRouter.get('/health/live', (_req, res) => {
  res.status(200).json({ ok: true });
});

/**
 * Readiness — can we talk to Postgres?
 * Returns 503 if the database is unreachable (compose not running, bad URL, etc.).
 */
healthRouter.get('/health/ready', async (_req, res) => {
  const dbOk = await checkDatabaseConnection();
  if (!dbOk) {
    res.status(503).json({
      ok: false,
      service: 'entos-api',
      database: 'unavailable',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  res.status(200).json({
    ok: true,
    service: 'entos-api',
    database: 'up',
    timestamp: new Date().toISOString(),
  });
});
