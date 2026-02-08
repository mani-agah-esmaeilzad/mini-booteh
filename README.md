# Focus Test + ADHD Questionnaire

Production-ready mini app inspired by **hrbooteh** that blends an ADHD self-report questionnaire, an optional go/no-go focus test, and an AvalAI-generated narrative summary. The experience is a **screening only** and explicitly states that it is **not a diagnosis**.

## Highlights

- ✅ Public landing page with disclosures, consent, and anonymous sessions
- ✅ Multi-step assessment (Likert questionnaire + optional focus test with reaction metrics)
- ✅ Report dashboard (bar chart, risk gauge, focus distribution, markdown narrative, PDF + share link)
- ✅ AvalAI integration with configurable system + user prompts, retry logic, rate limiting, and audit logging
- ✅ Full admin portal (NextAuth credentials) for questionnaires, scoring rules, prompts, sessions, exports, focus settings, and audit logs
- ✅ Prisma + PostgreSQL schema ready for Neon/Vercel Postgres/Supabase
- ✅ Tailwind + shadcn/ui + Recharts + PDF export + Vitest unit tests

## Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Recharts, next-themes
- **Backend:** Prisma (PostgreSQL), NextAuth (credentials), server actions + route handlers, AvalAI (OpenAI-compatible)
- **Tooling:** Vitest, ESLint, Prettier (via Next), Framer Motion, @react-pdf/renderer

## Safety & Privacy

- Copy repeatedly reinforces: `screening`, `self-report`, `not a diagnosis`, `seek clinicians`.
- Consent is required before data collection.
- Minimal PII stored (anonymous by default, optional email if admin toggles).
- Admin actions are audited.
- AI narrative never exposes secrets and is rate-limited.

## Getting Started

### 1. Prerequisites

- Node.js 20+
- PostgreSQL database (local Docker, Neon, Supabase, Vercel Postgres, etc.)
- AvalAI gateway credentials (OpenAI-compatible)

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

Duplicate `.env.example` → `.env` and fill in:

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string (works with Vercel Postgres/Neon/Supabase). |
| `AUTH_SECRET` | Long random string for NextAuth JWTs. |
| `AVALAI_BASE_URL` | Base URL for AvalAI gateway (e.g. `https://your-gateway/v1`). |
| `AVALAI_API_KEY` | AvalAI API key. Never expose to the client. |
| `AVALAI_MODEL` | Model name (e.g. `gpt-4o-mini`). |
| `NEXT_PUBLIC_APP_URL` | Public origin for share links (e.g. `https://focus-app.vercel.app`). |
| `ADMIN_DEFAULT_EMAIL`, `ADMIN_DEFAULT_PASSWORD` | Seed admin credentials (can be rotated after seeding). |

### 4. Database migration & seed

```bash
npx prisma migrate dev
npm run db:seed
```

This creates:

- Admin user (`ADMIN_DEFAULT_EMAIL` / `ADMIN_DEFAULT_PASSWORD`)
- Default questionnaire + questions + scoring thresholds
- Prompt template version `default-report`
- App/focus settings

### 5. Local development

```bash
npm run dev
```

Visit `http://localhost:3000` for the public flow and `http://localhost:3000/admin/login` for the admin portal.

### 6. Tests & linting

```bash
npm run test     # Vitest suite (scoring units)
npm run lint     # Next.js + ESLint config
```

### 7. Production build

```bash
npm run build
```

Vercel deployment automatically runs `prisma generate` (included in `build` script). Ensure you configure the **Production** environment variables and connect a managed Postgres provider (Vercel Postgres or any external URL).

## Admin Portal Overview

- **Dashboard:** KPIs (sessions, completion rate, avg scores) + recent submissions
- **Questionnaires:** CRUD questionnaires, questions, scoring rules (JSON items + thresholds)
- **Prompts:** Create versions, activate, and dry-run previews against historical sessions
- **Sessions:** Search, export CSV, regenerate reports, open report links
- **Settings:** App toggles (email, share links, disclaimer, language), focus test parameters, audit log

## AvalAI Integration

- Located in `src/lib/ai/avalai.ts`
- Uses `fetch` to post to `/chat/completions` with retries + 20s timeout
- Prompt variables supported: `{{user_language}}`, `{{risk_band}}`, `{{subscales_json}}`, `{{focus_metrics_json}}`, `{{disclaimer_text}}`
- Outputs stored in `Report` + `AssessmentSession`

## PDF & Share Links

- `/api/reports/[sessionId]/pdf` streams a PDF generated via `@react-pdf/renderer`
- Public reports accessible via `/report/[tokenOrId]` (token comes from `shareToken` if enabled)

## CLI Reference

```bash
npm run dev          # Start local dev server
npm run build        # Prisma generate + Next production build
npm run start        # Start production server
npm run db:migrate   # Run Prisma migrations
npm run db:seed      # Seed default admin + questionnaire + prompts
npm run test         # Vitest unit tests
```

## Deployment Notes

- **Vercel:** add `DATABASE_URL`, `AUTH_SECRET`, AvalAI vars, `NEXT_PUBLIC_APP_URL`. Use `vercel env pull` for local syncing.
- **Prisma schema** is serverless-friendly; connection pooling recommended (Neon/Vercel Postgres).
- **AI calls** only happen server-side; ensure AvalAI endpoint is reachable from Vercel region.

## Disclaimer

This project is a **screening tool**. It is **not** a medical device or diagnostic service. Always encourage users to consult licensed clinicians for evaluations, crisis care, and treatment plans.
