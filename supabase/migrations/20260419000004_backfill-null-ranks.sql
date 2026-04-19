-- =============================================================================
-- Backfill NULL ranks + lock the column to NOT NULL
-- =============================================================================
--
-- The cards.rank column has always been nullable, and some legacy rows in
-- existing decks ended up with NULL ranks (likely from an old import path
-- that didn't go through insert_card / reserve_card). NULL ranks defeat the
-- card_rank_between helper and produce confusing "Anchor not found" errors
-- from insert_card_at, which can't tell the difference between "row doesn't
-- exist" and "row exists but has no rank."
--
-- Step 1: For every deck that has at least one NULL-rank card, run
-- reindex_deck_ranks. The reindex sorts by (rank NULLS LAST, id) and assigns
-- multiples of 1000, so NULL-rank cards land at the end in id order — a
-- stable, deterministic result.
--
-- Step 2: Lock rank to NOT NULL so any future write that omits rank fails
-- loudly at the boundary instead of silently corrupting ordering. All
-- existing RPC paths (insert_card_at, reserve_card) already populate it.
-- =============================================================================

BEGIN;

DO $$
DECLARE
  d RECORD;
BEGIN
  FOR d IN
    SELECT DISTINCT deck_id
      FROM public.cards
     WHERE rank IS NULL AND deck_id IS NOT NULL
  LOOP
    PERFORM public.reindex_deck_ranks(d.deck_id);
  END LOOP;
END $$;

ALTER TABLE public.cards ALTER COLUMN rank SET NOT NULL;

COMMIT;
