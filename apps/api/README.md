# `@entos/api` — Entos Express API

This folder is the **only runnable backend app** in Phase 1. Everything HTTP-related lives here: routes, middleware, auth mounting, and server startup.

If you are new to Node / Express, read this page after the root [README](../../README.md).

---

## What is Express?

**Express** is a small library that turns Node into an HTTP server with routes:

| Idea | Plain language |
| --- | --- |
| Route | “When someone calls `GET /health`, run this function.” |
| Middleware | Code that runs *before* (or around) your route — logging, CORS, auth. |
| `req` / `res` | Incoming request and outgoing response objects. |

You do **not** talk to PostgreSQL from route files forever — services + `@entos/database` will own that (see the learning plan). This scaffold already separates layers so café features can plug in cleanly.

---

## Folder map

```text
apps/api/
├── package.json          # Scripts + dependencies for this app only
├── tsconfig.json         # TypeScript settings (extends @entos/config)
├── eslint.config.mjs
├── README.md             # You are here
└── src/
    ├── index.ts          # Starts the HTTP server (listen + graceful shutdown)
    ├── app.ts            # Builds the Express app (middleware + routers)
    ├── config/
    │   └── env.ts        # Zod-validated environment variables
    ├── lib/
    │   ├── logger.ts     # pino structured logger
    │   └── errors.ts     # AppError helpers (404, 400, 401, …)
    ├── middleware/
    │   ├── request-logger.ts
    │   └── error-handler.ts
    ├── routes/
    │   └── health.ts     # GET /health, /health/live, /health/ready
    └── auth/
        ├── auth.ts       # better-auth instance (placeholders for OAuth)
        └── auth.routes.ts
```

### Why `app.ts` and `index.ts` are separate

- `createApp()` = “build the app” (useful for tests later).
- `index.ts` = “listen on a port and shut down cleanly.”

Keeping them apart is a production habit, not extra complexity for its own sake.

---

## How to run (this package)

From the **repo root** (recommended):

```bash
pnpm --filter @entos/api dev
```

Or via Turbo (runs dependent `db:generate` first):

```bash
pnpm dev
```

Then open:

| URL | Meaning |
| --- | --- |
| http://localhost:3000/health | Process is alive (no DB required) |
| http://localhost:3000/health/ready | Process + Postgres are reachable |
| http://localhost:3000/api/auth/* | better-auth routes (OAuth/OTP later) |

---

## Environment variables this app reads

Loaded from the **repo root** `.env` (see `.env.example`).

Important ones:

- `PORT` — listen port (default `3000`)
- `DATABASE_URL` — Postgres connection string
- `CORS_ORIGIN` — browser origins allowed to call the API
- `BETTER_AUTH_SECRET` / `BETTER_AUTH_URL` — auth library config
- `GOOGLE_*` / `FACEBOOK_*` — leave empty until you create OAuth apps

---

## Request flow (mental model)

```text
HTTP request
  → helmet / cors / request logger
  → /api/auth/*  → better-auth handler  (or)
  → express.json()
  → your routers (health today; cafés next)
  → notFoundHandler / errorHandler
```

When you add `GET /cafes`, you will:

1. Create `routes/cafes.ts` (HTTP only)
2. Call a service function (business rules)
3. Use `prisma` from `@entos/database` inside that service

---

## Scripts

| Script | What it does |
| --- | --- |
| `pnpm --filter @entos/api dev` | Run with `tsx watch` (auto-reload on save) |
| `pnpm --filter @entos/api build` | Compile TypeScript → `dist/` |
| `pnpm --filter @entos/api start` | Run compiled `dist/` (needs build first) |
| `pnpm --filter @entos/api lint` | ESLint |
| `pnpm --filter @entos/api typecheck` | TypeScript without emitting files |

---

## What is intentionally unfinished

- Real Google / Facebook OAuth credentials
- Email OTP sending
- Café / review / collection HTTP endpoints (next milestones)

The **structure** is ready so those features land without reshaping the repo.
