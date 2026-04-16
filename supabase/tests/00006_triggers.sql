-- =============================================================================
-- Trigger tests: set_member_id
--
-- The update_deck_card_count trigger + decks.card_count column were removed
-- in 20260416000002_drop-deck-card-count-column.sql — per-deck counts are
-- now computed live in the decks_with_stats view (see 00009_decks_with_stats.sql).
-- =============================================================================

BEGIN;

SELECT plan(2);

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


SELECT * FROM finish();
ROLLBACK;
