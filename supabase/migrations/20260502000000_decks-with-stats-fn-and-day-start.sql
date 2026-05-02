-- =============================================================================
-- decks_with_stats: replace view with a parameterized function
-- get_study_session_cards: accept p_today_start
--
-- Both endpoints now take the caller's local day start as a timestamptz so
-- daily caps stay correct regardless of the user's timezone (and survive
-- travel between zones). The FE computes 00:00 local, serialises as ISO,
-- and passes it in. BE just compares.
-- =============================================================================

BEGIN;

DROP VIEW public.decks_with_stats;

CREATE OR REPLACE FUNCTION public.decks_with_stats(p_today_start timestamptz)
RETURNS TABLE (
  id              bigint,
  created_at      timestamptz,
  updated_at      timestamptz,
  description     text,
  is_public       boolean,
  title           text,
  member_id       uuid,
  tags            text[],
  has_image       boolean,
  study_config    jsonb,
  cover_config    jsonb,
  card_attributes jsonb,
  card_count                int,
  reviewed_today_count      int,
  new_reviewed_today_count  int,
  due_count                 int
)
LANGUAGE sql
SECURITY INVOKER
STABLE
AS $$
  SELECT
    d.id,
    d.created_at,
    d.updated_at,
    d.description,
    d.is_public,
    d.title,
    d.member_id,
    d.tags,
    d.has_image,
    d.study_config,
    d.cover_config,
    d.card_attributes,

    (
      SELECT count(*)::int
      FROM public.cards c
      WHERE c.deck_id = d.id
    ) AS card_count,

    (
      SELECT count(DISTINCT rl.card_id)::int
      FROM public.review_logs rl
      JOIN public.cards c ON c.id = rl.card_id
      WHERE c.deck_id = d.id
        AND rl.review >= p_today_start
    ) AS reviewed_today_count,

    (
      SELECT count(DISTINCT rl.card_id)::int
      FROM public.review_logs rl
      JOIN public.cards c ON c.id = rl.card_id
      WHERE c.deck_id = d.id
        AND rl.state = 0
        AND rl.review >= p_today_start
    ) AS new_reviewed_today_count,

    GREATEST(
      0,
      CASE
        WHEN (d.study_config->>'max_reviews_per_day') IS NULL THEN
          (
            SELECT count(*)::int
            FROM public.cards c
            LEFT JOIN public.reviews r ON r.card_id = c.id
            WHERE c.deck_id = d.id
              AND (r.due IS NULL OR r.due <= now())
          )
        ELSE
          LEAST(
            (
              SELECT count(*)::int
              FROM public.cards c
              LEFT JOIN public.reviews r ON r.card_id = c.id
              WHERE c.deck_id = d.id
                AND (r.due IS NULL OR r.due <= now())
            ),
            (d.study_config->>'max_reviews_per_day')::int
              - (
                SELECT count(DISTINCT rl.card_id)::int
                FROM public.review_logs rl
                JOIN public.cards c ON c.id = rl.card_id
                WHERE c.deck_id = d.id
                  AND rl.review >= p_today_start
              )
          )
      END
    ) AS due_count

  FROM public.decks d;
$$;

GRANT EXECUTE ON FUNCTION public.decks_with_stats(timestamptz) TO authenticated;


-- ── get_study_session_cards: accept p_today_start ────────────────────────────
DROP FUNCTION IF EXISTS public.get_study_session_cards(bigint, boolean);

CREATE OR REPLACE FUNCTION public.get_study_session_cards(
  p_deck_id      bigint,
  p_today_start  timestamptz,
  p_study_all    boolean DEFAULT false
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
  IF p_study_all THEN
    RETURN QUERY
    SELECT cwi.*
    FROM public.cards_with_images cwi
    WHERE cwi.deck_id = p_deck_id
    ORDER BY cwi.rank;
    RETURN;
  END IF;

  SELECT
    (study_config->>'max_reviews_per_day')::int,
    (study_config->>'max_new_per_day')::int
  INTO v_max_total, v_max_new
  FROM public.decks
  WHERE id = p_deck_id;

  SELECT
    count(DISTINCT rl.card_id)::int,
    count(DISTINCT rl.card_id) FILTER (WHERE rl.state = 0)::int
  INTO v_used_total, v_used_new
  FROM public.review_logs rl
  JOIN public.cards c ON c.id = rl.card_id
  WHERE c.deck_id = p_deck_id
    AND rl.review >= p_today_start;

  v_remaining_total := GREATEST(0, COALESCE(v_max_total - v_used_total, 2147483647));
  v_remaining_new   := GREATEST(0, COALESCE(v_max_new   - v_used_new,   2147483647));

  SELECT count(*)::int
  INTO v_new_available
  FROM public.cards c
  LEFT JOIN public.reviews r ON r.card_id = c.id
  WHERE c.deck_id = p_deck_id
    AND r.id IS NULL;

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

GRANT EXECUTE ON FUNCTION public.get_study_session_cards(bigint, timestamptz, boolean) TO authenticated;

COMMIT;
