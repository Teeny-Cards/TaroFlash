-- =============================================================================
-- Restore reviews.state
--
-- This column was dropped in 20260411000004_cleanup.sql under the incorrect
-- assumption that ts-fsrs could derive state from other fields. It cannot —
-- state is a required input to FSRS.repeat() and FSRS.next().
--
-- State enum (mirrors ts-fsrs State):
--   0 = New, 1 = Learning, 2 = Review, 3 = Relearning
--
-- Existing rows all represent cards that have been reviewed at least once,
-- so DEFAULT 2 (Review) is the correct backfill value.
-- =============================================================================

ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS state smallint NOT NULL DEFAULT 2;


-- =============================================================================
-- Update save_review RPC to accept and write card state.
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
  p_card_state        smallint,

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
    scheduled_days, reps, lapses, last_review, state
  )
  VALUES (
    p_card_id, v_uid,
    p_due, p_stability, p_difficulty, p_elapsed_days,
    p_scheduled_days, p_reps, p_lapses, p_last_review, p_card_state
  )
  ON CONFLICT (card_id) DO UPDATE SET
    due            = EXCLUDED.due,
    stability      = EXCLUDED.stability,
    difficulty     = EXCLUDED.difficulty,
    elapsed_days   = EXCLUDED.elapsed_days,
    scheduled_days = EXCLUDED.scheduled_days,
    reps           = EXCLUDED.reps,
    lapses         = EXCLUDED.lapses,
    last_review    = EXCLUDED.last_review,
    state          = EXCLUDED.state;

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
