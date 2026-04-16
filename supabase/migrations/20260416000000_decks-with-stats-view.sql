-- =============================================================================
-- decks_with_stats view
-- =============================================================================
--
-- Replaces two things at once:
--   1. The `get_member_decks_with_due_count(uuid, timestamptz)` RPC — used by
--      `fetchMemberDecks()` to list decks on the dashboard.
--   2. The `decks.card_count` column (populated by a trigger) — used by
--      `fetchDeck()` for the single-deck card count.
--
-- By exposing both `card_count` and `due_count` as computed-at-read columns on
-- a view, we get one shape that serves both reads, and the FE can stop
-- coordinating two different state representations.
-- =============================================================================

BEGIN;

-- Columns are listed explicitly rather than via `d.*` because the decks
-- table still has a (soon-to-be-dropped) `card_count` smallint column
-- maintained by the old trigger. `d.*` would expand to include it and
-- collide with the computed column of the same name. Once Phase 2.2 drops
-- the column, the view can be recreated with `d.*`.
CREATE OR REPLACE VIEW public.decks_with_stats
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
  (
    SELECT count(*)::int
    FROM public.cards c
    LEFT JOIN public.reviews r ON r.card_id = c.id
    WHERE c.deck_id = d.id
      AND (r.due IS NULL OR r.due <= now())
  ) AS due_count
FROM public.decks d;

COMMIT;
