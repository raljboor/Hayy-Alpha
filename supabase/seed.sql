-- =============================================================================
-- Hayy – Development Seed Data
-- supabase/seed.sql
--
-- IMPORTANT: auth.users rows cannot be inserted via SQL in a hosted Supabase
-- project. Create test users through the Supabase Auth dashboard or via
-- supabase.auth.signUp() in the browser, then copy the generated UUIDs into
-- the placeholders below.
--
-- Workflow:
--   1. Run 001_initial_schema.sql
--   2. Run 002_rls_policies.sql
--   3. Create test users in Supabase Auth dashboard (Authentication > Users)
--      and note their UUIDs.
--   4. Replace the placeholder UUIDs below with the real ones.
--   5. Run this file in the SQL editor.
--
-- The handle_new_auth_user trigger will auto-insert a user_profiles row for
-- each auth user when they sign up. You only need to UPDATE those rows here
-- to add richer profile data.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Replace these with real UUIDs from your Supabase Auth dashboard.
-- ---------------------------------------------------------------------------

-- \set uid_amira   'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'  -- job_seeker
-- \set uid_yusuf   'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'  -- referral_host
-- \set uid_lina    'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'  -- referral_host
-- \set uid_daniel  'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'  -- recruiter
-- \set uid_sara    'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'  -- job_seeker
-- \set uid_omar    'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'  -- referral_host

-- ---------------------------------------------------------------------------
-- Enrich user_profiles (trigger already created the rows)
-- ---------------------------------------------------------------------------

/*
update public.user_profiles set
  full_name  = 'Amira Khan',
  headline   = 'Product Marketing',
  location   = 'Toronto, CA',
  bio        = 'Newcomer to Canada, ex-Careem. Building my first PM role here.',
  pronouns   = 'she/her',
  role_type  = 'job_seeker'
where id = :'uid_amira';

update public.user_profiles set
  full_name  = 'Yusuf Rahman',
  headline   = 'Senior PM @ Amazon',
  location   = 'Vancouver, CA',
  bio        = 'I host warm referral chats for Operations + PM roles.',
  role_type  = 'referral_host'
where id = :'uid_yusuf';

update public.user_profiles set
  full_name  = 'Lina Haddad',
  headline   = 'Software Engineer @ Shopify',
  location   = 'Remote',
  bio        = 'Backend eng. Happy to refer thoughtful applicants.',
  role_type  = 'referral_host'
where id = :'uid_lina';

update public.user_profiles set
  full_name  = 'Daniel Okonkwo',
  headline   = 'Talent Partner @ Notion',
  location   = 'NYC',
  bio        = 'Recruiter — I scout from live rooms.',
  role_type  = 'recruiter'
where id = :'uid_daniel';

update public.user_profiles set
  full_name  = 'Sara Nguyen',
  headline   = 'UX Designer',
  location   = 'Berlin, DE',
  bio        = 'International grad looking for warm intros into design teams.',
  role_type  = 'job_seeker'
where id = :'uid_sara';

update public.user_profiles set
  full_name  = 'Omar Saleh',
  headline   = 'Operations Lead @ Uber',
  location   = 'London, UK',
  bio        = 'Host of the Operations career room.',
  role_type  = 'referral_host'
where id = :'uid_omar';
*/

-- ---------------------------------------------------------------------------
-- host_settings for referral hosts
-- ---------------------------------------------------------------------------

/*
insert into public.host_settings (user_id, open_to_coffee_chats, open_to_referrals, open_to_resume_feedback, monthly_capacity, roles_supported, industries_supported)
values
  (:'uid_yusuf', true,  true,  false, 3, '{"PM","Operations"}',       '{"Tech","Amazon"}'),
  (:'uid_lina',  true,  true,  true,  2, '{"Engineering","Backend"}',  '{"Shopify","Tech"}'),
  (:'uid_omar',  true,  false, true,  3, '{"Operations","Logistics"}',  '{"Uber","Ops"}')
on conflict (user_id) do nothing;
*/

-- ---------------------------------------------------------------------------
-- Sample rooms
-- ---------------------------------------------------------------------------

/*
insert into public.rooms (title, description, category, host_id, start_time, status, room_type, max_speakers, attendee_count)
values
  (
    'How to Get Referred Into Corporate Roles in Canada',
    'Insiders walk through how warm referrals actually move through ATS systems at Canadian corporates.',
    'Canada',
    :'uid_yusuf',
    now(),
    'open',
    'qa',
    6,
    184
  ),
  (
    'Breaking Into Amazon, Logistics & Program Management',
    'Senior PMs and Ops leaders share the real path into Amazon.',
    'Operations',
    :'uid_yusuf',
    now() + interval '1 day',
    'open',
    'panel',
    5,
    142
  ),
  (
    'Career Access for International Professionals',
    'For newcomers and international grads — how to get noticed without local experience.',
    'Newcomers',
    :'uid_lina',
    now() + interval '2 days',
    'open',
    'qa',
    5,
    96
  );
*/

-- ---------------------------------------------------------------------------
-- Sample referral_requests
-- ---------------------------------------------------------------------------

/*
insert into public.referral_requests (requester_id, host_id, target_company, target_role, request_type, status, message)
values
  (
    :'uid_amira',
    :'uid_yusuf',
    'Amazon',
    'Product Marketing Manager',
    'referral',
    'pending',
    'We connected in the Amazon Canada room. Would love a warm intro to the PMM team.'
  ),
  (
    :'uid_amira',
    :'uid_lina',
    'Shopify',
    'Product Marketing Manager',
    'coffee_chat',
    'accepted',
    'Loved the Engineering open house — would love 20 min to learn about the merchant team.'
  ),
  (
    :'uid_sara',
    :'uid_yusuf',
    'Notion',
    'Product Designer',
    'coffee_chat',
    'pending',
    'Saw your profile in the Design room — would love your perspective on PMM × design partnerships.'
  );
*/

-- ---------------------------------------------------------------------------
-- Sample notifications
-- ---------------------------------------------------------------------------

/*
insert into public.notifications (user_id, type, title, body, related_entity_type)
values
  (
    :'uid_amira',
    'Referral accepted',
    'Yusuf accepted your coffee chat request',
    'He suggested Tuesday or Wednesday evening for a 20-minute intro call.',
    'referral_request'
  ),
  (
    :'uid_amira',
    'New message',
    'Lina replied in your referral thread',
    'Thanks for the context — I can review your resume before the room.',
    'referral_message'
  ),
  (
    :'uid_amira',
    'Room reminder',
    'Product Leaders in Tech starts in 1 hour',
    'You are registered as a listener. Bring one specific question.',
    'room'
  );
*/
