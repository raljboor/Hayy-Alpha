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
3. seed.sql                 — optional dev data (uncomment + fill UUIDs first)
```

---

## Upcoming phases

| Phase | What it adds |
|---|---|
| Phase 4 | Wire `useCurrentUser()` into pages (Profile, HostDashboard, Notifications, Settings) |
| Phase 5 | Onboarding → `updateProfile()`; file uploads to Storage buckets |
| Phase 6 | Referral thread Supabase query; Realtime subscriptions for messages |
| Phase 7 | Room join/leave with real participant counts; Realtime presence |
| Phase 8 | Recruiter pipeline from DB; HostDashboard full wiring |
| Phase 9 | Generated TypeScript types (`supabase gen types typescript`); QA; build hardening |
