-- =============================================================================
-- bulk_insert_cards_in_deck: atomic bulk insert appending to deck end
-- =============================================================================
--
-- The card importer used to call `cards.upsert(...)` directly without a rank
-- column, which is what produced the NULL-rank rows the prior migration just
-- backfilled. Now that `cards.rank` is NOT NULL, that path would fail outright.
--
-- This RPC accepts a JSONB array of `{ front_text, back_text }` drafts, takes
-- a deck-scoped advisory lock, and assigns sequential ranks starting at
-- `MAX(rank) + 1000` (matching the gap convention used by reindex_deck_ranks).
-- All rows land in one transaction, so a partial import either commits all-or-
-- nothing — no half-imported decks.
--
-- Returns the inserted rows so the FE can prime its cache without a refetch.
-- =============================================================================

BEGIN;

CREATE OR REPLACE FUNCTION public.bulk_insert_cards_in_deck(
  p_deck_id bigint,
  p_cards   jsonb
)
RETURNS SETOF public.cards
LANGUAGE plpgsql
AS $$
DECLARE
  v_uid      uuid := auth.uid();
  v_max_rank numeric;
  v_step     numeric := 1000;
  v_rank     numeric;
  v_card     jsonb;
  v_inserted public.cards;
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

  -- Serialize against insert_card_at / move_card / other bulk inserts in the
  -- same deck so concurrent appends don't race for the same rank slot.
  PERFORM pg_advisory_xact_lock(p_deck_id);

  -- COALESCE handles the empty-deck case by seeding from 0 → first rank = 1000.
  SELECT COALESCE(MAX(public.cards.rank), 0)
    INTO v_max_rank
    FROM public.cards
   WHERE public.cards.deck_id = p_deck_id;

  v_rank := v_max_rank;

  FOR v_card IN SELECT * FROM jsonb_array_elements(p_cards)
  LOOP
    v_rank := v_rank + v_step;

    INSERT INTO public.cards (member_id, deck_id, rank, front_text, back_text)
    VALUES (
      v_uid,
      p_deck_id,
      v_rank,
      COALESCE(v_card->>'front_text', ''),
      COALESCE(v_card->>'back_text', '')
    )
    RETURNING * INTO v_inserted;

    RETURN NEXT v_inserted;
  END LOOP;
END;
$$;

COMMIT;
