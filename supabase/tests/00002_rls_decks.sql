-- =============================================================================
-- RLS tests: decks table
--
-- Visibility: private decks → owner only, public decks → everyone.
-- Writes (INSERT, UPDATE, DELETE) are always owner-only.
-- =============================================================================

BEGIN;

SELECT plan(10);

-- ── Setup ─────────────────────────────────────────────────────────────────────

SELECT tests.create_user('11111111-1111-1111-1111-111111111111'::uuid, 'alice_decks');
SELECT tests.create_user('22222222-2222-2222-2222-222222222222'::uuid, 'bob_decks');

-- Insert decks as postgres with claims set (so set_member_id trigger works).
SELECT tests.set_claims('11111111-1111-1111-1111-111111111111'::uuid);
INSERT INTO public.decks (id, title, is_public) VALUES
  (100, 'Alice Private Deck', false),
  (101, 'Alice Public Deck',  true);

SELECT tests.set_claims('22222222-2222-2222-2222-222222222222'::uuid);
INSERT INTO public.decks (id, title, is_public) VALUES
  (200, 'Bob Private Deck', false);


-- ── Act as Alice ──────────────────────────────────────────────────────────────
SELECT tests.set_claims('11111111-1111-1111-1111-111111111111'::uuid);
SET LOCAL role = 'authenticated';

-- Test 1: Alice sees her 2 decks but not Bob's private deck
SELECT is(
  (SELECT count(*) FROM public.decks WHERE id IN (100, 101, 200))::int,
  2,
  'Alice sees her 2 decks (private + public) but not Bob''s private deck'
);


-- ── Act as Bob ────────────────────────────────────────────────────────────────
SET LOCAL role = 'postgres';
SELECT tests.set_claims('22222222-2222-2222-2222-222222222222'::uuid);
SET LOCAL role = 'authenticated';

-- Test 2: Bob sees his deck + Alice's public deck
SELECT is(
  (SELECT count(*) FROM public.decks WHERE id IN (100, 101, 200))::int,
  2,
  'Bob sees his private deck + Alice''s public deck'
);

-- Test 3: Bob can see Alice's public deck by ID
SELECT is(
  (SELECT count(*) FROM public.decks WHERE id = 101)::int,
  1,
  'Bob can see Alice''s public deck by ID'
);

-- Test 4: Bob CANNOT see Alice's private deck
SELECT is(
  (SELECT count(*) FROM public.decks WHERE id = 100)::int,
  0,
  'Bob cannot see Alice''s private deck'
);

-- Test 5: Bob can create a deck
SELECT lives_ok(
  $$
    INSERT INTO public.decks (id, title) VALUES (201, 'Bob New Deck')
  $$,
  'Bob can create a deck'
);

-- Test 6: Trigger corrects member_id even if client sends a different value
INSERT INTO public.decks (id, title, member_id)
VALUES (999, 'Sneaky Deck', '11111111-1111-1111-1111-111111111111');

SET LOCAL role = 'postgres';
SELECT is(
  (SELECT member_id FROM public.decks WHERE id = 999),
  '22222222-2222-2222-2222-222222222222'::uuid,
  'set_member_id trigger corrects member_id to auth.uid()'
);

-- Test 7: Bob can update his own deck
SELECT tests.set_claims('22222222-2222-2222-2222-222222222222'::uuid);
SET LOCAL role = 'authenticated';

SELECT lives_ok(
  $$
    UPDATE public.decks SET title = 'Bob Updated Deck' WHERE id = 200
  $$,
  'Bob can update his own deck'
);

-- Test 8: Bob cannot update Alice's deck
UPDATE public.decks SET title = 'Hacked' WHERE id = 101;

SET LOCAL role = 'postgres';
SELECT isnt(
  (SELECT title FROM public.decks WHERE id = 101),
  'Hacked',
  'Bob cannot update Alice''s deck'
);

-- Test 9: Bob can delete his own deck
SELECT tests.set_claims('22222222-2222-2222-2222-222222222222'::uuid);
SET LOCAL role = 'authenticated';

SELECT lives_ok(
  $$
    DELETE FROM public.decks WHERE id = 201
  $$,
  'Bob can delete his own deck'
);

-- Test 10: Bob cannot delete Alice's deck
DELETE FROM public.decks WHERE id = 101;

SET LOCAL role = 'postgres';
SELECT is(
  (SELECT count(*) FROM public.decks WHERE id = 101)::int,
  1,
  'Alice''s deck still exists after Bob tried to delete it'
);


SELECT * FROM finish();
ROLLBACK;
