begin;

-- Add deck-level card formatting defaults (text size, alignment)
-- Same JSONB pattern as study_config and cover_config
ALTER TABLE public.decks
  ADD COLUMN card_defaults jsonb;

-- Recreate cards_with_images view without the attributes column
DROP VIEW IF EXISTS public.cards_with_images;

CREATE VIEW public.cards_with_images AS
SELECT
  c.id,
  c.created_at,
  c.updated_at,
  c.front_text,
  c.back_text,
  c.deck_id,
  c.member_id,
  c.rank,
  front.bucket AS front_image_bucket,
  front.path AS front_image_path,
  back.bucket AS back_image_bucket,
  back.path AS back_image_path
FROM public.cards c
LEFT JOIN public.media front
  ON front.card_id = c.id
 AND front.slot = 'card_front'::public.media_slot
 AND front.deleted_at IS NULL
LEFT JOIN public.media back
  ON back.card_id = c.id
 AND back.slot = 'card_back'::public.media_slot
 AND back.deleted_at IS NULL;

-- Now safe to drop the column
ALTER TABLE public.cards
  DROP COLUMN IF EXISTS attributes;

commit;
