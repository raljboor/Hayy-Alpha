# Hayy

> *"Careers grow in conversation."*

Hayy is a live career community where job-seekers meet the people **inside** the companies they care about — not their inboxes. You drop into a room, get warm, and ask for the referral.

---

## What it is

- **Live audio rooms** grouped by company, role, or community (product, design, tech, MENA, newcomers to Canada, …)
- **Referral-first networking** — every room leads to a warm intro or coffee chat request
- **Two surfaces, one backend:** a responsive web app (this repo) and a mobile app (iOS-first), both backed by the same Supabase project

Core loop: **Discover a room → Reserve → Live Room → Recap → Request intro → Book a 1:1**

---

## Tech stack

| Layer | What |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + CSS custom properties (design tokens in `src/index.css`) |
| UI primitives | Radix UI / shadcn-ui components + custom `primitives.tsx` |
| State / data | TanStack Query v5 |
| Auth + DB | Supabase (Postgres + Row Level Security + Auth) |
| Live audio | LiveKit (token endpoint at `api/livekit-token.ts`) |
| Deployment | Vercel (serverless functions for `api/`) |

---

## Project structure

```
src/
  pages/          route-level pages (Index, Login, Signup, Onboarding, app/*)
  components/
    hayy/         product UI (Hero, LiveRoomCard, RoomCard, ReferralRequestCard, …)
    ui/           design-system primitives (primitives.tsx + shadcn components)
  lib/
    api/          data layer — mock mode + Supabase (rooms, referrals, profiles, …)
    adapters/     DB → UI shape transforms
    mockData.ts   fixture data (canonical cast: Adam Saleh, Maya Nasrallah, …)
    inboxData.ts  referral threads + notifications
  context/        AuthContext
  hooks/          useCurrentUser, use-mobile, use-toast
  types/          models.ts
supabase/
  migrations/     001–007 SQL (schema, RLS, profile fields, room types, onboarding)
  seed.sql        optional dev seed data (fill UUIDs first)
  README.md       Supabase setup guide
  GO_LIVE_CHECKLIST.md
api/
  livekit-token.ts  Vercel serverless — issues signed LiveKit JWTs
  delete-account.ts Vercel serverless — hard-deletes auth.users (service role)
```

---

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Fill in VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY (and LiveKit vars if using audio)
```

Without Supabase keys the app runs in **mock mode** — all pages render with fixture data. Set the keys to connect to a real Supabase project.

### 3. Run the dev server

```bash
npm run dev        # http://localhost:8080
```

### 4. Run tests

```bash
npm test
npm run test:watch
```

---

## Backend setup

See [`supabase/README.md`](supabase/README.md) for the full Supabase provisioning guide (schema migrations, RLS policies, storage buckets, env vars).

See [`supabase/GO_LIVE_CHECKLIST.md`](supabase/GO_LIVE_CHECKLIST.md) for the production go-live checklist including domain configuration for **hayy.ca**.

---

## Design system

Design tokens (colors, typography, spacing, radii) live in `src/index.css` as CSS custom properties. Two colorways: **Dawn** (light, default) and **Dusk** (dark — used for Live Room, Green Room, and 1:1 Call). Apply by setting `data-palette="dawn"` or `data-palette="dusk"` on a root element.

Reference designs are in `frontend-new/hayy/project/` — the `Hayy Prototype.html` is the canonical screen catalogue.

---

## Canonical data

The canonical logged-in user is **Adam Saleh** (aspiring PM, Toronto). The canonical host is **Maya Nasrallah** (Sr PM · AWS). Community stats: **412 members · 38 companies · 61 warm intros**. See `src/lib/mockData.ts` and `src/lib/inboxData.ts` for the full fixture cast.

---

## Domain

Production domain: **[hayy.ca](https://hayy.ca)**

Supabase allowed origins, OAuth redirect URIs, and email sender config must be updated in the Supabase dashboard for production. See the go-live checklist for the full list.
