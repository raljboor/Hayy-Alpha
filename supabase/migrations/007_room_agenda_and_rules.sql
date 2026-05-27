-- =============================================================================
-- Hayy – Room agenda + rules, and host participant backfill
-- Migration: 007_room_agenda_and_rules.sql
--
-- Supersedes the hardcoded agenda / rules content in RoomDetail and lets the
-- Hosts section load from room_participants where participant_role = 'host'.
--
-- Run AFTER 006. This file is idempotent: tables use IF NOT EXISTS and
-- policies are dropped before being recreated.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. room_agenda — ordered agenda items for a room
-- ---------------------------------------------------------------------------

create table if not exists public.room_agenda (
  id          uuid        primary key default gen_random_uuid(),
  room_id     uuid        not null references public.rooms(id) on delete cascade,
  position    int         not null default 0,
  time_label  text,
  title       text        not null,
  description text,
  created_at  timestamptz not null default now()
);

create index if not exists idx_room_agenda_room_id on public.room_agenda(room_id);

-- ---------------------------------------------------------------------------
-- 2. room_rules — ordered room rules
-- ---------------------------------------------------------------------------

create table if not exists public.room_rules (
  id          uuid        primary key default gen_random_uuid(),
  room_id     uuid        not null references public.rooms(id) on delete cascade,
  position    int         not null default 0,
  title       text        not null,
  description text,
  created_at  timestamptz not null default now()
);

create index if not exists idx_room_rules_room_id on public.room_rules(room_id);

-- ---------------------------------------------------------------------------
-- 3. RLS — anyone authenticated can read; only the room owner can manage
-- ---------------------------------------------------------------------------

alter table public.room_agenda enable row level security;
alter table public.room_rules  enable row level security;

drop policy if exists "room_agenda: authenticated users can read" on public.room_agenda;
drop policy if exists "room_agenda: room host can manage"          on public.room_agenda;
drop policy if exists "room_rules: authenticated users can read"   on public.room_rules;
drop policy if exists "room_rules: room host can manage"           on public.room_rules;

create policy "room_agenda: authenticated users can read"
  on public.room_agenda
  for select
  to authenticated
  using (true);

create policy "room_agenda: room host can manage"
  on public.room_agenda
  for all
  to authenticated
  using (
    exists (
      select 1 from public.rooms r
      where r.id = room_agenda.room_id and r.host_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.rooms r
      where r.id = room_agenda.room_id and r.host_id = auth.uid()
    )
  );

create policy "room_rules: authenticated users can read"
  on public.room_rules
  for select
  to authenticated
  using (true);

create policy "room_rules: room host can manage"
  on public.room_rules
  for all
  to authenticated
  using (
    exists (
      select 1 from public.rooms r
      where r.id = room_rules.room_id and r.host_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.rooms r
      where r.id = room_rules.room_id and r.host_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- 4. Backfill host participant rows
--    The Hosts section loads from room_participants where role = 'host', so
--    every room's owner should have a host participant row. Promote any
--    existing participant row for the owner, or insert one.
-- ---------------------------------------------------------------------------

insert into public.room_participants (room_id, user_id, participant_role, attendance_status, joined_at)
select r.id, r.host_id, 'host', 'registered', now()
from public.rooms r
where r.host_id is not null
on conflict (room_id, user_id) do update
  set participant_role = 'host';
