import { Router, type Router as ExpressRouter } from 'express';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth.js';

/**
 * Mount better-auth's Node handler under /api/auth.
 *
 * Teaching note: better-auth owns the paths under this prefix (sign-in,
 * callbacks, session). We forward every method/path to its handler.
 *
 * Important: do not put `express.json()` *above* this mount for auth routes —
 * better-auth may need the raw request body. See app.ts for mount order.
 */
export const authRouter: ExpressRouter = Router({ mergeParams: true });

const handler = toNodeHandler(auth);

// Express 4: catch the mount root and all nested paths
authRouter.use(handler);
