-- =============================================================================
-- RLS tests: members table
--
--   SELECT: anyone can read any member profile (public directory)
--   INSERT: you can only insert a row where id = your auth.uid()
--   UPDATE: you can only update your own row
-- =============================================================================

BEGIN;

SELECT plan(6);

-- ── Setup (as postgres superuser) ─────────────────────────────────────────────

SELECT tests.create_user('11111111-1111-1111-1111-111111111111'::uuid, 'alice');
SELECT tests.create_user('22222222-2222-2222-2222-222222222222'::uuid, 'bob');


-- ── Act as Alice ──────────────────────────────────────────────────────────────
SELECT tests.set_claims('11111111-1111-1111-1111-111111111111'::uuid);
SET LOCAL role = 'authenticated';

-- Test 1: Alice can see all member profiles
SELECT ok(
  (SELECT count(*) FROM public.members) >= 2,
  'Alice can see all member profiles'
);

-- Test 2: Alice can update her own profile
SELECT lives_ok(
  $$
    UPDATE public.members
    SET description = 'Hello from Alice'
    WHERE id = '11111111-1111-1111-1111-111111111111'
  $$,
  'Alice can update her own profile'
);

-- Test 3: Alice cannot update Bob's profile (0 rows affected, no error)
UPDATE public.members
SET description = 'Hacked by Alice'
WHERE id = '22222222-2222-2222-2222-222222222222';

-- Verify as superuser
SET LOCAL role = 'postgres';
SELECT is(
  (SELECT description FROM public.members WHERE id = '22222222-2222-2222-2222-222222222222'),
  NULL,
  'Alice cannot update Bob''s profile (description unchanged)'
);

-- Test 4: Alice cannot insert a member row with a foreign UUID
SELECT tests.set_claims('11111111-1111-1111-1111-111111111111'::uuid);
SET LOCAL role = 'authenticated';

SELECT throws_ok(
  $$
    INSERT INTO public.members (id, display_name)
    VALUES ('33333333-3333-3333-3333-333333333333', 'impersonator')
  $$,
  NULL,
  NULL,
  'Alice cannot insert a member row with a foreign UUID'
);


-- ── Act as Bob ────────────────────────────────────────────────────────────────
SET LOCAL role = 'postgres';
SELECT tests.set_claims('22222222-2222-2222-2222-222222222222'::uuid);
SET LOCAL role = 'authenticated';

-- Test 5: Bob can update his own profile
SELECT lives_ok(
  $$
    UPDATE public.members
    SET description = 'Hello from Bob'
    WHERE id = '22222222-2222-2222-2222-222222222222'
  $$,
  'Bob can update his own profile'
);

-- Test 6: Bob cannot update Alice's profile
UPDATE public.members
SET description = 'Hacked by Bob'
WHERE id = '11111111-1111-1111-1111-111111111111';

SET LOCAL role = 'postgres';
SELECT isnt(
  (SELECT description FROM public.members WHERE id = '11111111-1111-1111-1111-111111111111'),
  'Hacked by Bob',
  'Bob cannot update Alice''s profile'
);


SELECT * FROM finish();
ROLLBACK;
