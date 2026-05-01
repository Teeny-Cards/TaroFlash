-- =============================================================================
-- get_study_session_cards: server-side study queue
-- =============================================================================
--
-- Returns the ordered cards-with-images rows to study right now for a deck:
--   1. New cards (no row in `reviews`) up to remaining `max_new_per_day`.
--   2. Due review cards filling the rest of `max_reviews_per_day`.
--
-- "Today's usage" reads from `review_logs` (UTC day boundary). Caps live in
-- the deck's `study_config` jsonb. NULL/missing cap = unlimited.
--
-- Returns SETOF public.cards_with_images so PostgREST can embed reviews via
-- the existing FK chain: callers do
--     supabase.rpc('get_study_session_cards', { p_deck_id })
--             .select('*, review:reviews(*)')
-- and get exactly the same row shape as the existing cards-page query.
-- =============================================================================

BEGIN;

CREATE OR REPLACE FUNCTION public.get_study_session_cards(
  p_deck_id    bigint,
  p_study_all  boolean DEFAULT false
)
RETURNS SETOF public.cards_with_images
LANGUAGE plpgsql
SECURITY INVOKER
STABLE
AS $$
DECLARE
  v_max_total       int;
  v_max_new         int;
  v_used_total      int;
  v_used_new        int;
  v_remaining_total int;
  v_remaining_new   int;
  v_new_available   int;
  v_new_take        int;
  v_review_take     int;
BEGIN
  -- study_all bypasses caps + due filter — return every card in rank order.
  IF p_study_all THEN
    RETURN QUERY
    SELECT cwi.*
    FROM public.cards_with_images cwi
    WHERE cwi.deck_id = p_deck_id
    ORDER BY cwi.rank;
    RETURN;
  END IF;

  -- Read caps. NULL = unlimited.
  SELECT
    (study_config->>'max_reviews_per_day')::int,
    (study_config->>'max_new_per_day')::int
  INTO v_max_total, v_max_new
  FROM public.decks
  WHERE id = p_deck_id;

  -- Today's usage: distinct cards from this deck reviewed since UTC midnight.
  SELECT
    count(DISTINCT rl.card_id)::int,
    count(DISTINCT rl.card_id) FILTER (WHERE rl.state = 0)::int
  INTO v_used_total, v_used_new
  FROM public.review_logs rl
  JOIN public.cards c ON c.id = rl.card_id
  WHERE c.deck_id = p_deck_id
    AND rl.review >= date_trunc('day', now());

  -- Remaining budget. NULL cap → sentinel large int meaning unlimited.
  v_remaining_total := GREATEST(0, COALESCE(v_max_total - v_used_total, 2147483647));
  v_remaining_new   := GREATEST(0, COALESCE(v_max_new   - v_used_new,   2147483647));

  -- How many new cards exist in this deck (no review row yet).
  SELECT count(*)::int
  INTO v_new_available
  FROM public.cards c
  LEFT JOIN public.reviews r ON r.card_id = c.id
  WHERE c.deck_id = p_deck_id
    AND r.id IS NULL;

  -- New cards drawn first; review cards fill the rest.
  v_new_take    := LEAST(v_new_available, v_remaining_new, v_remaining_total);
  v_review_take := GREATEST(0, v_remaining_total - v_new_take);

  RETURN QUERY
  WITH new_queue AS (
    SELECT c.id, 1 AS bucket, c.rank
    FROM public.cards c
    LEFT JOIN public.reviews r ON r.card_id = c.id
    WHERE c.deck_id = p_deck_id
      AND r.id IS NULL
    ORDER BY c.rank
    LIMIT v_new_take
  ),
  review_queue AS (
    SELECT c.id, 2 AS bucket, c.rank
    FROM public.cards c
    JOIN public.reviews r ON r.card_id = c.id
    WHERE c.deck_id = p_deck_id
      AND r.due <= now()
    ORDER BY c.rank
    LIMIT v_review_take
  ),
  queue AS (
    SELECT id, bucket, rank FROM new_queue
    UNION ALL
    SELECT id, bucket, rank FROM review_queue
  )
  SELECT cwi.*
  FROM public.cards_with_images cwi
  JOIN queue q ON q.id = cwi.id
  ORDER BY q.bucket, q.rank;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_study_session_cards(bigint, boolean) TO authenticated;

COMMIT;
