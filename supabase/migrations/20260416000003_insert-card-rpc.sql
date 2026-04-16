-- =============================================================================
-- insert_card RPC
-- =============================================================================
--
-- Replaces the reserve_card workflow. Where reserve_card created an empty
-- placeholder row on the server when the user clicked "add card", insert_card
-- is only called once the user has actually typed something — so every row
-- in the cards table corresponds to a real, non-empty card.
--
-- The FE no longer computes rank. It creates cards in-memory with a negative
-- temp id, and on the first save passes the surrounding card IDs as left/
-- right neighbors. Postgres then computes the rank between them using the
-- existing card_rank_between function.
--
-- Column names `id` and `rank` on the RETURNS TABLE clash with the cards
-- table's columns, so references inside the function body are always fully
-- qualified (public.cards.id, public.decks.id, etc.) to keep the
-- variable-vs-column resolution unambiguous.
--
-- reserve_card is left in place for one release cycle so we have a rollback
-- path. A later migration drops it.
-- =============================================================================

BEGIN;

CREATE OR REPLACE FUNCTION public.insert_card(
  p_deck_id bigint,
  p_left_card_id bigint,
  p_right_card_id bigint,
  p_front_text text,
  p_back_text text
)
RETURNS TABLE(id bigint, rank numeric)
LANGUAGE plpgsql
AS $$
DECLARE
  v_rank numeric;
  v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Ownership check: caller must own the deck.
  IF NOT EXISTS (
    SELECT 1 FROM public.decks
    WHERE public.decks.id = p_deck_id AND public.decks.member_id = v_uid
  ) THEN
    RAISE EXCEPTION 'Deck not found or not owned by user';
  END IF;

  -- Serialize rank computation within this deck to avoid rank collisions
  -- if two requests land concurrently.
  PERFORM pg_advisory_xact_lock(p_deck_id);

  -- Compute the rank between the two given neighbors. If card_rank_between
  -- raises P0001 (the neighbors are too close together for further bisection),
  -- reindex the deck and retry once.
  BEGIN
    v_rank := public.card_rank_between(p_deck_id, p_left_card_id, p_right_card_id);
  EXCEPTION
    WHEN SQLSTATE 'P0001' THEN
      PERFORM public.reindex_deck_ranks(p_deck_id);
      v_rank := public.card_rank_between(p_deck_id, p_left_card_id, p_right_card_id);
  END;

  INSERT INTO public.cards (member_id, deck_id, rank, front_text, back_text)
  VALUES (
    v_uid,
    p_deck_id,
    v_rank,
    COALESCE(p_front_text, ''),
    COALESCE(p_back_text, '')
  )
  RETURNING public.cards.id, public.cards.rank
  INTO id, rank;

  RETURN NEXT;
END;
$$;

COMMIT;
