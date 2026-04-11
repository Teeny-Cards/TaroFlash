-- =============================================================================
-- Phase 3: Data model cleanup — remove orphaned columns
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Drop front_delta / back_delta from the cards table
--
--    These columns were added in 20251121164637_functions.sql for a Lexical
--    delta format that was later replaced. The view (cards_with_images) already
--    had them removed in 20260216171500_drop_deltas_from_card_with_images.sql,
--    but the underlying table columns were never dropped. They've been silently
--    taking up storage on every card row.
-- -----------------------------------------------------------------------------
ALTER TABLE public.cards DROP COLUMN IF EXISTS front_delta;
ALTER TABLE public.cards DROP COLUMN IF EXISTS back_delta;


-- -----------------------------------------------------------------------------
-- 2. Drop reviews.state
--
--    Added in 20250703003828_deck-crud.sql but never referenced in any RPC,
--    view, or API call. FSRS card state is computed from the other review
--    fields (stability, difficulty, etc.) by ts-fsrs on the client.
-- -----------------------------------------------------------------------------
ALTER TABLE public.reviews DROP COLUMN IF EXISTS state;
