-- =============================================================================
-- decks_with_stats: add member_display_name column
--
-- PostgREST cannot embed FK-related tables on function results (the row type is
-- an anonymous record, so no FK metadata is exposed). Bake the display name
-- into the function output so callers don't need an embed or a second query.
-- =============================================================================

BEGIN;

DROP FUNCTION public.decks_with_stats(timestamptz);

CREATE FUNCTION public.decks_with_stats(p_today_start timestamptz)
RETURNS TABLE (
  id                       bigint,
  created_at               timestamptz,
  updated_at               timestamptz,
  description              text,
  is_public                boolean,
  title                    text,
  member_id                uuid,
  member_display_name      text,
  tags                     text[],
  has_image                boolean,
  study_config             jsonb,
  cover_config             jsonb,
  card_attributes          jsonb,
  card_count               int,
  reviewed_today_count     int,
  new_reviewed_today_count int,
  due_count                int
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
    m.display_name AS member_display_name,
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

  FROM public.decks d
  LEFT JOIN public.members m ON m.id = d.member_id;
$$;

GRANT EXECUTE ON FUNCTION public.decks_with_stats(timestamptz) TO authenticated;

COMMIT;
