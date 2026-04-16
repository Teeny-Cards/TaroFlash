-- =============================================================================
-- Member role + plan: column defaults, auth helpers, and privilege escalation
-- guards introduced in 20260415000000_member-roles-and-plan.sql
--
--   - Defaults: new members get role='user' and plan='free'
--   - auth_role() / auth_plan() reflect the caller's own row
--   - Users CANNOT update their own role or plan (privilege escalation block)
--   - Admins CAN update another member's role and plan
--   - Moderators CANNOT update another member's role or plan
-- =============================================================================

BEGIN;

SELECT plan(10);

-- ── Setup (as postgres superuser) ─────────────────────────────────────────────
SELECT tests.create_user('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'alice');
SELECT tests.create_user('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid, 'bob');
SELECT tests.create_user('cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid, 'carol_admin');
SELECT tests.create_user('dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid, 'dan_mod');

-- Promote carol to admin, dan to moderator (bypassing RLS as superuser).
UPDATE public.members SET role = 'admin'
  WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
UPDATE public.members SET role = 'moderator'
  WHERE id = 'dddddddd-dddd-dddd-dddd-dddddddddddd';


-- Test 1: default role is 'user' for new rows
SELECT is(
  (SELECT role::text FROM public.members WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  'user',
  'new members get role=user by default'
);

-- Test 2: default plan is 'free' for new rows
SELECT is(
  (SELECT plan::text FROM public.members WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  'free',
  'new members get plan=free by default'
);


-- ── Act as Alice (plain user) ─────────────────────────────────────────────────
SELECT tests.set_claims('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid);
SET LOCAL role = 'authenticated';

-- Test 3: auth_role() returns the caller's role
SELECT is(
  (SELECT public.auth_role()::text),
  'user',
  'auth_role() returns caller role'
);

-- Test 4: auth_plan() returns the caller's plan
SELECT is(
  (SELECT public.auth_plan()::text),
  'free',
  'auth_plan() returns caller plan'
);

-- Test 5: Alice can update her own non-privileged fields
SELECT lives_ok(
  $$
    UPDATE public.members
    SET description = 'new bio'
    WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
  $$,
  'Alice can update non-privileged fields on her own row'
);

-- Test 6: Alice CANNOT promote herself to admin
SELECT throws_ok(
  $$
    UPDATE public.members
    SET role = 'admin'
    WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
  $$,
  NULL,
  NULL,
  'Alice cannot escalate her own role'
);

-- Test 7: Alice CANNOT upgrade her own plan
SELECT throws_ok(
  $$
    UPDATE public.members
    SET plan = 'paid'
    WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
  $$,
  NULL,
  NULL,
  'Alice cannot upgrade her own plan'
);


-- ── Act as Dan (moderator) ────────────────────────────────────────────────────
SET LOCAL role = 'postgres';
SELECT tests.set_claims('dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid);
SET LOCAL role = 'authenticated';

-- Test 8: Moderator cannot change another user's role (row is invisible to UPDATE).
UPDATE public.members
SET role = 'admin'
WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

SET LOCAL role = 'postgres';
SELECT is(
  (SELECT role::text FROM public.members WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  'user',
  'moderator cannot promote another user'
);


-- ── Act as Carol (admin) ──────────────────────────────────────────────────────
SELECT tests.set_claims('cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid);
SET LOCAL role = 'authenticated';

-- Test 9: Admin can change another user's role
SELECT lives_ok(
  $$
    UPDATE public.members
    SET role = 'moderator'
    WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
  $$,
  'admin can change another user''s role'
);

-- Test 10: Admin can change another user's plan
SELECT lives_ok(
  $$
    UPDATE public.members
    SET plan = 'paid'
    WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
  $$,
  'admin can change another user''s plan'
);


SELECT * FROM finish();
ROLLBACK;
