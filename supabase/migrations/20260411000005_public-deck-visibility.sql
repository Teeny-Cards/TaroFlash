-- =============================================================================
-- Phase 4: Enforce is_public visibility on decks and cards
-- =============================================================================

-- Quick background on how this works:
--
--   PostgreSQL evaluates RLS USING clauses as a WHERE condition appended to
--   every query on that table. If you SELECT from cards, Postgres rewrites
--   your query to: "... AND (<USING clause>)". Subqueries inside USING are
--   fine — Postgres optimises them with the planner, and our new index on
--   decks(id, is_public) makes the correlated subquery cheap.
--
--   We need to update two tables:
--     1. decks  — the source of truth for is_public
--     2. cards  — must inherit the deck's visibility


-- -----------------------------------------------------------------------------
-- 1. Index to support the visibility subquery
--
--    When a card is read, the RLS policy does:
--      EXISTS (SELECT 1 FROM decks WHERE id = deck_id AND is_public = true)
--    Without an index this would scan the entire decks table for every card row
--    that's touched. A btree on (id, is_public) lets the planner do an index
--    scan instead — it reads exactly one row per card lookup.
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS decks_id_is_public_idx
  ON public.decks (id, is_public);


-- -----------------------------------------------------------------------------
-- 2. Decks SELECT — restrict to owner or public
--
--    The old policy let everyone (including logged-out visitors) read all decks.
--    New rule:
--      - Authenticated: see your own decks + any public deck
--      - Anonymous (anon role): see only public decks
--
--    Both conditions are combined in one USING clause. auth.uid() returns NULL
--    for anonymous users, so the first condition (uid = member_id) simply never
--    matches them — they only get public decks.
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Enable read access for all users" ON public.decks;

CREATE POLICY "Read public decks or own decks"
  ON public.decks
  FOR SELECT
  USING (
    is_public = true
    OR auth.uid() = member_id
  );


-- -----------------------------------------------------------------------------
-- 3. Cards SELECT — restrict to owner or card belongs to a public deck
--
--    We check the deck's is_public flag via a correlated subquery.
--    auth.uid() = member_id covers the owner's own cards (including private ones).
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Enable read access for all users" ON public.cards;

CREATE POLICY "Read cards from public decks or own cards"
  ON public.cards
  FOR SELECT
  USING (
    auth.uid() = member_id
    OR EXISTS (
      SELECT 1 FROM public.decks
      WHERE id = deck_id
        AND is_public = true
    )
  );
