-- =============================================================================
-- decks_with_stats: clamp due_count by daily caps
-- =============================================================================
--
-- The deck `study_config` jsonb may now contain:
--   max_reviews_per_day  - hard cap on total cards (new + due) surfaced today
--   max_new_per_day      - sub-cap on how many of those may be brand-new cards
--
-- This migration:
--   1. Adds `reviewed_today_count`     - distinct cards from this deck this
--                                        member already reviewed today.
--   2. Adds `new_reviewed_today_count` - of those, how many were brand-new
--                                        (FSRS state = 0 at review time).
--   3. Clamps `due_count`              - LEAST(raw_due, max_per_day - already).
--
-- "Today" = UTC day boundary (date_trunc('day', now())). Member-local
-- timezones are deferred until members.timezone exists.
-- =============================================================================

BEGIN;

DROP VIEW public.decks_with_stats;

CREATE VIEW public.decks_with_stats
WITH (security_invoker = true) AS
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

  -- Distinct cards from this deck reviewed today (any state).
  -- review_logs RLS scopes this to auth.uid() automatically (security_invoker).
  (
    SELECT count(DISTINCT rl.card_id)::int
    FROM public.review_logs rl
    JOIN public.cards c ON c.id = rl.card_id
    WHERE c.deck_id = d.id
      AND rl.review >= date_trunc('day', now())
  ) AS reviewed_today_count,

  -- Subset of the above where the card was brand-new at review time.
  -- FSRS state 0 = New; only the very first review of a card has state = 0.
  (
    SELECT count(DISTINCT rl.card_id)::int
    FROM public.review_logs rl
    JOIN public.cards c ON c.id = rl.card_id
    WHERE c.deck_id = d.id
      AND rl.state = 0
      AND rl.review >= date_trunc('day', now())
  ) AS new_reviewed_today_count,

  -- Clamped due_count: if max_reviews_per_day is set, subtract today's
  -- reviewed count from it and clamp to >= 0; otherwise unbounded.
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
                AND rl.review >= date_trunc('day', now())
            )
        )
    END
  ) AS due_count

FROM public.decks d;

COMMIT;
