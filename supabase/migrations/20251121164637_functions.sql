alter table "public"."cards" drop column "order";

alter table "public"."cards" add column "back_delta" jsonb;

alter table "public"."cards" add column "front_delta" jsonb;

alter table "public"."cards" add column "rank" numeric(20,6);

alter table "public"."decks" add column "card_count" smallint default '0'::smallint;

CREATE INDEX cards_deck_rank_idx ON public.cards USING btree (deck_id, rank);

CREATE INDEX reviews_card_id_due_member_id_idx ON public.reviews USING btree (card_id, due, member_id);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.card_rank_between(p_deck_id bigint, p_left_card_id bigint, p_right_card_id bigint)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$declare
  l_rank numeric;
  r_rank numeric;
begin
  -- Load neighbor ranks (scoped to the same deck!)
  if p_left_card_id is not null then
    select rank into l_rank
    from public.cards
    where id = p_left_card_id and deck_id = p_deck_id;
  end if;

  if p_right_card_id is not null then
    select rank into r_rank
    from public.cards
    where id = p_right_card_id and deck_id = p_deck_id;
  end if;

  -- 1) Empty deck
  if l_rank is null and r_rank is null then
    -- no cards in this deck yet → pick a starter
    return 1000; -- any positive seed works

  -- 2) Prepend (left missing)
  elsif l_rank is null then
    return r_rank - 1;

  -- 3) Append (right missing)
  elsif r_rank is null then
    return l_rank + 1;

  -- 4) Between two valid ranks
  else
    if l_rank >= r_rank then
      -- This should never happen in a healthy deck
      raise exception 'Invalid neighbor ordering: left(%) >= right(%)', l_rank, r_rank;
    end if;
    return (l_rank + r_rank) / 2.0;
  end if;
end;$function$
;

CREATE OR REPLACE FUNCTION public.get_member_card_count(p_member_id uuid, p_now timestamp with time zone DEFAULT now(), p_only_due_cards boolean DEFAULT true)
 RETURNS integer
 LANGUAGE sql
 STABLE
AS $function$
  select count(c.id)::int as card_count
  from public.cards c
  left join public.reviews r on r.card_id = c.id
  where c.member_id = p_member_id
    and (
      not p_only_due_cards
      or (r.due is null or r.due <= p_now)
    );
$function$
;

CREATE OR REPLACE FUNCTION public.get_member_decks_with_due_count(p_member_id uuid, p_now timestamp with time zone DEFAULT now())
 RETURNS TABLE(id bigint, title text, description text, updated_at timestamp with time zone, has_image boolean, total_cards integer, due_count integer)
 LANGUAGE sql
 STABLE
AS $function$
  select
    d.id,
    d.title,
    d.description,
    d.updated_at,
    d.has_image,
    count(c.id)::int as total_cards,
    count(c.id) filter (where r.due is null or r.due <= p_now)::int as due_count
  from public.decks d
  left join public.cards   c on c.deck_id = d.id
  left join public.reviews r on r.card_id = c.id
  where d.member_id = p_member_id
  group by d.id, d.title, d.description, d.updated_at, d.has_image
  order by min(d.created_at);
$function$
;

CREATE OR REPLACE FUNCTION public.reorder_card(p_card_id bigint, p_left_card_id bigint, p_right_card_id bigint)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  v_uid  uuid := auth.uid();
  v_rank numeric;
  v_deck_id bigint;
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  select deck_id into v_deck_id
  from public.cards
  where id = p_card_id and member_id = v_uid;

  -- RLS safety: ensure the card belongs to this user + deck
  if not exists (
    select 1 from public.cards
    where id = p_card_id and deck_id = v_deck_id and member_id = v_uid
  ) then
    raise exception 'Card not found or not owned by user';
  end if;

  -- serialize within this deck to avoid rank races
  perform pg_advisory_xact_lock(v_deck_id);

  begin
    v_rank := public.card_rank_between(v_deck_id, p_left_card_id, p_right_card_id);
    if v_rank is null then
      raise exception 'rank_between returned NULL';
    end if;
  exception
    when others then
      perform public.reindex_deck_ranks(v_deck_id);
      v_rank := public.card_rank_between(v_deck_id, p_left_card_id, p_right_card_id);
      if v_rank is null then
        raise exception 'rank_between returned NULL (post-reindex)';
      end if;
  end;

  update public.cards
  set rank = v_rank, updated_at = now()
  where id = p_card_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.reserve_card(p_deck_id bigint, p_left_card_id bigint, p_right_card_id bigint)
 RETURNS TABLE(out_id bigint, out_rank numeric)
 LANGUAGE plpgsql
AS $function$
declare
  v_rank numeric;
  v_uid  uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  -- serialize within this deck to avoid rank races
  perform pg_advisory_xact_lock(p_deck_id);

  -- compute rank (with one-time rebalance fallback)
  begin
    v_rank := public.card_rank_between(p_deck_id, p_left_card_id, p_right_card_id);
  exception
    when others then
      perform public.reindex_deck_ranks(p_deck_id);
      v_rank := public.card_rank_between(p_deck_id, p_left_card_id, p_right_card_id);
  end;

  -- insert placeholder and capture values into OUT vars
  insert into public.cards (member_id, deck_id, rank, front_text, back_text)
  values (v_uid, p_deck_id, v_rank, '', '')
  returning public.cards.id, public.cards.rank
  into out_id, out_rank;

  -- **emit** one row to the caller
  return next;

  -- end the function (optional in PL/pgSQL after RETURN NEXT)
  return;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.update_deck_card_count()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$declare
  target_deck_id bigint;
  card_total integer;
begin
  -- Determine which deck to update
  if tg_op = 'DELETE' then
    target_deck_id := old.deck_id;
  elsif tg_op = 'INSERT' or tg_op = 'UPDATE' then
    target_deck_id := new.deck_id;
  else
    target_deck_id := new.id;
  end if;

  -- Count the cards
  select count(*) into card_total
  from public.cards
  where deck_id = target_deck_id;

  -- Update the deck
  update public.decks
  set card_count = card_total
  where id = target_deck_id;

  return new;
end;$function$
;

CREATE TRIGGER trg_card_insert_update_count AFTER INSERT OR DELETE ON public.cards FOR EACH ROW EXECUTE FUNCTION update_deck_card_count();


