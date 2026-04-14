begin;

-- The `get_member_decks_with_due_count` RPC (used by the dashboard's review
-- inbox) returns a projection of the `decks` table. It was last recreated when
-- `cover` was renamed to `cover_config`, and never updated to include the
-- `card_attributes` column added in 20260413000001 (and renamed from
-- `card_defaults` in 20260414000001).
--
-- Because the RPC didn't return the column, decks opened from the dashboard
-- arrived at the study-session modal with `deck.card_attributes === undefined`,
-- so front/back text attributes silently fell back to defaults. Decks opened
-- from the deck-view worked because that path uses `fetchDeck(id)` with a
-- `select('*')` query.
--
-- Frontend analogue: the RPC is like a typed selector — if you don't add the
-- new field to the selector's return shape, the consumer never sees it even
-- though the column exists on the underlying "record".
--
-- Note: Postgres doesn't allow adding a column to a function's RETURNS TABLE
-- in-place; you must DROP and CREATE. DROP/CREATE is why this function has
-- been recreated whole every time it changes.

DROP FUNCTION IF EXISTS public.get_member_decks_with_due_count(uuid, timestamp with time zone);

CREATE OR REPLACE FUNCTION public.get_member_decks_with_due_count(p_member_id uuid, p_now timestamp with time zone DEFAULT now())
 RETURNS TABLE(id bigint, title text, description text, updated_at timestamp with time zone, has_image boolean, study_config jsonb, cover_config jsonb, card_attributes jsonb, total_cards integer, due_count integer)
 LANGUAGE sql
 STABLE
AS $function$
  select
    d.id,
    d.title,
    d.description,
    d.updated_at,
    d.has_image,
    d.study_config,
    d.cover_config,
    d.card_attributes,
    count(c.id)::int as total_cards,
    count(c.id) filter (where r.due is null or r.due <= p_now)::int as due_count
  from public.decks d
  left join public.cards   c on c.deck_id = d.id
  left join public.reviews r on r.card_id = c.id
  where d.member_id = p_member_id
  group by d.id, d.title, d.description, d.updated_at, d.has_image, d.study_config, d.cover_config, d.card_attributes
  order by min(d.created_at);
$function$
;

commit;
