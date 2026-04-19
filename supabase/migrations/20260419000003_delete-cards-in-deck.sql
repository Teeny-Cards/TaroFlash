-- =============================================================================
-- delete_cards_in_deck: bulk delete supporting select-all mode
-- =============================================================================
--
-- Backs the FE's "select all then delete" flow without sending the full ID
-- list over the wire. The FE passes the deck and (optionally) a small array
-- of IDs that should be EXCLUDED from deletion — i.e. the cards the user
-- deselected after hitting select-all.
--
-- Two equivalent ways to express "delete every card except these":
--   • NULL p_except_ids       → delete every card in the deck (no exceptions)
--   • empty array p_except_ids → same as NULL (no exceptions)
--   • non-empty array         → delete every card whose id isn't in the array
--
-- The positive-selection delete path ("delete these specific IDs") still goes
-- through the existing PostgREST DELETE ... IN (...) call — RLS on the cards
-- table already enforces ownership, no RPC needed for that case.
--
-- Ownership is checked once at the deck level here. If the caller doesn't
-- own the deck we refuse before issuing the DELETE, so the function never
-- emits partial deletions across mixed-ownership data.
-- =============================================================================

BEGIN;

CREATE OR REPLACE FUNCTION public.delete_cards_in_deck(
  p_deck_id    bigint,
  p_except_ids bigint[]
)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  v_uid           uuid := auth.uid();
  v_deleted_count integer;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Ownership check on the deck — implies ownership of all cards in it
  -- (cards.member_id is enforced equal to decks.member_id by the RLS policy
  -- on insert / by data invariants).
  IF NOT EXISTS (
    SELECT 1 FROM public.decks
    WHERE public.decks.id = p_deck_id AND public.decks.member_id = v_uid
  ) THEN
    RAISE EXCEPTION 'Deck not found or not owned by user';
  END IF;

  -- Guard the NULL case explicitly: `id <> ALL(NULL)` evaluates to NULL,
  -- which falls out of the WHERE filter and would skip every row. Treating
  -- NULL the same as "no exceptions" matches the intuitive call shape.
  DELETE FROM public.cards
   WHERE public.cards.deck_id = p_deck_id
     AND (p_except_ids IS NULL OR public.cards.id <> ALL(p_except_ids));

  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  RETURN v_deleted_count;
END;
$$;

COMMIT;
