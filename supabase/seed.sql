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

-- \set uid_adam    'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'  -- job_seeker (the "you" user)
-- \set uid_maya    'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'  -- referral_host (featured host)
-- \set uid_rashid  'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'  -- referral_host (co-host, Amazon)
-- \set uid_priya   'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'  -- recruiter (Stripe)
-- \set uid_hana    'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'  -- referral_host (Shopify hiring mgr)
-- \set uid_layla   'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'  -- referral_host (Figma designer)

-- ---------------------------------------------------------------------------
-- Enrich user_profiles (trigger already created the rows)
-- ---------------------------------------------------------------------------

/*
update public.user_profiles set
  full_name  = 'Adam Saleh',
  headline   = 'Aspiring PM · ex-Growth',
  location   = 'Toronto, CA',
  bio        = 'Two years in growth marketing, now building toward product. I care about fintech that''s actually fair, and teams that ship with taste.',
  pronouns   = 'he/him',
  skills     = '{"Product strategy","Growth","SQL","User research","Figma","Storytelling"}',
  target_roles = '{"APM","Product internship","Fintech","AI","Mentorship"}',
  role_type  = 'job_seeker'
where id = :'uid_adam';

update public.user_profiles set
  full_name  = 'Maya Nasrallah',
  headline   = 'Senior PM · AWS',
  location   = 'Toronto, CA',
  bio        = 'I broke into product the long way, with no referral and no network — and I spend my weeks making sure the next person doesn''t have to.',
  skills     = '{"Product sense","Roadmapping","Data & SQL","Hiring","Mentorship","0→1"}',
  role_type  = 'referral_host'
where id = :'uid_maya';

update public.user_profiles set
  full_name  = 'Rashid Khoury',
  headline   = 'Engineering Manager · Amazon',
  location   = 'Toronto, CA',
  bio        = 'Co-host and connector. Refers across MENA and beyond.',
  skills     = '{"Engineering","Program management","MENA network","Amazon loops"}',
  role_type  = 'referral_host'
where id = :'uid_rashid';

update public.user_profiles set
  full_name  = 'Priya Shah',
  headline   = 'Recruiter · Stripe',
  location   = 'Toronto, CA',
  bio        = 'Hosts ''Referrals, honestly'' — what actually moves the needle in ATS and what doesn''t.',
  skills     = '{"Recruiting","ATS","PM hiring","Stripe","Fintech"}',
  role_type  = 'recruiter'
where id = :'uid_priya';

update public.user_profiles set
  full_name  = 'Hana Yusuf',
  headline   = 'Group PM · Shopify',
  location   = 'Toronto, CA',
  bio        = 'Toronto hiring manager. Open to warm intros for the right candidates.',
  skills     = '{"Product","Shopify","Toronto","Hiring","B2B"}',
  role_type  = 'referral_host'
where id = :'uid_hana';

update public.user_profiles set
  full_name  = 'Layla Park',
  headline   = 'Product Designer · Figma',
  location   = 'Toronto, CA',
  bio        = 'Hosts design career rooms and facilitates recruiter intros for design candidates.',
  skills     = '{"Product design","Figma","Portfolio","UX","Design systems"}',
  role_type  = 'referral_host'
where id = :'uid_layla';
*/

-- ---------------------------------------------------------------------------
-- host_settings for referral hosts
-- ---------------------------------------------------------------------------

/*
insert into public.host_settings (user_id, open_to_coffee_chats, open_to_referrals, open_to_resume_feedback, monthly_capacity, roles_supported, industries_supported)
values
  (:'uid_maya',   true,  true,  true,  3, '{"PM","APM","Product"}',          '{"AWS","Big Tech","Cloud"}'),
  (:'uid_rashid', true,  true,  false, 2, '{"Engineering","Program Mgmt"}',   '{"Amazon","MENA","Tech"}'),
  (:'uid_priya',  true,  false, true,  4, '{"PM","Product","Ops"}',           '{"Stripe","Fintech","Recruiting"}'),
  (:'uid_hana',   true,  true,  false, 2, '{"PM","Group PM","Product"}',      '{"Shopify","B2B","Toronto"}'),
  (:'uid_layla',  true,  false, true,  3, '{"Product Design","UX","Design"}', '{"Figma","Design systems"}')
on conflict (user_id) do nothing;
*/

-- ---------------------------------------------------------------------------
-- Sample rooms
-- ---------------------------------------------------------------------------

/*
insert into public.rooms (title, description, category, host_id, start_time, status, room_type, max_speakers, attendee_count)
values
  (
    'Breaking into Product at Big Tech',
    'Maya Nasrallah walks through what it actually takes to break into PM roles at big tech — from the inside.',
    'Product',
    :'uid_maya',
    now(),
    'open',
    'qa',
    6,
    42
  ),
  (
    'Cracking the PM case interview',
    'Recurring every 2nd Thursday. Maya runs through PM case structures, common traps, and what interviewers actually want to hear.',
    'Product',
    :'uid_maya',
    now() + interval '2 days',
    'open',
    'panel',
    4,
    42
  ),
  (
    'Design portfolios that get callbacks',
    'Layla Park on what hiring managers at Figma and top design orgs actually look for in a portfolio.',
    'Design',
    :'uid_layla',
    now() + interval '3 days',
    'open',
    'qa',
    4,
    28
  ),
  (
    'Product, Data & Software Career Room',
    'PMs, data scientists, and engineers from top product companies host an open Q&A.',
    'Tech',
    :'uid_rashid',
    now() + interval '4 days',
    'open',
    'qa',
    6,
    38
  ),
  (
    'Referrals, honestly: what works',
    'Priya Shah cuts through the noise — what referrals actually do in ATS, how to ask without being transactional, and what kills a good intro.',
    'Operations',
    :'uid_priya',
    now() + interval '5 days',
    'open',
    'community',
    5,
    53
  );
*/

-- ---------------------------------------------------------------------------
-- Sample referral_requests
-- ---------------------------------------------------------------------------

/*
insert into public.referral_requests (requester_id, host_id, target_company, target_role, request_type, status, message)
values
  (
    :'uid_adam',
    :'uid_maya',
    'AWS',
    'Product Manager',
    'referral',
    'pending',
    'We connected in the Breaking into Product at Big Tech room. I''d love a warm intro to the APM program — happy to share my background.'
  ),
  (
    :'uid_adam',
    :'uid_layla',
    'Figma',
    'Associate PM',
    'coffee_chat',
    'accepted',
    'Loved your design room. I''m targeting the APM track at Figma — would you be open to a 20-min chat?'
  ),
  (
    :'uid_adam',
    :'uid_hana',
    'Shopify',
    'Senior PM',
    'coffee_chat',
    'pending',
    'Hi Hana — I came across your profile via the Shopify room. Would love 20 minutes to learn about the team.'
  );
*/

-- ---------------------------------------------------------------------------
-- Sample notifications
-- ---------------------------------------------------------------------------

/*
insert into public.notifications (user_id, type, title, body, related_entity_type)
values
  (
    :'uid_adam',
    'Referral accepted',
    'Maya accepted your referral request',
    'She wants to review your resume first — send the job link and she''ll decide.',
    'referral_request'
  ),
  (
    :'uid_adam',
    'New message',
    'Priya replied in your referral thread',
    'Your positioning is clear — tighten the second bullet with a number.',
    'referral_message'
  ),
  (
    :'uid_adam',
    'Room reminder',
    'Breaking into Product at Big Tech starts in 1 hour',
    'You are registered as a listener. Bring one specific question.',
    'room'
  );
*/
