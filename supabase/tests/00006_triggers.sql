-- =============================================================================
-- Trigger tests: set_member_id, update_deck_card_count
-- =============================================================================

BEGIN;

SELECT plan(5);

-- ── Setup ─────────────────────────────────────────────────────────────────────

SELECT tests.create_user('11111111-1111-1111-1111-111111111111'::uuid, 'alice_triggers');

SELECT tests.set_claims('11111111-1111-1111-1111-111111111111'::uuid);
INSERT INTO public.decks (id, title, is_public) VALUES (100, 'Alice Deck', false);


-- ── set_member_id trigger ─────────────────────────────────────────────────────

-- Test 1: Deck insert stamps correct member_id
SELECT is(
  (SELECT member_id FROM public.decks WHERE id = 100),
  '11111111-1111-1111-1111-111111111111'::uuid,
  'set_member_id trigger stamps auth.uid() on deck insert'
);

-- Test 2: Card insert stamps correct member_id
SET LOCAL role = 'authenticated';

INSERT INTO public.cards (id, deck_id, front_text, back_text, rank)
VALUES (1000, 100, 'Q', 'A', 1000);

SET LOCAL role = 'postgres';

SELECT is(
  (SELECT member_id FROM public.cards WHERE id = 1000),
  '11111111-1111-1111-1111-111111111111'::uuid,
  'set_member_id trigger stamps auth.uid() on card insert'
);


-- ── update_deck_card_count trigger ────────────────────────────────────────────

-- Test 3: card_count is correct after insert
SELECT is(
  (SELECT card_count FROM public.decks WHERE id = 100)::int,
  1,
  'card_count is 1 after inserting one card'
);

-- Test 4: card_count increments
SELECT tests.set_claims('11111111-1111-1111-1111-111111111111'::uuid);
SET LOCAL role = 'authenticated';

INSERT INTO public.cards (id, deck_id, front_text, back_text, rank)
VALUES (1001, 100, 'Q2', 'A2', 2000);

SET LOCAL role = 'postgres';

SELECT is(
  (SELECT card_count FROM public.decks WHERE id = 100)::int,
  2,
  'card_count incremented to 2 after second card insert'
);

-- Test 5: card_count decrements on delete
SELECT tests.set_claims('11111111-1111-1111-1111-111111111111'::uuid);
SET LOCAL role = 'authenticated';

DELETE FROM public.cards WHERE id = 1001;

SET LOCAL role = 'postgres';

SELECT is(
  (SELECT card_count FROM public.decks WHERE id = 100)::int,
  1,
  'card_count decremented to 1 after deleting a card'
);


SELECT * FROM finish();
ROLLBACK;
