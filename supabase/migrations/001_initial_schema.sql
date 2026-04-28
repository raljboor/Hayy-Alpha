-- =============================================================================
-- Hayy – Initial Schema
-- Migration: 001_initial_schema.sql
--
-- Run this first in the Supabase SQL editor before 002_rls_policies.sql.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Utility: updated_at auto-stamp trigger
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- 1. user_profiles
--    One row per auth user. Created automatically via trigger (see below).
-- ---------------------------------------------------------------------------

create table if not exists public.user_profiles (
  id              uuid        primary key references auth.users(id) on delete cascade,
  full_name       text,
  avatar_url      text,
  headline        text,
  location        text,
  pronouns        text,
  bio             text,
  target_roles    text[]      not null default '{}',
  skills          text[]      not null default '{}',
  linkedin_url    text,
  resume_url      text,
  video_intro_url text,
  role_type       text        not null default 'job_seeker'
                              check (role_type in ('job_seeker', 'referral_host', 'recruiter', 'admin')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger trg_user_profiles_updated_at
  before update on public.user_profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 2. rooms
-- ---------------------------------------------------------------------------

create table if not exists public.rooms (
  id             uuid        primary key default gen_random_uuid(),
  title          text        not null,
  description    text,
  category       text,
  host_id        uuid        references public.user_profiles(id) on delete set null,
  start_time     timestamptz,
  status         text        not null default 'open'
                             check (status in ('draft', 'open', 'waitlist', 'closed', 'completed')),
  room_type      text,
  max_speakers   int         not null default 8,
  attendee_count int         not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create trigger trg_rooms_updated_at
  before update on public.rooms
  for each row execute function public.set_updated_at();

create index if not exists idx_rooms_host_id    on public.rooms(host_id);
create index if not exists idx_rooms_status      on public.rooms(status);
create index if not exists idx_rooms_category    on public.rooms(category);
create index if not exists idx_rooms_start_time  on public.rooms(start_time);

-- ---------------------------------------------------------------------------
-- 3. room_participants
-- ---------------------------------------------------------------------------

create table if not exists public.room_participants (
  id                uuid        primary key default gen_random_uuid(),
  room_id           uuid        not null references public.rooms(id) on delete cascade,
  user_id           uuid        not null references public.user_profiles(id) on delete cascade,
  participant_role  text        not null default 'listener'
                                check (participant_role in ('host', 'speaker', 'listener', 'spectator', 'moderator')),
  attendance_status text        not null default 'registered'
                                check (attendance_status in ('registered', 'waitlisted', 'attended', 'no_show')),
  joined_at         timestamptz,
  created_at        timestamptz not null default now(),
  unique (room_id, user_id)
);

create index if not exists idx_room_participants_room_id on public.room_participants(room_id);
create index if not exists idx_room_participants_user_id on public.room_participants(user_id);

-- ---------------------------------------------------------------------------
-- 4. referral_requests
-- ---------------------------------------------------------------------------

create table if not exists public.referral_requests (
  id              uuid        primary key default gen_random_uuid(),
  requester_id    uuid        not null references public.user_profiles(id) on delete cascade,
  host_id         uuid        not null references public.user_profiles(id) on delete cascade,
  target_company  text,
  target_role     text,
  request_type    text        not null
                              check (request_type in (
                                'coffee_chat', 'referral', 'resume_feedback',
                                'interview_prep', 'company_insight'
                              )),
  status          text        not null default 'pending'
                              check (status in ('pending', 'accepted', 'declined', 'completed', 'waitlisted')),
  message         text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger trg_referral_requests_updated_at
  before update on public.referral_requests
  for each row execute function public.set_updated_at();

create index if not exists idx_referral_requests_requester_id on public.referral_requests(requester_id);
create index if not exists idx_referral_requests_host_id      on public.referral_requests(host_id);
create index if not exists idx_referral_requests_status       on public.referral_requests(status);

-- ---------------------------------------------------------------------------
-- 5. referral_messages
-- ---------------------------------------------------------------------------

create table if not exists public.referral_messages (
  id                   uuid        primary key default gen_random_uuid(),
  referral_request_id  uuid        not null references public.referral_requests(id) on delete cascade,
  sender_id            uuid        not null references public.user_profiles(id) on delete cascade,
  body                 text        not null,
  attachment_url       text,
  read_at              timestamptz,
  created_at           timestamptz not null default now()
);

create index if not exists idx_referral_messages_referral_request_id on public.referral_messages(referral_request_id);
create index if not exists idx_referral_messages_sender_id            on public.referral_messages(sender_id);

-- ---------------------------------------------------------------------------
-- 6. notifications
-- ---------------------------------------------------------------------------

create table if not exists public.notifications (
  id                  uuid        primary key default gen_random_uuid(),
  user_id             uuid        not null references public.user_profiles(id) on delete cascade,
  type                text,
  title               text        not null,
  body                text,
  related_entity_type text,
  related_entity_id   uuid,
  read_at             timestamptz,
  created_at          timestamptz not null default now()
);

create index if not exists idx_notifications_user_id         on public.notifications(user_id);
create index if not exists idx_notifications_user_id_read_at on public.notifications(user_id, read_at);

-- ---------------------------------------------------------------------------
-- 7. host_settings
-- ---------------------------------------------------------------------------

create table if not exists public.host_settings (
  id                      uuid        primary key default gen_random_uuid(),
  user_id                 uuid        not null references public.user_profiles(id) on delete cascade unique,
  open_to_coffee_chats    boolean     not null default true,
  open_to_referrals       boolean     not null default true,
  open_to_resume_feedback boolean     not null default true,
  monthly_capacity        int         not null default 3,
  roles_supported         text[]      not null default '{}',
  industries_supported    text[]      not null default '{}',
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create trigger trg_host_settings_updated_at
  before update on public.host_settings
  for each row execute function public.set_updated_at();

create index if not exists idx_host_settings_user_id on public.host_settings(user_id);

-- ---------------------------------------------------------------------------
-- 8. recruiter_candidates
-- ---------------------------------------------------------------------------

create table if not exists public.recruiter_candidates (
  id                   uuid        primary key default gen_random_uuid(),
  recruiter_id         uuid        not null references public.user_profiles(id) on delete cascade,
  candidate_id         uuid        not null references public.user_profiles(id) on delete cascade,
  referral_request_id  uuid        references public.referral_requests(id) on delete set null,
  status               text        not null default 'referred'
                                   check (status in ('referred', 'applied', 'shortlisted', 'interviewed', 'archived')),
  fit_score            text,
  notes                text,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create trigger trg_recruiter_candidates_updated_at
  before update on public.recruiter_candidates
  for each row execute function public.set_updated_at();

create index if not exists idx_recruiter_candidates_recruiter_id on public.recruiter_candidates(recruiter_id);
create index if not exists idx_recruiter_candidates_candidate_id on public.recruiter_candidates(candidate_id);

-- ---------------------------------------------------------------------------
-- Auto-create user_profiles row on auth.users insert
--
-- Supabase calls this trigger whenever a new user signs up via email/OAuth.
-- It reads full_name and role_type from the signup metadata so the profile
-- is pre-populated before the user reaches the onboarding screen.
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  _role_type text;
  _valid_roles text[] := array['job_seeker', 'referral_host', 'recruiter', 'admin'];
begin
  -- Only accept role_type values that exist in the check constraint.
  _role_type := coalesce(
    new.raw_user_meta_data->>'role_type',
    'job_seeker'
  );
  if _role_type != all(_valid_roles) then
    _role_type := 'job_seeker';
  end if;

  insert into public.user_profiles (id, full_name, role_type)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    _role_type
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Drop first so this file is idempotent on re-run.
drop trigger if exists trg_on_auth_user_created on auth.users;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();
