-- =============================================================================
-- reset_deck_reviews: wipe FSRS state + review history for one deck
-- =============================================================================
--
-- review_logs is append-only at the RLS layer (see 20260411000006_review-logs):
-- there is no DELETE policy, so direct DELETE FROM review_logs would fail for
-- the calling member. This RPC runs as SECURITY DEFINER and validates deck
-- ownership before clearing both tables, mirroring the same trust model as
-- delete_deck (one ownership check at the deck level implies ownership of
-- descendant cards / reviews / logs).
--
-- After this runs, the deck's cards have no reviews and no log history.
-- save_review's upsert recreates the per-card reviews row on the next study,
-- so callers don't need to reseed anything.
-- =============================================================================

BEGIN;

CREATE OR REPLACE FUNCTION public.reset_deck_reviews(p_deck_id bigint)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
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

  DELETE FROM public.review_logs
   WHERE card_id IN (SELECT id FROM public.cards WHERE deck_id = p_deck_id);

  DELETE FROM public.reviews
   WHERE card_id IN (SELECT id FROM public.cards WHERE deck_id = p_deck_id);
END;
$$;

COMMIT;
