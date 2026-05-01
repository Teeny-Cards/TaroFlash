-- =============================================================================
-- decks_with_stats daily-cap clamping + get_study_session_cards RPC
--
-- Covers:
--   1. decks_with_stats exposes reviewed_today_count + new_reviewed_today_count
--      and clamps due_count by max_reviews_per_day - reviewed_today.
--   2. get_study_session_cards returns ordered (new-first, then review)
--      respecting both max_new_per_day and max_reviews_per_day.
--   3. p_study_all = true bypasses caps.
--   4. NULL caps mean unlimited.
--   5. RLS scopes both view + RPC to the calling member.
-- =============================================================================

BEGIN;

SELECT plan(11);

-- ── Setup ─────────────────────────────────────────────────────────────────────
SELECT tests.create_user('11111111-1111-1111-1111-111111111111'::uuid, 'alice_caps');
SELECT tests.create_user('22222222-2222-2222-2222-222222222222'::uuid, 'bob_caps');

SELECT tests.set_claims('11111111-1111-1111-1111-111111111111'::uuid);

-- Deck 100: max_reviews_per_day = 3, max_new_per_day = 1
-- 5 cards: 1000, 1001 are NEW (no review row); 1002, 1003 are due reviews; 1004 is not due.
INSERT INTO public.decks (id, title, is_public, study_config) VALUES
  (100, 'Caps Deck', false, '{"max_reviews_per_day": 3, "max_new_per_day": 1}'::jsonb);

INSERT INTO public.cards (id, deck_id, front_text, back_text, rank) VALUES
  (1000, 100, 'New A', '', 1000),
  (1001, 100, 'New B', '', 2000),
  (1002, 100, 'Due A', '', 3000),
  (1003, 100, 'Due B', '', 4000),
  (1004, 100, 'Future', '', 5000);

INSERT INTO public.reviews (id, card_id, due, stability, difficulty) VALUES
  (300, 1002, now() - interval '1 day', 1.0, 5.0),
  (301, 1003, now() - interval '1 hour', 1.0, 5.0),
  (302, 1004, now() + interval '7 days', 1.0, 5.0);

-- Deck 101: no caps (NULL) — unlimited.
INSERT INTO public.decks (id, title, is_public, study_config) VALUES
  (101, 'Unlimited Deck', false, '{}'::jsonb);
INSERT INTO public.cards (id, deck_id, front_text, back_text, rank) VALUES
  (1100, 101, 'A', '', 1000),
  (1101, 101, 'B', '', 2000);

-- Bob has his own deck — used to confirm RLS isolation.
SELECT tests.set_claims('22222222-2222-2222-2222-222222222222'::uuid);
INSERT INTO public.decks (id, title, is_public) VALUES (200, 'Bob Deck', false);
INSERT INTO public.cards (id, deck_id, front_text, back_text, rank) VALUES
  (2000, 200, 'Bob', '', 1000);


-- ── Act as Alice ──────────────────────────────────────────────────────────────
SELECT tests.set_claims('11111111-1111-1111-1111-111111111111'::uuid);
SET LOCAL role = 'authenticated';

-- Test 1: with no review_logs yet, due_count is clamped to max_reviews_per_day.
-- Raw due = 4 (1000, 1001, 1002, 1003), cap = 3, used = 0 → 3.
SELECT is(
  (SELECT due_count FROM public.decks_with_stats WHERE id = 100),
  3,
  'due_count clamped by max_reviews_per_day when no reviews logged today'
);

-- Test 2: reviewed_today_count is 0 before any logs.
SELECT is(
  (SELECT reviewed_today_count FROM public.decks_with_stats WHERE id = 100),
  0,
  'reviewed_today_count is 0 before any review_logs'
);

-- Test 3: NULL caps mean unlimited — due_count = raw due (2 new = both due).
SELECT is(
  (SELECT due_count FROM public.decks_with_stats WHERE id = 101),
  2,
  'due_count is uncapped when max_reviews_per_day is null'
);

-- Test 4: get_study_session_cards respects max_new_per_day = 1, then fills
-- with due review cards up to max_reviews_per_day = 3. Expected order:
-- [1 new card by rank, 2 due review cards by rank] = [1000, 1002, 1003].
SELECT results_eq(
  $$ SELECT id FROM public.get_study_session_cards(100) $$,
  $$ VALUES (1000::bigint), (1002::bigint), (1003::bigint) $$,
  'queue: 1 new card + due reviews up to total cap, ordered by rank'
);

-- Log one review event for a NEW card today (state = 0).
SET LOCAL role = 'postgres';
INSERT INTO public.review_logs (card_id, member_id, rating, state, due, review)
VALUES (1000, '11111111-1111-1111-1111-111111111111', 3, 0, now(), now());
INSERT INTO public.reviews (id, card_id, due, stability, difficulty)
VALUES (303, 1000, now() + interval '1 day', 1.0, 5.0);
SET LOCAL role = 'authenticated';
SELECT tests.set_claims('11111111-1111-1111-1111-111111111111'::uuid);

-- Test 5: reviewed_today_count = 1 after the log.
SELECT is(
  (SELECT reviewed_today_count FROM public.decks_with_stats WHERE id = 100),
  1,
  'reviewed_today_count counts logged reviews from today'
);

-- Test 6: new_reviewed_today_count = 1 (the state=0 log).
SELECT is(
  (SELECT new_reviewed_today_count FROM public.decks_with_stats WHERE id = 100),
  1,
  'new_reviewed_today_count counts state=0 logs only'
);

-- Test 7: due_count clamped by remaining budget. Raw due now = 3 (1001, 1002,
-- 1003 — 1000 has a future review). Cap budget = 3 - 1 = 2. So due_count = 2.
SELECT is(
  (SELECT due_count FROM public.decks_with_stats WHERE id = 100),
  2,
  'due_count subtracts reviewed_today from max_reviews_per_day'
);

-- Test 8: queue now skips 1000 (already reviewed today, no longer due) and
-- skips 1001 (new budget exhausted: 1 used, max 1). Returns 2 due reviews:
-- [1002, 1003] up to remaining total budget = 2.
SELECT results_eq(
  $$ SELECT id FROM public.get_study_session_cards(100) $$,
  $$ VALUES (1002::bigint), (1003::bigint) $$,
  'queue respects exhausted new-card budget and remaining total budget'
);

-- Test 9: p_study_all = true returns every card in deck regardless of caps,
-- in rank order.
SELECT results_eq(
  $$ SELECT id FROM public.get_study_session_cards(100, true) $$,
  $$ VALUES (1000::bigint), (1001::bigint), (1002::bigint), (1003::bigint), (1004::bigint) $$,
  'p_study_all bypasses caps and returns all cards in rank order'
);


-- ── Act as Bob — RLS scoping ──────────────────────────────────────────────────
SET LOCAL role = 'postgres';
SELECT tests.set_claims('22222222-2222-2222-2222-222222222222'::uuid);
SET LOCAL role = 'authenticated';

-- Test 10: Bob cannot read Alice's deck stats.
SELECT is(
  (SELECT count(*) FROM public.decks_with_stats WHERE id = 100)::int,
  0,
  'security_invoker: Bob cannot see Alice''s deck via decks_with_stats'
);

-- Test 11: Bob's RPC call against Alice's deck returns no rows (his own
-- claims scope cards/reviews — the function runs as invoker so RLS applies).
SELECT is(
  (SELECT count(*) FROM public.get_study_session_cards(100))::int,
  0,
  'security_invoker: Bob''s call to get_study_session_cards on Alice''s deck returns 0 rows'
);


SELECT * FROM finish();
ROLLBACK;
