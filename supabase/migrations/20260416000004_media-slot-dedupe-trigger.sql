-- =============================================================================
-- media slot-dedupe trigger + unique partial index
-- =============================================================================
--
-- Enforces the invariant that at most one *active* (non-soft-deleted) media
-- row exists per (card_id, slot). Previously enforced by convention in the
-- client-side setCardImage function. Moving the rule into the DB means:
--
--   1. The invariant holds regardless of which code path inserts media —
--      client, edge function, admin SQL, or a future API endpoint.
--   2. setCardImage on the FE becomes a single insert instead of three
--      coordinated operations.
--
-- Two complementary mechanisms:
--
--   - A BEFORE INSERT trigger that soft-deletes prior rows before the new
--     row lands. This is the "graceful" enforcement: callers just insert,
--     the old row gets retired automatically.
--
--   - A unique partial index as belt-and-suspenders: if any code path
--     bypasses the trigger (e.g. ALTER TRIGGER ... DISABLE) or races past
--     it, a duplicate insert fails with a unique-constraint violation
--     instead of silently producing two active rows.
--
-- BEFORE INSERT (not AFTER) is required because the unique index check
-- fires before AFTER triggers. With AFTER INSERT the second upload would
-- error on the index check before the trigger had a chance to retire the
-- first row. BEFORE INSERT runs before the check, so it can soft-delete
-- the prior row into a state where the new insert passes uniqueness.
-- =============================================================================

BEGIN;

CREATE OR REPLACE FUNCTION public.dedupe_media_slot_on_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
BEGIN
  IF NEW.card_id IS NOT NULL AND NEW.slot IS NOT NULL THEN
    UPDATE public.media
    SET deleted_at = now()
    WHERE card_id = NEW.card_id
      AND slot = NEW.slot
      AND deleted_at IS NULL;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_media_dedupe_slot
  BEFORE INSERT ON public.media
  FOR EACH ROW
  EXECUTE FUNCTION public.dedupe_media_slot_on_insert();

-- The non-unique performance index at 20260411000003 stays; this adds
-- uniqueness as the enforced invariant.
CREATE UNIQUE INDEX IF NOT EXISTS media_card_slot_active_uniq
  ON public.media (card_id, slot)
  WHERE deleted_at IS NULL AND card_id IS NOT NULL;

COMMIT;
