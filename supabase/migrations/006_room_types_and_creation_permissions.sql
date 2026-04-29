-- =============================================================================
-- Hayy – Room types and universal hosting permissions
-- Migration: 006_room_types_and_creation_permissions.sql
--
-- Product model:
--   room_type = 'community' : any authenticated user can create
--   room_type = 'referral'  : any authenticated user can create
--   room_type = 'hiring'    : only users with role_type = 'recruiter' can create
--
-- host_id is kept as-is (owner). created_by mirrors host_id on creation and
-- survives host deletion (on delete set null on host_id, set null on created_by).
--
-- Run AFTER 005 (or after 004 if 005 does not exist in your deployment).
-- This file is idempotent: constraints and policies are dropped before recreating.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Backfill room_type for existing rows that have NULL or a legacy value
--    ('qa' was used temporarily in the frontend before this migration).
-- ---------------------------------------------------------------------------

UPDATE public.rooms
SET room_type = 'community'
WHERE room_type IS NULL OR room_type NOT IN ('community', 'referral', 'hiring');

-- ---------------------------------------------------------------------------
-- 2. Harden the room_type column: NOT NULL, default 'community', check constraint
-- ---------------------------------------------------------------------------

-- Drop old constraint if it exists under any name Supabase might have given it.
ALTER TABLE public.rooms DROP CONSTRAINT IF EXISTS rooms_room_type_check;

ALTER TABLE public.rooms
  ALTER COLUMN room_type SET NOT NULL,
  ALTER COLUMN room_type SET DEFAULT 'community';

ALTER TABLE public.rooms
  ADD CONSTRAINT rooms_room_type_check
  CHECK (room_type IN ('community', 'referral', 'hiring'));

-- ---------------------------------------------------------------------------
-- 3. Add created_by column (records who created the room; survives host change)
-- ---------------------------------------------------------------------------

ALTER TABLE public.rooms
  ADD COLUMN IF NOT EXISTS created_by uuid
  REFERENCES public.user_profiles(id) ON DELETE SET NULL;

-- Backfill: for existing rows, creator = host
UPDATE public.rooms SET created_by = host_id WHERE created_by IS NULL;

-- ---------------------------------------------------------------------------
-- 4. Replace the single "host can create" RLS policy with two role-aware policies
-- ---------------------------------------------------------------------------

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "rooms: host can create"                              ON public.rooms;
DROP POLICY IF EXISTS "rooms: authenticated can create community or referral" ON public.rooms;
DROP POLICY IF EXISTS "rooms: recruiter can create hiring"                   ON public.rooms;

-- Any authenticated user may create a community or referral room for themselves.
CREATE POLICY "rooms: authenticated can create community or referral"
  ON public.rooms
  FOR INSERT
  TO authenticated
  WITH CHECK (
    host_id    = auth.uid()
    AND created_by = auth.uid()
    AND room_type IN ('community', 'referral')
  );

-- Only users with role_type = 'recruiter' may create hiring rooms.
CREATE POLICY "rooms: recruiter can create hiring"
  ON public.rooms
  FOR INSERT
  TO authenticated
  WITH CHECK (
    host_id    = auth.uid()
    AND created_by = auth.uid()
    AND room_type = 'hiring'
    AND EXISTS (
      SELECT 1
      FROM   public.user_profiles
      WHERE  id        = auth.uid()
        AND  role_type = 'recruiter'
    )
  );

-- Existing update / delete policies remain unchanged (host_id = auth.uid()).
-- They already prevent users from modifying rooms they don't own.
