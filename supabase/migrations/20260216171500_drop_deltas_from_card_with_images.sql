begin;

-- Drop and recreate to remove columns (Postgres can't "drop columns" via OR REPLACE)
drop view if exists public.card_with_images;

create view public.cards_with_images as
select
  c.id,
  c.created_at,
  c.updated_at,
  c.front_text,
  c.back_text,
  c.deck_id,
  c.member_id,
  c.rank,
  c.attributes,
  front.bucket as front_image_bucket,
  front.path as front_image_path,
  back.bucket as back_image_bucket,
  back.path as back_image_path
from public.cards c
left join public.media front
  on front.card_id = c.id
 and front.slot = 'card_front'::public.media_slot
 and front.deleted_at is null
left join public.media back
  on back.card_id = c.id
 and back.slot = 'card_back'::public.media_slot
 and back.deleted_at is null;

commit;
