-- =============================================================================
-- RPC function tests: save_review, reserve_card, reorder_card
-- =============================================================================

BEGIN;

SELECT plan(8);

-- ── Setup ─────────────────────────────────────────────────────────────────────

SELECT tests.create_user('11111111-1111-1111-1111-111111111111'::uuid, 'alice_rpc');
SELECT tests.create_user('22222222-2222-2222-2222-222222222222'::uuid, 'bob_rpc');

SELECT tests.set_claims('11111111-1111-1111-1111-111111111111'::uuid);
INSERT INTO public.decks (id, title, is_public) VALUES (100, 'Alice Deck', false);
INSERT INTO public.cards (id, deck_id, front_text, back_text, rank) VALUES
  (1000, 100, 'Q1', 'A1', 1000),
  (1001, 100, 'Q2', 'A2', 2000);

SELECT tests.set_claims('22222222-2222-2222-2222-222222222222'::uuid);
INSERT INTO public.decks (id, title, is_public) VALUES (200, 'Bob Deck', false);
INSERT INTO public.cards (id, deck_id, front_text, back_text, rank) VALUES
  (2000, 200, 'Q3', 'A3', 1000);


-- ── save_review ───────────────────────────────────────────────────────────────

-- Test 1: Alice can save a review for her own card
SELECT tests.set_claims('11111111-1111-1111-1111-111111111111'::uuid);
SET LOCAL role = 'authenticated';

SELECT lives_ok(
  $$
    SELECT public.save_review(
      p_card_id := 1000,
      p_due := now() + interval '1 day',
      p_stability := 2.5, p_difficulty := 5.0,
      p_elapsed_days := 0::smallint, p_scheduled_days := 1::smallint,
      p_reps := 1::smallint, p_lapses := 0::smallint,
      p_last_review := now(),
      p_rating := 3::smallint, p_state := 0::smallint,
      p_log_due := now(), p_log_stability := 0.0, p_log_difficulty := 0.0,
      p_log_scheduled_days := 0::smallint, p_review := now()
    )
  $$,
  'Alice can save a review for her own card'
);

-- Test 2 & 3: Verify both tables were written
SET LOCAL role = 'postgres';

SELECT is(
  (SELECT count(*) FROM public.reviews WHERE card_id = 1000)::int,
  1,
  'save_review created a review row'
);

SELECT is(
  (SELECT count(*) FROM public.review_logs WHERE card_id = 1000)::int,
  1,
  'save_review created a review_log row'
);

-- Test 4: Alice cannot save a review for Bob's card
SELECT tests.set_claims('11111111-1111-1111-1111-111111111111'::uuid);
SET LOCAL role = 'authenticated';

SELECT throws_ok(
  $$
    SELECT public.save_review(
      p_card_id := 2000,
      p_due := now() + interval '1 day',
      p_stability := 2.5, p_difficulty := 5.0,
      p_elapsed_days := 0::smallint, p_scheduled_days := 1::smallint,
      p_reps := 1::smallint, p_lapses := 0::smallint,
      p_last_review := now(),
      p_rating := 3::smallint, p_state := 0::smallint,
      p_log_due := now(), p_log_stability := 0.0, p_log_difficulty := 0.0,
      p_log_scheduled_days := 0::smallint, p_review := now()
    )
  $$,
  'Card not found or not owned by user',
  'Alice cannot save a review for Bob''s card'
);


-- ── reserve_card ──────────────────────────────────────────────────────────────

-- Test 5: Alice can reserve a card in her own deck
SELECT lives_ok(
  $$
    SELECT * FROM public.reserve_card(100, NULL, NULL)
  $$,
  'Alice can reserve a card in her own deck'
);

-- Test 6: Alice cannot reserve a card in Bob's deck
SELECT throws_ok(
  $$
    SELECT * FROM public.reserve_card(200, NULL, NULL)
  $$,
  'Deck not found or not owned by user',
  'Alice cannot reserve a card in Bob''s deck'
);


-- ── reorder_card ──────────────────────────────────────────────────────────────

-- Test 7: Alice can reorder her own card
SELECT lives_ok(
  $$
    SELECT public.reorder_card(1000, NULL, 1001)
  $$,
  'Alice can reorder her own card'
);

-- Test 8: Alice cannot reorder Bob's card
SELECT throws_ok(
  $$
    SELECT public.reorder_card(2000, NULL, NULL)
  $$,
  'Card not found or not owned by user',
  'Alice cannot reorder Bob''s card'
);


SELECT * FROM finish();
ROLLBACK;
