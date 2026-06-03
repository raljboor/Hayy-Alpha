# Hayy — Website

> *"Careers grow in conversation."*

Hayy is a live career community where job-seekers meet the people **inside** the companies they care about — not their inboxes. You drop into a room, get warm, and ask for the referral.

---

## Architecture

Hayy has two separate frontends backed by a single Supabase project:

| Surface | Repo | Domain |
|---|---|---|
| **Website** (this repo) | `raljboor/Hayy-Alpha` | [hayy.ca](https://hayy.ca) |
| **Native app** | `raljboor/hayy-app` *(coming)* | iOS / Android via Expo |

This repo is **the website only** — the marketing pages, login/signup, onboarding, and the web dashboard for logged-in users. It is a Vite + React SPA deployed to Vercel.

The native app is a separate Expo/React Native project. It will consume the same Supabase project, the same RLS policies, and the same `/api/livekit-token` and `/api/delete-account` Vercel endpoints already in this repo. No backend changes are needed to support it.

The design reference for the native app screens lives in `frontend-new/hayy/app-reference/screens-ts/` — 44 TypeScript React components translated from the original handoff JSX.

---

## What this repo contains

- **Marketing / landing** — `src/pages/Index.tsx`
- **Auth** — `src/pages/Login.tsx`, `Signup.tsx`, `AuthConfirm.tsx`, `Onboarding.tsx`
- **Web dashboard** — `src/pages/dashboard/` *(to be built)*
- **API layer** — `src/lib/api/*` — Supabase queries consumed by both the website and indirectly by the native app via REST
- **Serverless functions** — `api/livekit-token.ts`, `api/delete-account.ts` (Vercel)
- **Design reference** — `frontend-new/hayy/` — original JSX handoff files + TS screen archive

---

## Tech stack

| Layer | What |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + CSS custom properties (design tokens in `src/index.css`) |
| UI primitives | Radix UI / shadcn-ui + custom `src/components/ui/primitives.tsx` |
| State / data | TanStack Query v5 |
| Auth + DB | Supabase (Postgres + Row Level Security + Auth) |
| Live audio | LiveKit (token endpoint at `api/livekit-token.ts`) |
| Deployment | Vercel — SPA + serverless functions |

---

## Project structure

```
src/
  pages/
    Index.tsx         landing page (hayy.ca)
    Login.tsx         sign in
    Signup.tsx        create account
    Onboarding.tsx    post-signup profile setup
    AuthConfirm.tsx   OTP / magic link confirmation
  components/
    hayy/             product UI (Hero, LiveRoomCard, RoomCard, …)
    ui/               design-system primitives (primitives.tsx + shadcn components)
  lib/
    api/              data layer — mock mode + Supabase (rooms, referrals, profiles, …)
    adapters/         DB → UI shape transforms
    mockData.ts       fixture data (canonical cast: Adam Saleh, Maya Nasrallah, …)
    inboxData.ts      referral threads + notifications
  context/            AuthContext
  hooks/              useCurrentUser, use-mobile, use-toast
  types/              models.ts
supabase/
  migrations/         001–007 SQL (schema, RLS, profile fields, room types, onboarding)
  seed.sql            optional dev seed data (fill UUIDs first)
  README.md           Supabase setup guide
  GO_LIVE_CHECKLIST.md
api/
  livekit-token.ts    Vercel serverless — issues signed LiveKit JWTs (used by native app too)
  delete-account.ts   Vercel serverless — hard-deletes auth.users (service role)
frontend-new/hayy/
  project/            original handoff JSX (design canvas, hero, primitives, …)
  app-reference/
    components/       original app-screen JSX files (9 files, design reference)
    screens-ts/       TypeScript React translation of all 44 native app screens
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

Reference designs are in `frontend-new/hayy/project/` — the `Hayy Redesign.html` is the canonical screen catalogue.

---

## Canonical data

The canonical logged-in user is **Adam Saleh** (aspiring PM, Toronto). The canonical host is **Maya Nasrallah** (Sr PM · AWS). Community stats: **412 members · 38 companies · 61 warm intros**. See `src/lib/mockData.ts` and `src/lib/inboxData.ts` for the full fixture cast.

---

## Domain

Production domain: **[hayy.ca](https://hayy.ca)**

Supabase allowed origins, OAuth redirect URIs, and email sender config must be updated in the Supabase dashboard for production. See the go-live checklist for the full list.
