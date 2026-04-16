-- =============================================================================
-- Backfill media.path to match the storage key (prepend member_id)
-- =============================================================================
--
-- Historically the FE stored `media.path` as `<card_id>/<side>/<uid>.<ext>`
-- but uploaded to storage at `<member_id>/<card_id>/<side>/<uid>.<ext>`.
-- getImageUrl() compensated by prepending the CURRENT viewer's member_id —
-- which breaks when viewing another member's public deck (viewer id ≠
-- owner id, URL 404s).
--
-- Fix: media.path should hold the full storage key. This migration
-- backfills existing rows so media.path == the actual storage location.
-- Going forward, the FE writes the full path on insert (see updated
-- setCardImage).
--
-- Scope: only card-scoped media (card_id IS NOT NULL). Deck cover images
-- use the `decks` bucket with a different path convention and aren't
-- affected.
--
-- Idempotent: skips rows whose path already starts with member_id/.
-- =============================================================================

BEGIN;

UPDATE public.media
SET path = member_id::text || '/' || path
WHERE card_id IS NOT NULL
  AND member_id IS NOT NULL
  AND path NOT LIKE member_id::text || '/%';

COMMIT;
