-- =============================================================================
-- Drop deprecated deck card_count column, trigger, and list RPC
-- =============================================================================
--
-- Now that `decks_with_stats` is live and the FE reads counts through it,
-- the old trigger-maintained `decks.card_count` column and the
-- `get_member_decks_with_due_count` RPC are both dead. This migration cleans
-- them up.
--
-- Order matters:
--   1. Drop the trigger FIRST so no future inserts try to update the column.
--   2. Drop the trigger's function (nothing else calls it).
--   3. Drop the list RPC (replaced by the view + .select() from client).
--   4. Drop the column itself.
--
-- We don't touch `get_member_card_count` — it's a cross-deck aggregate
-- (total cards or due cards for a member) used by the free-tier limit check,
-- and the view can't replace it because the view is per-deck.
-- =============================================================================

BEGIN;

DROP TRIGGER IF EXISTS trg_card_insert_update_count ON public.cards;

DROP FUNCTION IF EXISTS public.update_deck_card_count();

DROP FUNCTION IF EXISTS public.get_member_decks_with_due_count(uuid, timestamp with time zone);

ALTER TABLE public.decks DROP COLUMN IF EXISTS card_count;

COMMIT;
