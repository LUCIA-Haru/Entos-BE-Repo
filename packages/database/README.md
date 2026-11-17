# `@entos/database`

Prisma schema, migrations, and the shared `prisma` client for Entos.

## Why a separate package?

The Express app should not “own” the database forever. Keeping schema + client here means:

- Migrations live next to the models
- Future workers / admin tools can import `@entos/database`
- `apps/api` stays focused on HTTP

## Commands

From the **repo root** (scripts load `DATABASE_URL` from the root `.env` via `dotenv-cli`):

```bash
pnpm db:generate          # Generate @prisma/client from schema.prisma
pnpm db:migrate           # Dev migrations (creates/applies)
pnpm db:migrate:deploy    # Apply existing migrations (CI / prod)
pnpm db:seed              # Optional Yangon sample cafés
pnpm db:studio            # Visual browser for your local DB
```

Make sure you copied `.env.example` → `.env` at the repo root first.

## Schema overview

See `prisma/schema.prisma`. Auth tables match better-auth; domain tables cover Café, Menu, Hours, Tags, Review, Collection, VisitLog.
