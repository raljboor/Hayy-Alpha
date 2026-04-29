-- =============================================================================
-- Hayy – Add profile picture (avatars bucket) and referral_goals field
-- Migration: 003_add_profile_picture_and_referral_goals.sql
--
-- Run AFTER 002_rls_policies.sql.
-- This file is idempotent (uses IF NOT EXISTS / IF NOT EXISTS).
-- =============================================================================

-- Add referral_goals column to user_profiles
-- Stores the user's text description of the kinds of intros they are seeking.

alter table public.user_profiles
  add column if not exists referral_goals text;

-- ---------------------------------------------------------------------------
-- Storage bucket: avatars
--
-- Create this bucket manually in the Supabase dashboard:
--   Storage → New bucket → name: "avatars" → Public: false (private)
--   Allowed MIME types: image/png, image/jpeg, image/webp
--   Max upload size: 5 MB
--
-- Then run this policy block to allow users to manage their own avatar files.
-- ---------------------------------------------------------------------------

-- Allow authenticated users to read any avatar (public profile pictures)
-- Note: The bucket itself controls access; this policy layer mirrors that.
-- If you make the bucket PUBLIC in the Supabase dashboard, this policy is not
-- required but is still safe to have.

-- The policies below use the storage.objects table syntax required by Supabase.

drop policy if exists "avatars: authenticated users can read" on storage.objects;
drop policy if exists "avatars: owner can upload"             on storage.objects;
drop policy if exists "avatars: owner can update"             on storage.objects;
drop policy if exists "avatars: owner can delete"             on storage.objects;

create policy "avatars: authenticated users can read"
  on storage.objects
  for select
  to authenticated
  using (bucket_id = 'avatars');

create policy "avatars: owner can upload"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatars: owner can update"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatars: owner can delete"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
