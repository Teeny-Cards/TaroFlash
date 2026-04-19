-- =============================================================================
-- cards_with_images: add is_duplicate column + supporting index
-- =============================================================================
--
-- The FE used to compute "is this card a duplicate?" by scanning the local
-- cards array. With server-side pagination only some cards are loaded at any
-- time, so the client can't see the full deck and would miss duplicates that
-- live on unloaded pages. We move the check into the view via a window function
-- that always partitions over the entire deck (per query, after WHERE).
--
-- Definition of duplicate:
--   A card is a duplicate iff its `front_text` is non-empty AND its
--   `back_text` is non-empty AND another card in the same deck has identical
--   `front_text` AND identical `back_text`. Partial matches (only front, only
--   back, or one side blank) do NOT count — those are legitimate variants
--   (e.g. two cards drilling the same prompt with different answers).
--
-- A composite btree index on (deck_id, front_text, back_text) backs both the
-- window-partition lookup and any future exact-match queries. Without it,
-- the window aggregate falls back to in-memory hashing, which is fine for
-- small decks but degrades on large ones.
--
-- The view is rewritten via DROP + CREATE because adding a column to a view
-- can't always be done with CREATE OR REPLACE (Postgres requires the existing
-- column list to remain a strict prefix). We re-set security_invoker = true
-- inline in CREATE so callers continue to see only their own data via RLS on
-- the underlying cards / media tables.
-- =============================================================================

BEGIN;

CREATE INDEX IF NOT EXISTS cards_deck_front_back_text_idx
  ON public.cards (deck_id, front_text, back_text);

DROP VIEW IF EXISTS public.cards_with_images;

CREATE VIEW public.cards_with_images
WITH (security_invoker = true) AS
SELECT
  c.id,
  c.created_at,
  c.updated_at,
  c.front_text,
  c.back_text,
  c.deck_id,
  c.member_id,
  c.rank,
  front.bucket AS front_image_bucket,
  front.path   AS front_image_path,
  back.bucket  AS back_image_bucket,
  back.path    AS back_image_path,
  (
    -- Both sides must be non-empty for the row to be a duplicate candidate.
    -- The window aggregate counts all cards in the same (deck_id, front_text,
    -- back_text) bucket; if more than one card lands in that bucket, every
    -- card in it is a duplicate. The query's WHERE clause (e.g. deck_id = X
    -- from the FE) is applied before the window, so this counts across the
    -- whole deck per request — pagination ranges are applied afterward via
    -- LIMIT/OFFSET and don't affect duplicate detection.
    c.front_text <> ''
    AND c.back_text <> ''
    AND COUNT(*) OVER (PARTITION BY c.deck_id, c.front_text, c.back_text) > 1
  ) AS is_duplicate
FROM public.cards c
LEFT JOIN public.media front
  ON front.card_id    = c.id
 AND front.slot       = 'card_front'::public.media_slot
 AND front.deleted_at IS NULL
LEFT JOIN public.media back
  ON back.card_id     = c.id
 AND back.slot        = 'card_back'::public.media_slot
 AND back.deleted_at  IS NULL;

COMMIT;
