-- =============================================================================
-- Phase 1: Security fixes
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Cards UPDATE — most critical fix
--
--    The old policy was USING (true), which let ANY authenticated user update
--    ANY card in the database. We replace it with a check that the requesting
--    user's auth ID matches the card's member_id.
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow users to update" ON public.cards;

CREATE POLICY "Users can update their own cards"
  ON public.cards
  FOR UPDATE
  TO authenticated
  USING      (auth.uid() = member_id)   -- can only target rows you own
  WITH CHECK (auth.uid() = member_id);  -- updated row must still be yours


-- -----------------------------------------------------------------------------
-- 2. Cards INSERT — tighten the check
--
--    The BEFORE INSERT trigger already stamps member_id = auth.uid(), so by the
--    time WITH CHECK runs the row is already correct. But adding the check here
--    means the policy itself is self-documenting and safe even if the trigger
--    were ever removed.
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.cards;

CREATE POLICY "Enable insert for authenticated users only"
  ON public.cards
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = member_id);


-- -----------------------------------------------------------------------------
-- 3. Decks INSERT — same reasoning as cards above
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.decks;

CREATE POLICY "Enable insert for authenticated users only"
  ON public.decks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = member_id);


-- -----------------------------------------------------------------------------
-- 4. Members INSERT — here the check IS meaningful
--
--    Unlike cards/decks (which have a trigger to set member_id), the members
--    table uses id as the primary key and it must equal auth.uid(). Without
--    this check, an attacker could insert a members row with someone else's UUID
--    and claim their identity. The trigger on auth.users handles the normal
--    signup flow, but a direct API call to the members table would bypass that.
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.members;

CREATE POLICY "Enable insert for authenticated users"
  ON public.members
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);


-- -----------------------------------------------------------------------------
-- 5. Media INSERT — same reasoning as cards/decks
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.media;

CREATE POLICY "Enable insert for authenticated users only"
  ON public.media
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = member_id);


-- -----------------------------------------------------------------------------
-- 6. Cards DELETE — minor cleanup: change TO public → TO authenticated
--
--    The old policy said TO public (meaning the rule applies to everyone,
--    including anonymous visitors). The USING clause still blocked anon users
--    in practice (auth.uid() is null, so it never matched). But it's cleaner
--    to explicitly say TO authenticated so the intent is obvious.
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.cards;

CREATE POLICY "Enable delete for users based on user_id"
  ON public.cards
  FOR DELETE
  TO authenticated
  USING (auth.uid() = member_id);


-- -----------------------------------------------------------------------------
-- 7. reserve_card() — add deck ownership check
--
--    Previously the function only checked auth.uid() != null (logged in), but
--    never verified that the caller actually owns the target deck. This meant
--    any logged-in user could insert cards into anyone else's deck by supplying
--    a foreign deck_id. We add an existence check against the decks table.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.reserve_card(
  p_deck_id        bigint,
  p_left_card_id   bigint,
  p_right_card_id  bigint
)
RETURNS TABLE(out_id bigint, out_rank numeric)
LANGUAGE plpgsql
AS $$
DECLARE
  v_rank  numeric;
  v_uid   uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Verify the caller owns the deck
  IF NOT EXISTS (
    SELECT 1 FROM public.decks
    WHERE id = p_deck_id AND member_id = v_uid
  ) THEN
    RAISE EXCEPTION 'Deck not found or not owned by user';
  END IF;

  -- Serialize within this deck to avoid rank races
  PERFORM pg_advisory_xact_lock(p_deck_id);

  BEGIN
    v_rank := public.card_rank_between(p_deck_id, p_left_card_id, p_right_card_id);
  EXCEPTION
    WHEN SQLSTATE 'P0001' THEN
      PERFORM public.reindex_deck_ranks(p_deck_id);
      v_rank := public.card_rank_between(p_deck_id, p_left_card_id, p_right_card_id);
    WHEN OTHERS THEN
      RAISE;
  END;

  INSERT INTO public.cards (member_id, deck_id, rank, front_text, back_text)
  VALUES (v_uid, p_deck_id, v_rank, '', '')
  RETURNING public.cards.id, public.cards.rank
  INTO out_id, out_rank;

  RETURN NEXT;
  RETURN;
END;
$$;
