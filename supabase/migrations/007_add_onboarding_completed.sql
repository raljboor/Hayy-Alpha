-- =============================================================================
-- Hayy – Add onboarding_completed flag to user_profiles
-- Migration: 007_add_onboarding_completed.sql
--
-- Adds a boolean flag the post-login redirect logic reads to decide
-- whether to send a returning user to /onboarding or /app/dashboard.
--   - Default false → brand-new users land on /onboarding
--   - Set to true at the end of each role's onboarding flow in
--     src/pages/Onboarding.tsx (job_seeker / referral_host / recruiter
--     all call updateProfile({ onboarding_completed: true, ... }))
--
-- Backfill: any existing row that has a non-empty bio OR headline is
-- treated as already-onboarded so users with real profile data don't
-- get bounced back to the intake forms after this migration ships.
--
-- Idempotent — safe to re-run.
-- =============================================================================

ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS onboarding_completed boolean NOT NULL DEFAULT false;

-- Backfill rows that already have profile data
UPDATE public.user_profiles
SET onboarding_completed = true
WHERE onboarding_completed = false
  AND (
       (bio      IS NOT NULL AND bio      <> '')
    OR (headline IS NOT NULL AND headline <> '')
  );
