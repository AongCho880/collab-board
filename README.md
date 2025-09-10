# CollabBoard

> Team collaboration & project management with **Next.js** — Kanban tasks, real‑time chat, file sharing, search, and analytics. Built to be deployable on a **\$0‑tier** stack (Vercel + Supabase) while following industry‑style Git & CI from day one.

---

## ✨ Features

-   **Auth & Roles**: NextAuth (Google/GitHub), sessions, role‑based access (Admin/Member/Guest)
-   **Teams & Projects**: invite members, create projects per team
-   **Tasks (Kanban)**: title/description/due/labels/priority/assignee; drag‑and‑drop board
-   **Realtime**: live task updates, presence, typing indicators (Supabase Realtime)
-   **Chat & Notifications**: project chat rooms; email invites/alerts (Resend)
-   **Files**: uploads & previews (images/PDF) via signed URLs (Supabase Storage)
-   **Search**: Postgres full‑text search across tasks & messages
-   **Analytics**: progress charts & task completion trends (Recharts)
-   **Security**: input validation (Zod), authz checks, optional rate limiting (Upstash)

---

## 🧱 Stack

**Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, TanStack Query, Zustand
**Backend**: Next.js Route Handlers (serverless), Prisma ORM, PostgreSQL (Supabase)
**Realtime & Storage**: Supabase Realtime & Buckets (signed URLs)
**Auth**: NextAuth (Google, GitHub)
**Charts**: Recharts
**Email**: Resend
**CI/CD**: GitHub Actions → Vercel
**Monitoring (optional)**: Sentry

---

## 📦 Monorepo? (not required)

This repo starts as a single app. If you later split into packages (`apps/web`, `packages/ui`), add a `pnpm-workspace.yaml` and it will scale.

---

## 🚀 Quick Start

### Prerequisites

-   **Node 20+**
-   **pnpm 9** (recommended). Team‑safe via Corepack:

    ```bash
    corepack enable
    corepack prepare pnpm@9.9.0 --activate
    pnpm -v
    ```

-   A **Supabase** project (Postgres + API keys)
-   OAuth apps for **Google** and/or **GitHub** (for NextAuth)

### 1) Clone & install

```bash
git clone https://github.com/<you-or-org>/collabboard.git
cd collabboard
pnpm install
```

### 2) Configure environment

Create `.env.local` in project root:

```ini
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev_secret_replace_in_prod

# OAuth providers
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Database (Supabase → Settings → Database → Connection string)
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB?pgbouncer=true&connect_timeout=5

# Supabase (Settings → API)
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE=   # server only, used for signed uploads/downloads

# Emails (Resend)
RESEND_API_KEY=

# Optional
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
SENTRY_DSN=
```

### 3) Database & Prisma

```bash
pnpm exec prisma migrate dev --name init
pnpm exec prisma generate
```

### 4) Start the app

```bash
pnpm dev
# http://localhost:3000
```

---

## 🗂️ Project Structure

```
src/
  app/
    (auth)/sign-in/...
    (dashboard)/app/...
    api/...
    layout.tsx
    page.tsx
  components/
  features/          # domain modules (teams, tasks, chat, analytics)
  lib/               # singletons (prisma, auth, supabase, providers)
  server/            # server utilities (email, realtime)
  styles/
  types/
prisma/
  schema.prisma
```

---

## 🔐 Security Model (at a glance)

-   **AuthN**: NextAuth sessions in DB via Prisma adapter
-   **AuthZ**: server helpers assert membership/roles before mutations
-   **Validation**: Zod on every request body
-   **Files**: server creates **signed URLs** with Supabase **service role** key (kept server‑side)
-   **Rate limiting (optional)**: Upstash Redis

---

## 🧩 Core Concepts

-   **Kanban Tasks**: small, clear, 1–2 day items with owner, priority, labels, due date; dragged between `TODO/DOING/DONE`.
-   **Realtime**: server mutation → broadcast invalidation on channel `tasks:<projectId>` → clients refetch via TanStack Query.
-   **Search**: Postgres FTS via tsvector columns and GIN indexes for `Task` and `Message`.

---

## 🧪 NPM Scripts

```json
{
	"dev": "next dev",
	"build": "next build",
	"start": "next start",
	"lint": "next lint --max-warnings=0",
	"typecheck": "tsc --noEmit",
	"prisma:generate": "prisma generate",
	"prisma:migrate": "prisma migrate dev",
	"format": "prettier --check .",
	"format:write": "prettier --write ."
}
```

---

## 🔄 Git & GitHub Workflow (from the **beginning**)

Two long‑lived branches:

-   **`main`** — always deployable, protected
-   **`development`** — integration branch for ongoing work

### Initialize (first commit)

```bash
git init -b main
git add .
git commit -m "chore: bootstrap Next.js app (Tailwind, Prisma, NextAuth)"
git branch development

git remote add origin https://github.com/<you-or-org>/collabboard.git
git push -u origin main
git push -u origin development
```

### Daily loop

```bash
# Update integration branch
git switch development && git pull --ff-only
# Create focused feature branch
git switch -c feat/tasks-kanban
# Work → commit small, clear changes
git add -p && git commit -m "feat(tasks): render todo/doing/done columns"
# Push & open PR (base=development)
git push -u origin feat/tasks-kanban
```

After merging into `development`, open a **promotion PR** to `main` for release.

**Conventional Commits**: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `ci`, `build`, `perf`, `revert`.

### Branch protection (recommended)

In GitHub → Settings → Branches → Rules for `main` (and optionally `development`):

-   Require pull request + 1+ approval
-   Require status checks to pass (CI)
-   Dismiss stale approvals, require conversation resolution
-   Block force pushes; auto-delete head branches

---

## 🤖 CI (GitHub Actions)

Create `.github/workflows/ci.yml`:

```yml
name: CI

on:
  push:        { branches: [main, development] }
  pull_request:{ branches: [main, development] }

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  build-and-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm exec prisma generate
      - run: pnpm run lint
      - run: pnpm run typecheck
      - run: pnpm run build
```

> Add tests later (Vitest/Playwright) and require them in branch rules.

---

## ☁️ Deployment (Vercel + Supabase)

1. Push repository to GitHub.
2. Import into **Vercel**; select **Framework: Next.js**.
3. Add all **Environment Variables** from `.env.local` in Vercel Project Settings.
4. Set `NEXTAUTH_URL=https://your-domain.vercel.app`.
5. On first deploy, run migrations (one‑off):

    - Locally: `pnpm exec prisma migrate deploy`
    - Or add a temporary admin route you hit once after deploy (then remove).

Supabase tips:

-   Use the **connection pooling** connection string with PgBouncer for serverless.
-   Keep `SUPABASE_SERVICE_ROLE` on the **server only**.

---

## 🧭 Roadmap (selected)

-   AI task assistant (summaries, suggestions)
-   PWA & offline support (background sync)
-   Stripe billing (plans, metered storage)
-   i18n (multi‑language UI)
-   More analytics (lead/lag, cycle time)

---

## 🤝 Contributing

1. Create an issue or pick one from the board.
2. Branch from `development` → `feat/<scope>-<desc>`.
3. Follow Conventional Commits; open small PRs.
4. CI must pass; add screenshots for UI.

---

## 📝 License

CU © <AongCho880>

---

## 📬 Maintainers

-   Aong Cho — @AongCho880

> Questions? Suggestions? Open an issue — PRs welcome!
