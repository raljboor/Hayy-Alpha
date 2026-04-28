# Hayy – Go-Live Checklist

Follow these steps in order before putting Hayy in front of real users.

---

## 1. Create a Supabase project

- Go to [https://supabase.com](https://supabase.com) and create a new project.
- Choose a strong database password and save it somewhere safe.
- Wait for the project to finish provisioning (~1 minute).

---

## 2. Run the schema migration

In the Supabase dashboard: **SQL Editor → New query**

Paste the full contents of:

```
supabase/migrations/001_initial_schema.sql
```

Click **Run**. Confirm all tables were created (no red errors).

This creates:
- `user_profiles`, `rooms`, `room_participants`
- `referral_requests`, `referral_messages`
- `notifications`, `host_settings`, `recruiter_candidates`
- `set_updated_at()` trigger function + triggers
- `handle_new_auth_user()` trigger on `auth.users` (auto-creates profile on signup)
- Indexes on all foreign keys and commonly-filtered columns

---

## 3. Run the RLS policies

In the SQL Editor, paste and run:

```
supabase/migrations/002_rls_policies.sql
```

This enables Row Level Security on all 8 tables and creates 24+ named policies.

**Verify RLS is enabled**: In the Supabase dashboard go to **Table Editor**, click each table, and confirm the RLS badge shows "Enabled".

---

## 4. Create Storage buckets

Go to **Storage → New bucket** and create these three buckets:

| Bucket name | Access | Purpose | Allowed MIME | Max size |
|---|---|---|---|---|
| `resumes` | Private | User resume uploads | application/pdf, .doc, .docx | 10 MB |
| `video-intros` | Private | User video intro uploads | video/* | 100 MB |
| `avatars` | Private | Profile picture uploads | image/png, image/jpeg, image/webp | 5 MB |

After creating the buckets, run migration `003_add_profile_picture_and_referral_goals.sql` in the SQL Editor. This adds:
- The `referral_goals text` column to `user_profiles`
- RLS policies for the `avatars` storage bucket

> **Note:** Buckets are private. The app uses `getPublicUrl()` today. For fully private access switch to `createSignedUrl()` in a follow-up.

---

## 5. Set up local environment

Create a `.env` file in the project root (it is git-ignored):

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Find these values in: **Supabase dashboard → Settings → API**

- **NEVER** use the `service_role` key in the frontend. Only the `anon` (public) key belongs in `.env`.
- **NEVER** commit `.env` to version control.

---

## 6. Test locally

```bash
npm run dev
```

Smoke test each feature:

- [ ] Sign up with a new email
- [ ] Check email for confirmation link → click it → lands on `/auth/confirm` → redirected to `/app/dashboard`
- [ ] Complete onboarding (all fields save to `user_profiles`)
- [ ] Edit profile → name/bio/skills save
- [ ] Upload a resume → appears in Storage → `resume_url` saved to profile
- [ ] Browse rooms list → rooms load from DB
- [ ] Join a room → row appears in `room_participants`
- [ ] Open a room detail → participant status shows "registered"
- [ ] Send a referral request → row appears in `referral_requests`
- [ ] Open referral thread → send a message → message appears in `referral_messages`
- [ ] Check other user's notifications → notification row appears in `notifications`
- [ ] On HostDashboard: accept a referral → status updates; requester gets notification
- [ ] Mark all notifications read → `read_at` timestamps set
- [ ] Log out → redirected to `/login`

---

## 7. Verify RLS in isolation

Test that data is properly isolated between users:

1. Sign up as User A. Create a referral request to User B.
2. Sign in as User C (a third account).
3. Query `referral_requests` via the Supabase API with User C's session.
4. Confirm User C cannot see User A's referral requests.
5. Repeat for `referral_messages` and `notifications`.

> Use the Supabase dashboard **Table Editor** or the API Explorer to run queries with different auth tokens.

---

## 8. Add Vercel environment variables

In your Vercel project: **Settings → Environment Variables**

| Variable | Value |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |

Set them for **Production**, **Preview**, and **Development** environments.

---

## 9. Redeploy on Vercel

```bash
git push origin main
```

Or trigger a manual redeploy in the Vercel dashboard.

---

## 10. Test production

Repeat the smoke tests from Step 6 against the production URL.

Specifically check:
- [ ] Email confirmation redirect lands on the correct production domain (not localhost)
- [ ] File uploads succeed (bucket names are correct)
- [ ] Auth tokens are scoped to the correct Supabase project

---

## Security reminders

- **NEVER** expose the `service_role` key. It bypasses all RLS and has full DB access.
- **NEVER** commit `.env` — it is in `.gitignore`.
- The `anon` key is safe to use in the frontend (it is designed for public client-side use and is scoped by RLS).
- Rotate the anon key in Supabase settings if it is ever exposed accidentally.

---

## Known limitations at launch (post-launch backlog)

| Item | Priority | Phase |
|---|---|---|
| Supabase Realtime presence for LiveRoom participant grid | High | Realtime |
| `RoomCard` host avatar uses mock `getUser()` — needs profile lookup | Medium | Phase 7 follow-up |
| Room agenda/hosts/rules still inline constants in `RoomDetail` | Low | Data model |
| Storage buckets use `getPublicUrl()` — switch to `createSignedUrl()` for true privacy | Medium | Phase 5 follow-up |
| Generate `database.types.ts` via `supabase gen types typescript` for full type safety | High | Phase 9 follow-up |
| Notification INSERT currently allows any authenticated user to notify any other user — move to Edge Function for stricter control | Medium | Phase 10 |

---

## Generating TypeScript types from your schema (recommended)

After running the migrations, generate a typed DB client:

```bash
npx supabase gen types typescript \
  --project-id your-project-ref \
  --schema public \
  > src/types/database.types.ts
```

Then update `supabaseClient.ts`:

```typescript
import type { Database } from "@/types/database.types";
export const supabase = createClient<Database>(url, key);
```

This gives you full compile-time type checking for all DB queries.
