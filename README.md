# Entos BE

Backend for **Entos** — a Myanmar café discovery platform (curated café info, search/filters, later admin CMS and owner tools).

This repository is a **Turborepo + pnpm monorepo**. Phase 1 ships one Express API talking to PostgreSQL via Prisma.

> New to Node, TypeScript, Express, or Turborepo? Read this README slowly — it explains *what* each piece is and *why* it exists, not only *how* to run commands.

---

## Stack (locked)

| Piece | Choice | Role in plain language |
| --- | --- | --- |
| Runtime | Node.js 20+ | Runs our TypeScript-compiled JavaScript on a server |
| Language | TypeScript | JavaScript + types (catch mistakes before runtime) |
| Monorepo | Turborepo + pnpm | One repo, several packages; Turbo runs tasks efficiently |
| HTTP API | Express | Maps URLs like `GET /health` to functions |
| Database | PostgreSQL | Durable storage for cafés, users, reviews, … |
| ORM | Prisma | Schema + migrations + typed query client |
| Auth (V1) | better-auth | Sessions + Google/Facebook OAuth + email OTP *(wired as placeholders in this PR)* |

---

## Repository layout

```text
Entos-BE-Repo/
├── apps/
│   └── api/                 # Express HTTP server (the app you run)
├── packages/
│   ├── database/            # Prisma schema, migrations, DB client
│   ├── shared/              # Shared Zod schemas / types / helpers
│   └── config/              # Shared TypeScript + ESLint config
├── docker-compose.yml       # Local PostgreSQL
├── package.json             # Root scripts (pnpm + turbo)
├── pnpm-workspace.yaml      # Which folders are workspace packages
├── turbo.json               # Task pipeline (build/dev/lint/db:*)
├── .env.example             # Documented env vars — copy to .env
└── README.md                # You are here
```

### App vs package (important)

- **App** (`apps/api`) — something you *start* (`pnpm --filter @entos/api dev`).
- **Package** (`packages/*`) — a library other code *imports* (e.g. `@entos/database`).

V1 has **one** app. Packages keep the HTTP layer thin and reusable.

More detail for the API: [`apps/api/README.md`](./apps/api/README.md).

---

## Prerequisites

1. **Node.js 20+** — check with `node -v`. Use [nvm](https://github.com/nvm-sh/nvm) if you manage multiple versions (`.nvmrc` says `20`).
2. **pnpm 9+** — `corepack enable && corepack prepare pnpm@9.15.9 --activate`  
   or `npm install -g pnpm@9`
3. **Docker Desktop** (recommended for Postgres) — or any PostgreSQL 16 you can reach.

### Note for Myanmar / local networks

Cloud database free tiers can be slow or awkward (signup, blocked ports, high latency). Prefer **Docker Compose Postgres** on your laptop for learning and day-to-day development. Point `DATABASE_URL` at a cloud instance later when you deploy.

If Docker Hub pulls are slow, retry or use a mirror your ISP handles better — you only need the `postgres:16-alpine` image once.

---

## Quick start (step by step)

### 1. Install dependencies

```bash
cd Entos-BE-Repo
pnpm install
```

pnpm reads `pnpm-workspace.yaml` and links `apps/*` + `packages/*` together.

### 2. Create your env file

```bash
cp .env.example .env
```

Open `.env` and keep the Docker defaults for local work. Generate a real auth secret:

```bash
# macOS / Linux / Git Bash
openssl rand -base64 32
```

Paste the result into `BETTER_AUTH_SECRET` (must be at least 32 characters).

Leave `GOOGLE_*` / `FACEBOOK_*` empty for now — OAuth is scaffolded, not live.

### 3. Start PostgreSQL

```bash
docker compose up -d
```

Check it is healthy:

```bash
docker compose ps
```

### 4. Generate Prisma client + run migrations

```bash
pnpm db:generate
pnpm db:migrate
```

The first `db:migrate` will ask for a migration name if Prisma needs one — for a fresh clone the initial migration is already in the repo, so `migrate` should apply it.

Optional demo cafés (Yangon):

```bash
pnpm db:seed
```

### 5. Start the API

```bash
pnpm dev
```

You should see a log like: `Entos API listening on http://localhost:3000`.

### 6. Smoke-test

```bash
curl http://localhost:3000/health
# → {"ok":true,"service":"entos-api","timestamp":"..."}

curl http://localhost:3000/health/ready
# → {"ok":true,"service":"entos-api","database":"up",...}
```

---

## Common scripts (from repo root)

| Command | What it does |
| --- | --- |
| `pnpm install` | Install all workspace dependencies |
| `pnpm dev` | Start API in watch mode (Turbo) |
| `pnpm build` | Build all packages/apps |
| `pnpm lint` | Lint all packages |
| `pnpm typecheck` | TypeScript check all packages |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:migrate` | Create/apply migrations (dev) |
| `pnpm db:migrate:deploy` | Apply migrations (CI / production) |
| `pnpm db:seed` | Insert minimal sample cafés |
| `pnpm db:studio` | Open Prisma Studio (DB GUI) |

Filter a single package:

```bash
pnpm --filter @entos/api dev
pnpm --filter @entos/database db:studio
```

---

## Domain models included in Prisma

Aligned with V1 product language (see learning plan):

- **User** (+ better-auth **Session / Account / Verification**)
- **Cafe** (location fields: city, township, lat/lng, timezone)
- **MenuItem**, **CafeHours**, **Tag** / **CafeTag**
- **Review**, **Collection** / **CollectionCafe**, **VisitLog**

HTTP endpoints for cafés/reviews are **not** in this scaffold yet — schema + API foundation come first.

---

## Auth status (this PR)

- better-auth is installed and mounted at `/api/auth/*`
- Prisma adapter uses our schema
- Google / Facebook providers activate **only when** client IDs/secrets are set in `.env`
- No real OAuth secrets are committed

---

## Troubleshooting

| Problem | What to try |
| --- | --- |
| `pnpm: command not found` | Install pnpm via Corepack (see Prerequisites) |
| `Invalid environment variables` | Ensure `.env` exists; compare with `.env.example` |
| `/health/ready` → 503 | Start Postgres: `docker compose up -d`, then re-check `DATABASE_URL` |
| Port 5432 already in use | Change the left side in `docker-compose.yml` (`"5433:5432"`) and update `DATABASE_URL` |
| Port 3000 in use | Set `PORT=3001` in `.env` |
| Prisma client missing | Run `pnpm db:generate` |

---

## What this PR intentionally does **not** include

- Live OAuth / email OTP providers
- Café REST endpoints / CMS / image CDN / maps
- Frontend React app

Next milestones: public café read API → menus/hours/tags → auth that actually signs you in → reviews & collections → visit logs → admin role gate.

---

## License

Private / unpublished unless otherwise noted by the Entos project owners.
