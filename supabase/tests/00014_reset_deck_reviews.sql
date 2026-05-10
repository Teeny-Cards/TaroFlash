-- =============================================================================
-- RPC function tests: reset_deck_reviews
-- =============================================================================
-- Covers:
--   • owner can reset their own deck's reviews + review_logs
--   • non-owner cannot reset someone else's deck
--   • reviews + logs for cards in OTHER decks are untouched
--   • the cards themselves stay (only review state is wiped)
-- =============================================================================

BEGIN;

SELECT plan(7);

-- ── Setup ─────────────────────────────────────────────────────────────────────

SELECT tests.create_user('11111111-1111-1111-1111-111111111111'::uuid, 'alice_rr');
SELECT tests.create_user('22222222-2222-2222-2222-222222222222'::uuid, 'bob_rr');

-- Alice owns two decks: 9500 (reset target) and 9501 (control, must survive).
-- Bob owns deck 9600.
SELECT tests.set_claims('11111111-1111-1111-1111-111111111111'::uuid);
INSERT INTO public.decks (id, title, is_public) VALUES
  (9500, 'Alice Reset Target', false),
  (9501, 'Alice Control', false);
INSERT INTO public.cards (id, deck_id, front_text, back_text, rank) VALUES
  (95000, 9500, 'Q1', 'A1', 1000),
  (95001, 9500, 'Q2', 'A2', 2000),
  (95100, 9501, 'CTRL', 'CTRL', 1000);

-- Seed a reviews row per card (production seeds these on the first save_review
-- upsert; tests do it explicitly since the auto-create trigger was dropped).
INSERT INTO public.reviews (card_id, member_id, due, reps, lapses) VALUES
  (95000, '11111111-1111-1111-1111-111111111111'::uuid, now(), 1, 0),
  (95001, '11111111-1111-1111-1111-111111111111'::uuid, now(), 2, 0),
  (95100, '11111111-1111-1111-1111-111111111111'::uuid, now(), 0, 0);

-- Add log history so we can assert it gets cleared.
INSERT INTO public.review_logs (
  card_id, member_id, rating, state, due, stability, difficulty,
  scheduled_days, review
) VALUES
  (95000, '11111111-1111-1111-1111-111111111111'::uuid, 3, 1, now(), 1.0, 5.0, 1, now()),
  (95001, '11111111-1111-1111-1111-111111111111'::uuid, 4, 2, now(), 2.0, 4.0, 3, now()),
  (95100, '11111111-1111-1111-1111-111111111111'::uuid, 2, 1, now(), 1.0, 6.0, 1, now());

SELECT tests.set_claims('22222222-2222-2222-2222-222222222222'::uuid);
INSERT INTO public.decks (id, title, is_public) VALUES (9600, 'Bob Deck', false);


-- ── Ownership guard ───────────────────────────────────────────────────────────

-- Test 1: Alice cannot reset Bob's deck.
SELECT tests.set_claims('11111111-1111-1111-1111-111111111111'::uuid);
SET LOCAL role = 'authenticated';

SELECT throws_ok(
  $$ SELECT public.reset_deck_reviews(9600) $$,
  'Deck not found or not owned by user',
  'reset_deck_reviews refuses to reset a deck the caller does not own'
);


-- ── Happy path: reset deck 9500 ───────────────────────────────────────────────

SELECT lives_ok(
  $$ SELECT public.reset_deck_reviews(9500) $$,
  'Alice can reset her own deck'
);


-- ── Assertions on the resulting state ─────────────────────────────────────────

SET LOCAL role = 'postgres';

-- Test 3: reviews rows for the target deck's cards are gone.
SELECT is(
  (SELECT count(*) FROM public.reviews WHERE card_id IN (95000, 95001))::int,
  0,
  'reset_deck_reviews removes reviews rows for cards in the target deck'
);

-- Test 4: review_logs rows for the target deck's cards are gone.
SELECT is(
  (SELECT count(*) FROM public.review_logs WHERE card_id IN (95000, 95001))::int,
  0,
  'reset_deck_reviews removes review_logs rows for cards in the target deck'
);

-- Test 5: the cards themselves are untouched.
SELECT is(
  (SELECT count(*) FROM public.cards WHERE deck_id = 9500)::int,
  2,
  'cards in the target deck are not deleted'
);

-- Tests 6-7: reviews + logs for cards in OTHER decks are untouched.
SELECT ok(
  EXISTS (SELECT 1 FROM public.reviews WHERE card_id = 95100),
  'reviews row for cards in unrelated decks survives'
);

SELECT ok(
  EXISTS (SELECT 1 FROM public.review_logs WHERE card_id = 95100),
  'review_logs for cards in unrelated decks survive'
);


SELECT * FROM finish();
ROLLBACK;
