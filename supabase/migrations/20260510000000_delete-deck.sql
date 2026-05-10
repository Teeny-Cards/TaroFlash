-- =============================================================================
-- delete_deck: cascade-safe deck deletion with media tombstoning
-- =============================================================================
--
-- A plain DELETE FROM decks fails when any card in the deck has media:
-- cards cascade-delete (cards_deck_id_fkey ON DELETE CASCADE), but
-- media.card_id has no cascade — RESTRICT blocks the parent delete with
-- a 23503 FK violation.
--
-- Hard-cascading media would also be wrong: the cleanup-media edge function
-- reaps storage objects by scanning rows with deleted_at IS NOT NULL. A
-- hard-cascaded media row vanishes before the cleanup job sees it, leaving
-- the storage object orphaned forever.
--
-- Fix: tombstone all media tied to this deck (its own cover media + every
-- card's media) before deleting the deck. Setting card_id / deck_id to NULL
-- detaches them from the FK; setting deleted_at marks them for the cleanup
-- job's next sweep. The (card_id, slot) partial unique index excludes rows
-- with deleted_at IS NOT NULL OR card_id IS NULL, so no constraint trouble.
--
-- Ownership is checked once at the deck level — implies ownership of all
-- descendant cards and media by data invariants.
-- =============================================================================

BEGIN;

CREATE OR REPLACE FUNCTION public.delete_deck(p_deck_id bigint)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.decks
    WHERE public.decks.id = p_deck_id AND public.decks.member_id = v_uid
  ) THEN
    RAISE EXCEPTION 'Deck not found or not owned by user';
  END IF;

  -- Tombstone every media row tied to this deck so cleanup-media can reap
  -- the storage objects. Detach the FK columns so the deck delete below
  -- isn't blocked by media_card_id_fkey / media_deck_id_fkey.
  --
  -- Includes rows already soft-deleted: their `deleted_at` is preserved
  -- (COALESCE keeps the original tombstone time so cleanup-media's batching
  -- stays accurate), but their FK columns still need NULLing or the
  -- cascading DELETE below would trip on them.
  UPDATE public.media
     SET deleted_at = COALESCE(deleted_at, now()),
         card_id    = NULL,
         deck_id    = NULL
   WHERE deck_id = p_deck_id
      OR card_id IN (SELECT id FROM public.cards WHERE deck_id = p_deck_id);

  DELETE FROM public.decks WHERE id = p_deck_id;
END;
$$;

COMMIT;
