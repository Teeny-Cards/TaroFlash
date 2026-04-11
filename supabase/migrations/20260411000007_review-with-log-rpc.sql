-- =============================================================================
-- RPC: save_review
--
-- Replaces the two separate writes (upsert reviews + insert review_logs) with a
-- single atomic call. "Atomic" means both writes happen in one transaction — if
-- anything fails, neither is committed. This prevents the reviews table from
-- getting out of sync with the log history.
--
-- Parameters mirror the FSRS Card and ReviewLog types from ts-fsrs exactly,
-- so the frontend can pass item.card and item.log fields directly.
-- Note: elapsed_days and last_elapsed_days from ReviewLog are intentionally
-- omitted — they are deprecated in ts-fsrs and derivable from review timestamps.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.save_review(
  -- Which card
  p_card_id           bigint,

  -- FSRS Card fields (item.card) → upserted into reviews
  p_due               timestamp with time zone,
  p_stability         real,
  p_difficulty        real,
  p_elapsed_days      smallint,
  p_scheduled_days    smallint,
  p_reps              smallint,
  p_lapses            smallint,
  p_last_review       timestamp with time zone,

  -- FSRS ReviewLog fields (item.log) → inserted into review_logs
  p_rating            smallint,
  p_state             smallint,
  p_log_due           timestamp with time zone,
  p_log_stability     real,
  p_log_difficulty    real,
  p_log_scheduled_days    smallint,
  p_review            timestamp with time zone
)
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

  -- Verify the card belongs to this user before writing anything
  IF NOT EXISTS (
    SELECT 1 FROM public.cards
    WHERE id = p_card_id AND member_id = v_uid
  ) THEN
    RAISE EXCEPTION 'Card not found or not owned by user';
  END IF;

  -- Update current FSRS state (upsert so new cards get their first review row)
  INSERT INTO public.reviews (
    card_id, member_id,
    due, stability, difficulty, elapsed_days,
    scheduled_days, reps, lapses, last_review
  )
  VALUES (
    p_card_id, v_uid,
    p_due, p_stability, p_difficulty, p_elapsed_days,
    p_scheduled_days, p_reps, p_lapses, p_last_review
  )
  ON CONFLICT (card_id) DO UPDATE SET
    due            = EXCLUDED.due,
    stability      = EXCLUDED.stability,
    difficulty     = EXCLUDED.difficulty,
    elapsed_days   = EXCLUDED.elapsed_days,
    scheduled_days = EXCLUDED.scheduled_days,
    reps           = EXCLUDED.reps,
    lapses         = EXCLUDED.lapses,
    last_review    = EXCLUDED.last_review;

  -- Append the review event to history
  INSERT INTO public.review_logs (
    card_id, member_id,
    rating, state, due,
    stability, difficulty,
    scheduled_days,
    review
  )
  VALUES (
    p_card_id, v_uid,
    p_rating, p_state, p_log_due,
    p_log_stability, p_log_difficulty,
    p_log_scheduled_days,
    p_review
  );
END;
$$;
