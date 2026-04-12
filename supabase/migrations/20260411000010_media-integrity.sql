-- =============================================================================
-- Media integrity: RLS + cascade soft-delete on deck/member deletion
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. Fix SELECT policy — restrict to owner or public deck content
--
--    The old policy was USING (true), which let any authenticated user read
--    every media row in the table. That leaks storage paths, file names, and
--    slot metadata for every other user's cards and decks.
--
--    New rule:
--      a) You own the media (member_id = your auth.uid()), OR
--      b) The media is attached to a card that lives in a public deck, OR
--      c) The media is attached to a deck that is itself public.
--
--    (b) and (c) are necessary because the card_with_images view is used when
--    browsing shared/public decks. If we locked it to owner-only, guests and
--    other members would see cards but not their images.
--
--    Note: auth.uid() returns NULL for anonymous visitors, so condition (a)
--    never matches them — they can only see media via the public-deck paths.
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Enable read access for all users" ON public.media;

CREATE POLICY "Read own media or media in public decks"
  ON public.media
  FOR SELECT
  USING (
    -- your own media
    auth.uid() = member_id

    -- media for a card in a public deck
    OR EXISTS (
      SELECT 1
      FROM public.cards c
      JOIN public.decks d ON d.id = c.deck_id
      WHERE c.id = media.card_id
        AND d.is_public = true
    )

    -- media for a deck that is itself public (e.g. cover images)
    OR EXISTS (
      SELECT 1
      FROM public.decks d
      WHERE d.id = media.deck_id
        AND d.is_public = true
    )
  );


-- -----------------------------------------------------------------------------
-- 2. Soft-delete media when a DECK is deleted
--
--    We already have a BEFORE DELETE trigger on cards that does this job for
--    card-level media. But deck-level media (rows where deck_id is set, e.g.
--    cover images) has no equivalent protection — those rows would be left
--    dangling in the database with a broken deck_id FK after the deck is gone.
--
--    This trigger fires before any deck row is physically removed. It sets
--    deleted_at on every active media row tied to that deck and NULLs out the
--    deck_id column. Nulling deck_id matters because the deck FK is NOT NULL-
--    safe on delete: once the deck row disappears, a non-null deck_id pointing
--    to it would fail the FK check. By clearing it here, we avoid that error
--    and preserve the rest of the row's data (path, bucket, member_id) so the
--    cleanup-media function can still delete the actual storage file later.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.soft_delete_media_before_deck_delete()
  RETURNS trigger
  LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.media
  SET
    deleted_at = now(),
    deck_id    = NULL
  WHERE deck_id = OLD.id
    AND deleted_at IS NULL;

  RETURN OLD;
END;
$$;

CREATE TRIGGER trg_deck_delete_soft_delete_media
  BEFORE DELETE ON public.decks
  FOR EACH ROW
  EXECUTE FUNCTION soft_delete_media_before_deck_delete();


-- -----------------------------------------------------------------------------
-- 3a. Soft-delete ALL media when a MEMBER is deleted
--
--    When a user deletes their account, the cascade chain looks like:
--
--      members → decks (ON DELETE CASCADE)
--                 └→ cards (ON DELETE CASCADE)
--                     └→ media (soft-deleted by the card trigger)
--
--    That chain catches card-level media, and our new deck trigger catches
--    deck-level media. But there's still a timing problem: the member row
--    is deleted BEFORE the cascades fire. That means the FK constraint on
--    media.member_id would reject the delete — you can't delete a members row
--    while media rows are still pointing to it.
--
--    This BEFORE DELETE trigger fires first, before any cascades touch the
--    decks/cards/media tables. It marks every media row for this member as
--    soft-deleted in one pass. By the time the cascades run and the later
--    triggers try to soft-delete subsets of that media, they're no-ops
--    (the AND deleted_at IS NULL guard skips already-deleted rows).
--
--    After this trigger completes, the member row is deleted. The card and
--    deck triggers fire during the cascade (they safely skip already-deleted
--    rows). And the media rows still have member_id set — which is critical
--    because the cleanup-media edge function uses member_id to build the
--    correct storage path ({member_id}/{path}) when removing storage files.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.soft_delete_media_before_member_delete()
  RETURNS trigger
  LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.media
  SET deleted_at = now()
  WHERE member_id = OLD.id
    AND deleted_at IS NULL;

  RETURN OLD;
END;
$$;

CREATE TRIGGER trg_member_delete_soft_delete_media
  BEFORE DELETE ON public.members
  FOR EACH ROW
  EXECUTE FUNCTION soft_delete_media_before_member_delete();


-- -----------------------------------------------------------------------------
-- 3b. Drop the member_id foreign key constraint on media
--
--    Even with the trigger above, there's still a catch: after the trigger
--    marks the media rows as deleted, PostgreSQL enforces FK constraints
--    AFTER the trigger's UPDATE — but the DELETE of the members row hasn't
--    happened yet. The FK check actually fires when the members row is
--    physically removed (at END OF STATEMENT for deferred constraints, or
--    immediately for non-deferred ones).
--
--    Our FK is non-deferred (the default), so Postgres checks it when the
--    member row is deleted. At that point, media rows still have member_id
--    pointing to the now-gone member → FK violation → DELETE fails.
--
--    The solution: drop the FK constraint on member_id entirely.
--
--    We keep the column and all the data. member_id is still:
--      - Required by RLS policies (auth.uid() = member_id)
--      - Required by the cleanup-media function (storage path construction)
--      - Stamped by the set_member_id trigger on INSERT
--    We just stop asking PostgreSQL to enforce referential integrity for it,
--    because our triggers handle the lifecycle correctly without it.
-- -----------------------------------------------------------------------------
ALTER TABLE public.media
  DROP CONSTRAINT IF EXISTS media_member_id_fkey;
