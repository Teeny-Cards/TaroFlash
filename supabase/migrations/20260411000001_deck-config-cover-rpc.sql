DROP FUNCTION IF EXISTS public.get_member_decks_with_due_count(uuid, timestamp with time zone);

CREATE OR REPLACE FUNCTION public.get_member_decks_with_due_count(p_member_id uuid, p_now timestamp with time zone DEFAULT now())
 RETURNS TABLE(id bigint, title text, description text, updated_at timestamp with time zone, has_image boolean, config jsonb, cover jsonb, total_cards integer, due_count integer)
 LANGUAGE sql
 STABLE
AS $function$
  select
    d.id,
    d.title,
    d.description,
    d.updated_at,
    d.has_image,
    d.config,
    d.cover,
    count(c.id)::int as total_cards,
    count(c.id) filter (where r.due is null or r.due <= p_now)::int as due_count
  from public.decks d
  left join public.cards   c on c.deck_id = d.id
  left join public.reviews r on r.card_id = c.id
  where d.member_id = p_member_id
  group by d.id, d.title, d.description, d.updated_at, d.has_image, d.config, d.cover
  order by min(d.created_at);
$function$
;
