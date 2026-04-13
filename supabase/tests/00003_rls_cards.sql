-- =============================================================================
-- RLS tests: cards table
--
-- Cards inherit visibility from their parent deck's is_public flag.
-- Writes (INSERT, UPDATE, DELETE) are always owner-only.
-- =============================================================================

BEGIN;

SELECT plan(8);

-- ── Setup ─────────────────────────────────────────────────────────────────────

SELECT tests.create_user('11111111-1111-1111-1111-111111111111'::uuid, 'alice_cards');
SELECT tests.create_user('22222222-2222-2222-2222-222222222222'::uuid, 'bob_cards');

SELECT tests.set_claims('11111111-1111-1111-1111-111111111111'::uuid);
INSERT INTO public.decks (id, title, is_public) VALUES
  (100, 'Alice Private Deck', false),
  (101, 'Alice Public Deck',  true);
INSERT INTO public.cards (id, deck_id, front_text, back_text, rank) VALUES
  (1000, 100, 'Alice private Q', 'Alice private A', 1000),
  (1001, 101, 'Alice public Q',  'Alice public A',  1000);

SELECT tests.set_claims('22222222-2222-2222-2222-222222222222'::uuid);
INSERT INTO public.decks (id, title, is_public) VALUES
  (200, 'Bob Private Deck', false);
INSERT INTO public.cards (id, deck_id, front_text, back_text, rank) VALUES
  (2000, 200, 'Bob private Q', 'Bob private A', 1000);


-- ── Act as Alice ──────────────────────────────────────────────────────────────
SELECT tests.set_claims('11111111-1111-1111-1111-111111111111'::uuid);
SET LOCAL role = 'authenticated';

-- Test 1: Alice sees her 2 cards but not Bob's
SELECT is(
  (SELECT count(*) FROM public.cards WHERE id IN (1000, 1001, 2000))::int,
  2,
  'Alice sees her 2 cards but not Bob''s private card'
);


-- ── Act as Bob ────────────────────────────────────────────────────────────────
SET LOCAL role = 'postgres';
SELECT tests.set_claims('22222222-2222-2222-2222-222222222222'::uuid);
SET LOCAL role = 'authenticated';

-- Test 2: Bob sees his card + Alice's public deck card
SELECT is(
  (SELECT count(*) FROM public.cards WHERE id IN (1000, 1001, 2000))::int,
  2,
  'Bob sees his card + Alice''s public deck card'
);

-- Test 3: Bob can read Alice's public card content
SELECT is(
  (SELECT front_text FROM public.cards WHERE id = 1001),
  'Alice public Q',
  'Bob can read the content of Alice''s public card'
);

-- Test 4: Bob cannot see Alice's private card
SELECT is(
  (SELECT count(*) FROM public.cards WHERE id = 1000)::int,
  0,
  'Bob cannot see Alice''s private card'
);

-- Test 5: Bob can update his own card
SELECT lives_ok(
  $$
    UPDATE public.cards SET front_text = 'Updated' WHERE id = 2000
  $$,
  'Bob can update his own card'
);

-- Test 6: Bob cannot update Alice's public card (public = read-only for others)
UPDATE public.cards SET front_text = 'Hacked' WHERE id = 1001;

SET LOCAL role = 'postgres';
SELECT isnt(
  (SELECT front_text FROM public.cards WHERE id = 1001),
  'Hacked',
  'Bob cannot update Alice''s public card'
);

-- Test 7: Bob can delete his own card
SELECT tests.set_claims('22222222-2222-2222-2222-222222222222'::uuid);
SET LOCAL role = 'authenticated';

SELECT lives_ok(
  $$
    DELETE FROM public.cards WHERE id = 2000
  $$,
  'Bob can delete his own card'
);

-- Test 8: Bob cannot delete Alice's card
DELETE FROM public.cards WHERE id = 1001;

SET LOCAL role = 'postgres';
SELECT is(
  (SELECT count(*) FROM public.cards WHERE id = 1001)::int,
  1,
  'Alice''s card still exists after Bob tried to delete it'
);


SELECT * FROM finish();
ROLLBACK;
