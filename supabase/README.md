# Hayy – Supabase Setup Guide

This folder contains all SQL needed to provision the Hayy backend on Supabase.

---

## Prerequisites

- A [Supabase](https://supabase.com) project (free tier is fine for development)
- Your project's **URL** and **anon key** (from Project Settings → API)

---

## Step 1 – Run the schema migration

Open the **SQL Editor** in your Supabase dashboard and run the contents of:

```
supabase/migrations/001_initial_schema.sql
```

This creates:

| Table | Purpose |
|---|---|
| `user_profiles` | One row per auth user; auto-created by trigger on signup |
| `rooms` | Live and upcoming career rooms |
| `room_participants` | Who joined which room and in what role |
| `referral_requests` | Referral/coffee-chat requests between candidates and hosts |
| `referral_messages` | Message thread attached to each referral request |
| `notifications` | Per-user activity notifications |
| `host_settings` | Availability settings for referral hosts |
| `recruiter_candidates` | Pipeline of candidates tracked by recruiters |

It also creates:
- A `set_updated_at()` trigger function applied to all tables with an `updated_at` column
- A `handle_new_auth_user()` trigger on `auth.users` that auto-inserts a `user_profiles` row on every new signup, pre-populated with `full_name` and `role_type` from signup metadata
- Indexes on all foreign keys and frequently-filtered columns (`status`, `category`, `start_time`, `read_at`)

---

## Step 2 – Run the RLS policies

Run the contents of:

```
supabase/migrations/002_rls_policies.sql
```

This enables Row Level Security on every table and creates named policies. The file is idempotent — safe to run multiple times.

**Policy summary:**

| Table | Who can read | Who can write |
|---|---|---|
| `user_profiles` | Any authenticated user | Owner only |
| `rooms` | Any authenticated user | Host only (create/update/delete) |
| `room_participants` | Any authenticated user | Own row only |
| `referral_requests` | Requester and host only | Requester can create; host can update status; requester can edit while pending |
| `referral_messages` | Requester and host of parent request | Requester and host of parent request can send; sender can update own |
| `notifications` | Owner only | Owner only (update `read_at`, delete) |
| `host_settings` | Any authenticated user (for public badge display) | Owner only |
| `recruiter_candidates` | Recruiter (own rows) + Candidate (can see own entries) | Recruiter only |

---

## Step 3 – Seed development data (optional)

`supabase/seed.sql` contains commented-out example inserts for rooms, referral requests, and notifications.

To use it:

1. Create test accounts via **Authentication → Users** in the Supabase dashboard (or via `signUp()` in the browser).
2. Note each user's UUID.
3. Open `seed.sql`, replace the placeholder UUIDs at the top.
4. Uncomment the relevant blocks.
5. Run in the SQL Editor.

> The `handle_new_auth_user` trigger will automatically insert `user_profiles` rows when accounts are created — you only need to `UPDATE` those rows with richer profile data.

---

## Step 4 – Create Storage buckets

In the Supabase dashboard go to **Storage → New bucket** and create:

| Bucket name | Public | Purpose | Allowed MIME | Max size |
|---|---|---|---|---|
| `resumes` | No (private) | User resume uploads | application/pdf, .doc, .docx | 10 MB |
| `video-intros` | No (private) | User video intro uploads | video/* | 100 MB |
| `avatars` | No (private) | Profile picture uploads | image/png, image/jpeg, image/webp | 5 MB |

After creating the buckets, run migration `003_add_profile_picture_and_referral_goals.sql` to add storage RLS policies for the `avatars` bucket and the `referral_goals` column to `user_profiles`.

The frontend uses `getPublicUrl()` for bucket paths. For fully private buckets switch to `createSignedUrl()` in a later phase.

---

## Step 5 – Configure environment variables

### Local development

Create a `.env` file in the project root (this file is git-ignored):

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> **Never commit `.env` to version control.** The `.env.example` file shows the required variable names without values.

### Vercel (production)

In your Vercel project dashboard go to **Settings → Environment Variables** and add:

| Variable | Value |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon (public) key |

Redeploy after adding variables.

---

## How mock mode works

When `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are **not set**, the frontend automatically falls back to local fixture data in `src/lib/mockData.ts` and `src/lib/inboxData.ts`. All pages render correctly with no backend. This is the default for local development before Supabase is configured.

---

## Running order summary

```
1. 001_initial_schema.sql   — tables, triggers, indexes
2. 002_rls_policies.sql     — RLS enable + named policies
3. 003_add_profile_picture_and_referral_goals.sql — avatars bucket + referral_goals column
4. 004_add_recruiter_profile_fields.sql           — recruiter profile columns
5. seed.sql                 — optional dev data (uncomment + fill UUIDs first)
```

---

## Phase 10 — LiveKit live audio rooms

Live audio is powered by [LiveKit](https://livekit.io). No new Supabase migrations are required for Phase 10A — the existing `rooms` and `room_participants` tables are used as-is.

### Environment variables

Add the following to your `.env` file (see `.env.example`) and to your Vercel project settings:

| Variable | Where | Purpose |
|---|---|---|
| `VITE_LIVEKIT_URL` | Frontend + Vercel | `wss://` URL of your LiveKit Cloud project (safe to expose) |
| `SUPABASE_URL` | Vercel server-only | Mirrors `VITE_SUPABASE_URL` — used by the token endpoint |
| `SUPABASE_ANON_KEY` | Vercel server-only | Mirrors `VITE_SUPABASE_ANON_KEY` — used by the token endpoint |
| `LIVEKIT_API_KEY` | Vercel server-only | From LiveKit Cloud → Settings → Keys. **Never expose to browser.** |
| `LIVEKIT_API_SECRET` | Vercel server-only | From LiveKit Cloud → Settings → Keys. **Never expose to browser.** |

### Token endpoint: `POST /api/livekit-token`

Vercel serverless function at `api/livekit-token.ts`. Issues a signed LiveKit JWT to authenticated users who are registered for the room.

**Request:**
```json
POST /api/livekit-token
Authorization: Bearer <supabase_access_token>
Content-Type: application/json

{ "roomId": "<supabase_room_uuid>" }
```

**Success response (200):**
```json
{ "token": "<livekit_jwt>", "livekitUrl": "wss://..." }
```

**Error responses:**
| Code | Reason |
|---|---|
| 400 | Missing or empty `roomId` |
| 401 | Missing/invalid Authorization header or expired Supabase session |
| 403 | User is not registered for the room and is not the host |
| 500 | Server env vars not configured |

**Authorization logic:**
1. Verifies the Supabase JWT by calling `supabase.auth.getUser(token)` server-side
2. Queries `room_participants` — user must have `attendance_status = 'registered'`
3. OR queries `rooms.host_id` — user is the room host
4. Token identity = Supabase user UUID; name = `user_profiles.full_name` (falls back to email)
5. TTL: 2 hours; grants: `roomJoin`, `canPublish`, `canSubscribe`, `canPublishData`

### Frontend helper: `src/lib/api/livekit.ts`

```typescript
import { getLiveKitToken } from "@/lib/api/livekit";

const { token, livekitUrl } = await getLiveKitToken(roomId);
// Pass token + livekitUrl to LiveKit room.connect() in Phase 10B
```

Throws human-readable errors for 401, 403, missing env vars, and network failures. Short-circuits immediately in mock mode (no network call made).

---

## Upcoming phases

| Phase | What it adds |
|---|---|
| Phase 10A | LiveKit token endpoint (Vercel serverless) + frontend helper ✓ |
| Phase 10B | `useLiveKitRoom` hook; wire real audio into LiveRoom.tsx |
| Phase 10C | Supabase Realtime presence; raised-hand queue from data messages |
| Phase 11 | Generated TypeScript types (`supabase gen types typescript`); QA hardening |
