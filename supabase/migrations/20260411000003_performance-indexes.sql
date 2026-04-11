-- =============================================================================
-- Phase 2: Performance indexes
-- =============================================================================

-- cards(member_id) — used by get_member_card_count() and RLS checks.
-- Currently missing, so every query on "cards WHERE member_id = ?" does a full
-- table scan. A hash index is ideal here: O(1) equality lookups, no ordering.
CREATE INDEX IF NOT EXISTS cards_member_id_idx
  ON public.cards USING hash (member_id);


-- media(card_id, slot) — used by the cards_with_images view, which LEFT JOINs
-- media twice (once for card_front, once for card_back). Without this, each
-- JOIN scans the entire media table. The partial index (WHERE deleted_at IS NULL)
-- excludes soft-deleted rows, keeping it small since the view also filters those out.
CREATE INDEX IF NOT EXISTS media_card_slot_idx
  ON public.media (card_id, slot)
  WHERE deleted_at IS NULL;


-- media(member_id) — used by RLS policies and the cleanup edge function.
-- Also partial: we only ever query active (non-deleted) rows in the hot path.
CREATE INDEX IF NOT EXISTS media_member_id_idx
  ON public.media (member_id)
  WHERE deleted_at IS NULL;
