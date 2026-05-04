# DevFolio

A portfolio builder for developers. Sign in with GitHub, fill out your projects, skills, and experience, and get a shareable public page at `devfolio.app/[username]` — no HTML, CSS, or hosting setup required.

Built as a team project for **PV247 — Modern Development of User Interfaces** at FI MUNI.

---

## What it does

Users log in with GitHub and hit a dashboard where they can fill out their profile section by section: a short bio, projects with tech stack tags and links, work experience, skills grouped by category, and social links. Everything they save shows up on their public page, which is server-rendered and has proper metadata and a dynamically generated OG image for link previews.

The editor has a few extras that make filling out a portfolio less tedious:

- **AI bio generator** — type in your role and years of experience, get a bio draft you can edit
- **Project description improver** — rough description in, polished version out
- **Job title suggestions** — based on your skills, suggests what to put in your headline
- **Skills from projects** — scans the tech stack tags across your projects and offers them as skills to add (no AI, just aggregation)
- **Portfolio completeness score** — a small progress bar that nudges you to fill the remaining sections
- **Broken link checker** — pings every GitHub and live URL you've added and flags anything that 404s
- **Live preview** — toggle between editor and the public page without leaving the dashboard

---

## Stack

|             |                                                 |
| ----------- | ----------------------------------------------- |
| Framework   | Next.js 16 (App Router)                         |
| Language    | TypeScript                                      |
| Styling     | Tailwind CSS                                    |
| Components  | shadcn/ui                                       |
| Auth        | Better Auth (GitHub OAuth)                      |
| Database    | Turso (hosted SQLite)                           |
| ORM         | Drizzle                                         |
| Client data | Tanstack Query                                  |
| Forms       | React Hook Form                                 |
| Validation  | Zod                                             |
| AI          | OpenRouter (free models, OpenAI-compatible API) |
| Hosting     | Vercel                                          |

---

## Design system

The visual language is locked. The full spec — tokens, components, layout patterns, voice, recommended implementation order — lives in [`docs/design_handoff_devfolio/README.md`](./docs/design_handoff_devfolio/README.md).

`app/globals.css` is the production token sheet (DevFolio raw tokens + shadcn aliases + Tailwind v4 `@theme` bridge). Every shadcn primitive picks the look up automatically. Fonts are Geist + Geist Mono via `next/font/google`. The default theme is dark — set on `<html data-theme="dark">` in `app/layout.tsx`. Light mode is included for free; switching is just a `data-theme` attribute swap.

The interactive preview at `docs/design_handoff_devfolio/preview/design-system.html` opens in any browser without a build step and is the source of truth for layouts and copy.

---

## Docs

Deeper references live in the [`docs/`](./docs) folder:

- [`docs/architecture.md`](./docs/architecture.md) — data flow, rendering model, caching, auth flow, end-to-end request lifecycles
- [`docs/features.md`](./docs/features.md) — per-feature specs, AI prompts, completeness score formula, broken link checker behavior
- [`docs/backend-plan.md`](./docs/backend-plan.md) — backend implementation plan: schema, Better Auth, DAL + `proxy.ts`, server actions, OpenRouter wiring, build order
- [`docs/design_handoff_devfolio/`](./docs/design_handoff_devfolio) — design system handoff: tokens, components, mockups

The rest of this file is the short version.

---

## How it's put together

### Reads go through RSC, writes go through Server Actions

The public profile page (`/[username]`) is a React Server Component that queries Drizzle directly. There's no `/api/profile/:username` endpoint — that would just be calling our own server from our own server. Same applies inside the dashboard: server components read from the DB, no fetch to self.

Mutations go through Server Actions in `server-actions/`. Every action validates its input with a Zod schema, re-checks the session through the Data Access Layer (`lib/dal.ts`), and ends with `revalidatePath()` so the RSC cache reflects the change. The only API routes we keep are the Better Auth catch-all and the dynamic OG image route — both of those genuinely need to be HTTP endpoints. Optimistic auth gating lives in `proxy.ts` (Next.js 16's renamed `middleware.ts`); real authorization happens in the DAL.

### Zod schemas are shared

Each form has a Zod schema in `schemas/`, used both as the `zodResolver` for React Hook Form on the client and as the input validator in the corresponding server action. One schema, two uses — no duplicate type definitions.

### Client components stay narrow

Server components are the default. `'use client'` only goes on files that genuinely need interactivity (forms, toggles, the AI-assist buttons). When a client component needs a server-rendered piece inside it, it takes it as a `children` or prop rather than importing it.

### Tanstack Query for anything client-triggered

The `QueryClientProvider` lives in `app/providers.tsx` (a small `'use client'` file) and wraps `{children}` inside the root layout. We use it mostly for the AI-assist calls and the broken link checker — anywhere the server action result needs to show loading state and update UI without a full route revalidation.

---

## Routes

```
/                           Landing page
/login                      GitHub OAuth entry
/onboarding                 First-time username claim
/[username]                 Public profile (RSC)
/(dashboard)
  /dashboard                Redirects to /dashboard/profile
  /dashboard/profile        Bio, headline, avatar
  /dashboard/projects       Project CRUD
  /dashboard/skills         Skill CRUD
  /dashboard/experience     Experience CRUD
  /dashboard/socials        Social link CRUD
  /dashboard/settings       Username, account
/api/auth/[...all]          Better Auth catch-all
/api/og/[username]          Dynamic OG image via next/og
```

`/[username]` is fully public. Everything under `/dashboard` requires auth, enforced at the layout level. The `(dashboard)` route group wraps all authenticated pages with the shared dashboard shell without affecting URLs.

---

## Database

Schema lives in `db/schema/`, split one file per table. The Drizzle client is a singleton in `db/index.ts`:

```ts
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN
});

export const db = drizzle(client, { schema });
```

Our domain tables are `profiles`, `projects`, `skills`, `experience`, and `socials`. Better Auth manages its own schema (users, sessions, accounts, verifications) — we generate it once with the Better Auth CLI and commit it alongside our own tables. Everything non-auth has a `userId` foreign key with `onDelete: 'cascade'`. Projects store their tech stack as a JSON column.

The custom `username` column on `user` is added via Better Auth's official `username` plugin, with a Drizzle `uniqueIndex` defined alongside our own schema files — `additionalFields` alone does not enforce DB uniqueness.

For local dev, Turso can run a local SQLite file via its CLI:

```bash
turso dev --db-file dev.db
```

Then point `DATABASE_URL` at `http://localhost:8080`. For production, create a database on turso.tech and use the URL + token it gives you.

Migrations are handled by drizzle-kit. After changing a schema file, run:

```bash
npx drizzle-kit push
```

When the Better Auth config changes (new providers, new plugins), update `db/schema/auth.ts` by hand to match — the canonical schema lives in `node_modules/@better-auth/core/dist/db/get-tables.mjs` and each plugin's `schema.mjs`. We avoid `@better-auth/cli` because its current stable lags behind `better-auth` itself and breaks on `generate` (see [docs/backend-plan.md](./docs/backend-plan.md) for the workaround rationale).

---

## Project structure

```
proxy.ts                        # Optimistic auth gating (Next.js 16 — formerly middleware.ts)
app/
├── layout.tsx                  # Root layout, wraps Providers
├── page.tsx                    # Landing
├── providers.tsx               # 'use client' — QueryClientProvider
├── globals.css                 # Design tokens + shadcn aliases
├── (dashboard)/
│   ├── layout.tsx
│   └── dashboard/...
├── [username]/
│   ├── page.tsx                # Public RSC profile
│   └── not-found.tsx
├── login/page.tsx
├── onboarding/page.tsx
└── api/
    ├── auth/[...all]/route.ts
    └── og/[username]/route.ts
components/
├── ui/                         # shadcn components
└── ...                         # feature components (Logo, etc.)
db/
├── index.ts
└── schema/                     # one file per table + relations.ts + auth.ts (generated)
server-actions/                 # 'use server' mutation handlers
schemas/                        # Shared Zod schemas
hooks/                          # Custom hooks
lib/
├── auth.ts                     # Better Auth config (server)
├── auth-client.ts              # Better Auth client
├── dal.ts                      # Data Access Layer — session/ownership helpers ('server-only')
└── utils.ts                    # cn() helper
types/
docs/
├── architecture.md
├── features.md
├── backend-plan.md             # Backend implementation plan
└── design_handoff_devfolio/    # Design system spec + preview
```

---

## Conventions

We stick closely to what the course lectures established. A quick reference for anyone contributing:

**TypeScript** — `const` by default, `===` always, lean on inference, avoid `any`. Prefer `as const` arrays over enums. Optional chaining and nullish coalescing over manual checks.

**React** — functional components only, destructure props in the signature, stable keys in `.map()`, lambda event handlers, keep components pure. No class components anywhere.

**State** — treat objects and arrays as immutable (spread when updating), use the callback form of setters when the new value depends on the previous, use `useReducer` for complex related state. Minimize `useEffect` — if you can do it in the event handler, do it there.

**Optimization** — reach for composition (lift content up, move state down) before `useMemo`, `useCallback`, or `React.memo`. Use `forwardRef` when wrapping shadcn primitives that need `asChild`.

**Styling** — Tailwind classes directly on elements, no separate CSS files beyond `globals.css`. shadcn components get copy-pasted into `components/ui/` and customized in place. All visual tokens (colors, type scale, spacing, radii) flow through CSS variables defined in `globals.css` — never hardcode hex. Use semantic HTML and mobile-first breakpoints. Full system spec: [`docs/design_handoff_devfolio/README.md`](./docs/design_handoff_devfolio/README.md).

**Async** — `async/await` with `try/catch`, never `.then` chains. Client-side data always goes through Tanstack Query, wrapped in named custom hooks (`useXQuery`, `useCreateXMutation`) with hierarchical query keys.

**Forms** — React Hook Form with `zodResolver`. Every input validated. Schemas live in `schemas/` and are reused on the server.

**Next.js** — App Router, server components by default, `'use client'` pushed as far down the tree as possible. `<Link>` for navigation, `redirect()` from `next/navigation` in server components, `useRouter().push()` only for programmatic client-side navigation. Remember that in Next.js 15+, `params`, `searchParams`, `cookies()`, and `headers()` are all async — `await` them in server components, server actions, and route handlers. In v16, `middleware.ts` is renamed to `proxy.ts`, runs on Node by default, and the `runtime` option throws if set. `GET` route handlers are dynamic by default in v16.

**Server Actions** — files marked `'use server'`, input validated with Zod, session re-checked through `lib/dal.ts` (Next.js 16 explicitly recommends a Data Access Layer over relying on `proxy.ts`), and always end with `revalidatePath()`. Organized by entity in `server-actions/`.

---

## Getting started

### Prerequisites

- **Node.js 20.6+** — required by Next.js 16
- **pnpm 10+** — `npm i -g pnpm` if you don't have it
- **Turso CLI** — for the local libSQL database
  - macOS / Linux / WSL: `curl -sSfL https://get.tur.so/install.sh | bash`
  - Windows: install in WSL (above) — see WSL note below

### 1. Install dependencies

```bash
pnpm install
```

### 2. Local database

In a dedicated terminal (WSL on Windows; otherwise the regular shell):

```bash
turso dev --db-file dev.db
```

Leave it running. It serves an offline libSQL server on `127.0.0.1:8080` backed by a `dev.db` file in the project root.

### 3. Environment

Copy the template and fill in the secrets:

```bash
cp .env.example .env.local        # macOS / Linux / WSL
copy .env.example .env.local      # Windows PowerShell
```

`.env.local` (gitignored):

```
# leave DATABASE_URL on 127.0.0.1 — Node's fetch resolves "localhost" to ::1 first,
# turso dev only binds IPv4, and you'll get ECONNREFUSED with localhost.
DATABASE_URL=http://127.0.0.1:8080
DATABASE_AUTH_TOKEN=

BETTER_AUTH_SECRET=                                   # openssl rand -base64 32
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

OPENROUTER_API_KEY=
OPENROUTER_MODEL=deepseek/deepseek-chat-v3.1:free     # any free model on openrouter.ai/models
```

**GitHub OAuth app** — register at <https://github.com/settings/developers> → **New OAuth App**:

- Homepage URL: `http://localhost:3000`
- Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

Copy the Client ID and a freshly generated Client Secret into `.env.local`.

**OpenRouter** — sign up at <https://openrouter.ai>, generate a key under the dashboard. Free models live at <https://openrouter.ai/models?max_price=0>; the default works without paid credits.

### 4. Push the schema

```bash
pnpm db:push
```

Drizzle Kit reads `.env.local`, connects to turso dev via libSQL, and creates every table.

### 5. Run the app

```bash
pnpm dev
```

Open <http://localhost:3000>. Click **Sign in**, complete the GitHub OAuth flow, pick a username, and you'll land on `/dashboard/profile`.

### Useful scripts

- `pnpm dev` — Next.js dev server
- `pnpm build` / `pnpm start` — production build + run
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm lint` / `pnpm lint:fix` — ESLint
- `pnpm format` / `pnpm format:check` — Prettier
- `pnpm db:push` — sync `db/schema/` to the local DB (run after any schema change)
- `pnpm db:studio` — Drizzle Studio (web UI for inspecting + editing rows)

### Editor + commit hooks

Prettier + ESLint are wired up two ways:

- **On save (VS Code)** — install the recommended extensions when prompted (`.vscode/extensions.json`); `.vscode/settings.json` enables format-on-save and ESLint auto-fix.
- **On commit (any editor)** — Husky runs `lint-staged` in a `pre-commit` hook. Staged `.ts`/`.tsx` files are auto-formatted and lint-fixed; the commit aborts if anything fails. Set up automatically by `pnpm install` (via the `prepare` script). Other editors (WebStorm, etc.) can use `.editorconfig` for indent/quote hints.

### Windows + WSL note

The recommended setup is to **run pnpm scripts from Windows** (PowerShell) and **`turso dev` from WSL**. WSL2 forwards the port automatically, but `node_modules` contains platform-native binaries (esbuild, libsql) — installing in one environment then running in the other will fail with platform-mismatch errors. Pick one side for `pnpm install`, stick with it.

---

## Team

Three of us, working split roughly like this:

- **Backend & auth** — Drizzle schema, Better Auth setup, all server actions, Zod schemas, AI integration, broken link checker
- **Public page & SSR** — the `/[username]` route, dynamic metadata, OG image generation, landing page, completeness score
- **Dashboard & UX** — route group layout, all editor forms, Tanstack Query provider, custom hooks, live preview, onboarding flow, responsive pass, Vercel deploy

Everyone is expected to commit. Each student needs contributions visible in the git history by the final review.

---

## Deadlines

- **April 6** — submit chosen project topic via the course web app
- **April 21/22** — mid-project review, roughly 10% done, repo live, Next.js app bootstrapped, features clearly scoped
- **End of semester** — final 15-minute presentation (5 min demo, 5 min code walkthrough, 5 min Q&A), pass/fail
