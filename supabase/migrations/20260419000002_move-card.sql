-- =============================================================================
-- move_card: anchor + side replacement for reorder_card
-- =============================================================================
--
-- Same shift as insert_card_at: the FE used to pass both `left` and `right`
-- neighbor IDs, which only worked when both neighbors were loaded on the
-- current page. With server pagination, the FE only knows the visible card the
-- user dropped onto (`anchor_id`) and which side they dropped it on. The
-- server resolves the missing neighbor by rank lookup.
--
-- Critical detail: when finding the missing neighbor, we EXCLUDE the moved
-- card itself from the search. Otherwise moving card X to "after A" — when X
-- already sits immediately after A — would resolve X as A's right neighbor,
-- bisect between A and X (the moved card's own old rank), and produce a
-- noisy no-op that consumes precision. Excluding the moved card means we
-- bisect against its eventual neighbor, not its current self.
--
-- The old reorder_card is dropped — no UI consumers remain after this PR.
-- =============================================================================

BEGIN;

DROP FUNCTION IF EXISTS public.reorder_card(bigint, bigint, bigint);

CREATE OR REPLACE FUNCTION public.move_card(
  p_card_id   bigint,
  p_anchor_id bigint,
  p_side      text   -- 'before' | 'after'
)
RETURNS numeric
LANGUAGE plpgsql
AS $$
DECLARE
  v_uid         uuid := auth.uid();
  v_deck_id     bigint;
  v_anchor_rank numeric;
  v_left_id     bigint;
  v_right_id    bigint;
  v_rank        numeric;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF p_card_id = p_anchor_id THEN
    RAISE EXCEPTION 'Cannot anchor a card to itself';
  END IF;

  IF p_side IS NULL OR p_side NOT IN ('before', 'after') THEN
    RAISE EXCEPTION 'Invalid side %, expected ''before'' or ''after''', p_side;
  END IF;

  -- Verify the moved card exists and capture its deck. Ownership is checked
  -- via the deck rather than the card directly so the same error surface
  -- ("Card not found or not owned by user") covers both "doesn't exist" and
  -- "exists but caller doesn't own it" — the existing pattern in this RPC
  -- family.
  SELECT public.cards.deck_id
    INTO v_deck_id
    FROM public.cards
   WHERE public.cards.id = p_card_id;

  IF v_deck_id IS NULL THEN
    RAISE EXCEPTION 'Card not found or not owned by user';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.decks
    WHERE public.decks.id = v_deck_id AND public.decks.member_id = v_uid
  ) THEN
    RAISE EXCEPTION 'Card not found or not owned by user';
  END IF;

  -- Anchor must be in the same deck as the card being moved. Cross-deck
  -- moves aren't supported by this RPC — see move_cards_to_deck for that.
  SELECT public.cards.rank
    INTO v_anchor_rank
    FROM public.cards
   WHERE public.cards.id      = p_anchor_id
     AND public.cards.deck_id = v_deck_id;

  IF v_anchor_rank IS NULL THEN
    RAISE EXCEPTION 'Anchor card % not found in deck %', p_anchor_id, v_deck_id;
  END IF;

  -- Resolve missing neighbor, excluding the moved card itself.
  IF p_side = 'after' THEN
    v_left_id := p_anchor_id;
    SELECT public.cards.id
      INTO v_right_id
      FROM public.cards
     WHERE public.cards.deck_id = v_deck_id
       AND public.cards.rank    > v_anchor_rank
       AND public.cards.id      <> p_card_id
     ORDER BY public.cards.rank ASC
     LIMIT 1;
  ELSE  -- 'before'
    v_right_id := p_anchor_id;
    SELECT public.cards.id
      INTO v_left_id
      FROM public.cards
     WHERE public.cards.deck_id = v_deck_id
       AND public.cards.rank    < v_anchor_rank
       AND public.cards.id      <> p_card_id
     ORDER BY public.cards.rank DESC
     LIMIT 1;
  END IF;

  PERFORM pg_advisory_xact_lock(v_deck_id);

  BEGIN
    v_rank := public.card_rank_between(v_deck_id, v_left_id, v_right_id);
  EXCEPTION
    WHEN SQLSTATE 'P0001' THEN
      PERFORM public.reindex_deck_ranks(v_deck_id);
      v_rank := public.card_rank_between(v_deck_id, v_left_id, v_right_id);
  END;

  UPDATE public.cards SET rank = v_rank WHERE id = p_card_id;

  RETURN v_rank;
END;
$$;

COMMIT;
