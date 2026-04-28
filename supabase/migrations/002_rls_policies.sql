-- =============================================================================
-- Hayy – Row Level Security Policies
-- Migration: 002_rls_policies.sql
--
-- Run AFTER 001_initial_schema.sql.
-- This file is idempotent: policies are dropped before being recreated.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Helper: a shorthand for the current authenticated user's UUID.
-- All policies use auth.uid() — never a hardcoded ID.
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- 1. user_profiles
-- ---------------------------------------------------------------------------

alter table public.user_profiles enable row level security;

drop policy if exists "user_profiles: authenticated users can read"    on public.user_profiles;
drop policy if exists "user_profiles: owner can update"                 on public.user_profiles;
drop policy if exists "user_profiles: owner can insert"                 on public.user_profiles;

-- Any authenticated user can read any profile (public directory model).
create policy "user_profiles: authenticated users can read"
  on public.user_profiles
  for select
  to authenticated
  using (true);

-- Users can only update their own profile row.
create policy "user_profiles: owner can update"
  on public.user_profiles
  for update
  to authenticated
  using  (id = auth.uid())
  with check (id = auth.uid());

-- Allows the handle_new_auth_user trigger (security definer) to insert.
-- Also lets a user insert their own row if the trigger ever missed.
create policy "user_profiles: owner can insert"
  on public.user_profiles
  for insert
  to authenticated
  with check (id = auth.uid());

-- ---------------------------------------------------------------------------
-- 2. rooms
-- ---------------------------------------------------------------------------

alter table public.rooms enable row level security;

drop policy if exists "rooms: authenticated users can read"   on public.rooms;
drop policy if exists "rooms: host can create"                on public.rooms;
drop policy if exists "rooms: host can update"                on public.rooms;
drop policy if exists "rooms: host can delete"                on public.rooms;

create policy "rooms: authenticated users can read"
  on public.rooms
  for select
  to authenticated
  using (true);

create policy "rooms: host can create"
  on public.rooms
  for insert
  to authenticated
  with check (host_id = auth.uid());

create policy "rooms: host can update"
  on public.rooms
  for update
  to authenticated
  using  (host_id = auth.uid())
  with check (host_id = auth.uid());

create policy "rooms: host can delete"
  on public.rooms
  for delete
  to authenticated
  using (host_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 3. room_participants
-- ---------------------------------------------------------------------------

alter table public.room_participants enable row level security;

drop policy if exists "room_participants: authenticated users can read"  on public.room_participants;
drop policy if exists "room_participants: user can join"                 on public.room_participants;
drop policy if exists "room_participants: user can update own row"       on public.room_participants;
drop policy if exists "room_participants: user can leave"                on public.room_participants;

create policy "room_participants: authenticated users can read"
  on public.room_participants
  for select
  to authenticated
  using (true);

create policy "room_participants: user can join"
  on public.room_participants
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "room_participants: user can update own row"
  on public.room_participants
  for update
  to authenticated
  using  (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "room_participants: user can leave"
  on public.room_participants
  for delete
  to authenticated
  using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 4. referral_requests
-- ---------------------------------------------------------------------------

alter table public.referral_requests enable row level security;

drop policy if exists "referral_requests: requester or host can read"             on public.referral_requests;
drop policy if exists "referral_requests: requester can create"                   on public.referral_requests;
drop policy if exists "referral_requests: host can update status"                 on public.referral_requests;
drop policy if exists "referral_requests: requester can update pending request"   on public.referral_requests;

-- Only the requester and the targeted host can see a referral request.
create policy "referral_requests: requester or host can read"
  on public.referral_requests
  for select
  to authenticated
  using (
    requester_id = auth.uid()
    or host_id   = auth.uid()
  );

create policy "referral_requests: requester can create"
  on public.referral_requests
  for insert
  to authenticated
  with check (requester_id = auth.uid());

-- Host can accept, decline, waitlist, or complete a request.
create policy "referral_requests: host can update status"
  on public.referral_requests
  for update
  to authenticated
  using  (host_id = auth.uid())
  with check (host_id = auth.uid());

-- Requester can edit their own message/details while status is still pending.
create policy "referral_requests: requester can update pending request"
  on public.referral_requests
  for update
  to authenticated
  using  (requester_id = auth.uid() and status = 'pending')
  with check (requester_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 5. referral_messages
-- ---------------------------------------------------------------------------

alter table public.referral_messages enable row level security;

drop policy if exists "referral_messages: participants can read"   on public.referral_messages;
drop policy if exists "referral_messages: participants can send"   on public.referral_messages;
drop policy if exists "referral_messages: sender can mark read"    on public.referral_messages;

-- A message is readable if the current user is the requester or host of the
-- parent referral_request.
create policy "referral_messages: participants can read"
  on public.referral_messages
  for select
  to authenticated
  using (
    exists (
      select 1
      from   public.referral_requests rr
      where  rr.id           = referral_messages.referral_request_id
        and  (rr.requester_id = auth.uid() or rr.host_id = auth.uid())
    )
  );

create policy "referral_messages: participants can send"
  on public.referral_messages
  for insert
  to authenticated
  with check (
    sender_id = auth.uid()
    and exists (
      select 1
      from   public.referral_requests rr
      where  rr.id           = referral_messages.referral_request_id
        and  (rr.requester_id = auth.uid() or rr.host_id = auth.uid())
    )
  );

-- Only the sender can update their own message (e.g. set read_at).
create policy "referral_messages: sender can mark read"
  on public.referral_messages
  for update
  to authenticated
  using  (sender_id = auth.uid())
  with check (sender_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 6. notifications
-- ---------------------------------------------------------------------------

alter table public.notifications enable row level security;

drop policy if exists "notifications: user can read own"    on public.notifications;
drop policy if exists "notifications: user can update own"  on public.notifications;
drop policy if exists "notifications: user can delete own"  on public.notifications;

create policy "notifications: user can read own"
  on public.notifications
  for select
  to authenticated
  using (user_id = auth.uid());

-- Allows marking notifications as read (read_at update).
create policy "notifications: user can update own"
  on public.notifications
  for update
  to authenticated
  using  (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "notifications: user can delete own"
  on public.notifications
  for delete
  to authenticated
  using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 7. host_settings
-- ---------------------------------------------------------------------------

alter table public.host_settings enable row level security;

drop policy if exists "host_settings: authenticated users can read"  on public.host_settings;
drop policy if exists "host_settings: owner can insert"              on public.host_settings;
drop policy if exists "host_settings: owner can update"              on public.host_settings;
drop policy if exists "host_settings: owner can delete"              on public.host_settings;

-- Any authenticated user can see a host's settings (needed to render
-- "Open to referrals" badges on profiles and room cards).
create policy "host_settings: authenticated users can read"
  on public.host_settings
  for select
  to authenticated
  using (true);

create policy "host_settings: owner can insert"
  on public.host_settings
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "host_settings: owner can update"
  on public.host_settings
  for update
  to authenticated
  using  (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "host_settings: owner can delete"
  on public.host_settings
  for delete
  to authenticated
  using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 8. recruiter_candidates
-- ---------------------------------------------------------------------------

alter table public.recruiter_candidates enable row level security;

drop policy if exists "recruiter_candidates: recruiter can read own rows"       on public.recruiter_candidates;
drop policy if exists "recruiter_candidates: recruiter can insert"               on public.recruiter_candidates;
drop policy if exists "recruiter_candidates: recruiter can update own rows"      on public.recruiter_candidates;
drop policy if exists "recruiter_candidates: recruiter can delete own rows"      on public.recruiter_candidates;
drop policy if exists "recruiter_candidates: candidate can read own rows"        on public.recruiter_candidates;

create policy "recruiter_candidates: recruiter can read own rows"
  on public.recruiter_candidates
  for select
  to authenticated
  using (recruiter_id = auth.uid());

create policy "recruiter_candidates: recruiter can insert"
  on public.recruiter_candidates
  for insert
  to authenticated
  with check (recruiter_id = auth.uid());

create policy "recruiter_candidates: recruiter can update own rows"
  on public.recruiter_candidates
  for update
  to authenticated
  using  (recruiter_id = auth.uid())
  with check (recruiter_id = auth.uid());

create policy "recruiter_candidates: recruiter can delete own rows"
  on public.recruiter_candidates
  for delete
  to authenticated
  using (recruiter_id = auth.uid());

-- Candidates can see when they appear in a recruiter's pipeline.
create policy "recruiter_candidates: candidate can read own rows"
  on public.recruiter_candidates
  for select
  to authenticated
  using (candidate_id = auth.uid());
