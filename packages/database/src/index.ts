/**
 * @entos/database — single place to import the Prisma client from.
 *
 * Why a package instead of putting Prisma inside apps/api?
 * - Schema + migrations stay next to the client.
 * - Future workers / admin tools can import the same client.
 * - The Express app stays focused on HTTP.
 */

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

/**
 * Reuse one PrismaClient in development (tsx/watch reloads would otherwise
 * open many connections). In production we create a single instance per process.
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export { PrismaClient };
export * from '@prisma/client';

/** Cheap connectivity check used by readiness probes. */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}
