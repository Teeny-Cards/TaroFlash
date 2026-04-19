-- =============================================================================
-- insert_card_at: anchor + side replacement for insert_card
-- =============================================================================
--
-- Replaces insert_card. The old function took both `left` and `right` neighbor
-- IDs and assumed the FE knew them. With server-side pagination, the FE only
-- has the cards on the currently loaded pages — when the user inserts at a page
-- boundary, the neighbor on one side lives on an unloaded page and the FE
-- can't supply it.
--
-- New shape: the FE passes the visible card the user clicked on (`anchor_id`)
-- and which side to insert on (`'before'` or `'after'`). The server resolves
-- the missing neighbor by rank lookup, then delegates to the existing
-- card_rank_between helper.
--
-- Empty-deck case: pass anchor_id = NULL. Both resolved neighbors stay NULL
-- and card_rank_between returns the seed rank (1000).
--
-- Old function is dropped — no callers remain after the FE swap in this PR.
-- =============================================================================

BEGIN;

DROP FUNCTION IF EXISTS public.insert_card(bigint, bigint, bigint, text, text);

CREATE OR REPLACE FUNCTION public.insert_card_at(
  p_deck_id    bigint,
  p_anchor_id  bigint,   -- nullable: NULL means insert into empty deck
  p_side       text,     -- 'before' | 'after' (ignored when anchor is NULL)
  p_front_text text,
  p_back_text  text
)
RETURNS TABLE(id bigint, rank numeric)
LANGUAGE plpgsql
AS $$
DECLARE
  v_uid         uuid    := auth.uid();
  v_anchor_rank numeric;
  v_left_id     bigint;
  v_right_id    bigint;
  v_rank        numeric;
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

  -- Validate side when anchor is present.
  IF p_anchor_id IS NOT NULL AND (p_side IS NULL OR p_side NOT IN ('before', 'after')) THEN
    RAISE EXCEPTION 'Invalid side %, expected ''before'' or ''after''', p_side;
  END IF;

  -- Resolve neighbors based on (anchor, side):
  --   anchor NULL  -> both neighbors stay NULL → empty-deck seed via card_rank_between
  --   side 'after' -> left  = anchor, right = next card with rank > anchor.rank
  --   side 'before'-> right = anchor, left  = next card with rank < anchor.rank
  -- A NULL on either side means "no neighbor on that side" — card_rank_between
  -- handles that as the prepend/append cases.
  IF p_anchor_id IS NOT NULL THEN
    SELECT public.cards.rank
      INTO v_anchor_rank
      FROM public.cards
     WHERE public.cards.id      = p_anchor_id
       AND public.cards.deck_id = p_deck_id;

    IF v_anchor_rank IS NULL THEN
      RAISE EXCEPTION 'Anchor card % not found in deck %', p_anchor_id, p_deck_id;
    END IF;

    IF p_side = 'after' THEN
      v_left_id := p_anchor_id;
      SELECT public.cards.id
        INTO v_right_id
        FROM public.cards
       WHERE public.cards.deck_id = p_deck_id
         AND public.cards.rank    > v_anchor_rank
       ORDER BY public.cards.rank ASC
       LIMIT 1;
    ELSE  -- 'before'
      v_right_id := p_anchor_id;
      SELECT public.cards.id
        INTO v_left_id
        FROM public.cards
       WHERE public.cards.deck_id = p_deck_id
         AND public.cards.rank    < v_anchor_rank
       ORDER BY public.cards.rank DESC
       LIMIT 1;
    END IF;
  END IF;

  -- Serialize rank computation within this deck so two concurrent inserts
  -- don't compute identical bisected ranks.
  PERFORM pg_advisory_xact_lock(p_deck_id);

  -- card_rank_between raises P0001 when bisection runs out of precision room.
  -- Reindex the deck to restore wide gaps (multiples of 1000) and retry once.
  BEGIN
    v_rank := public.card_rank_between(p_deck_id, v_left_id, v_right_id);
  EXCEPTION
    WHEN SQLSTATE 'P0001' THEN
      PERFORM public.reindex_deck_ranks(p_deck_id);
      v_rank := public.card_rank_between(p_deck_id, v_left_id, v_right_id);
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
