-- =============================================================================
-- Hayy – Add recruiter-specific profile fields
-- Migration: 004_add_recruiter_profile_fields.sql
--
-- Run AFTER 003_add_profile_picture_and_referral_goals.sql.
-- Idempotent (uses ADD COLUMN IF NOT EXISTS).
-- =============================================================================

alter table public.user_profiles
  add column if not exists company_name         text,
  add column if not exists recruiter_title      text,
  add column if not exists hiring_focus         text[]  not null default '{}',
  add column if not exists departments_hiring   text[]  not null default '{}',
  add column if not exists locations_hiring     text[]  not null default '{}',
  add column if not exists company_description  text;

-- Index for recruiter discovery queries (future: list recruiters by company)
create index if not exists idx_user_profiles_company_name
  on public.user_profiles(company_name)
  where company_name is not null;
