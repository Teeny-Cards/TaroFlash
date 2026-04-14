begin;

-- Rename the JSONB column `card_defaults` to `card_attributes` on `decks`.
-- This is a pure rename at the SQL level; values remain untouched.
-- The application layer now treats the column as `{ front: CardAttributes, back: CardAttributes }`
-- rather than a flat object. Existing rows (if any) are wrapped so the old flat
-- attributes apply to both sides — this keeps any pre-rename data visually identical.
--
-- Frontend analogue: think of this like renaming a prop and changing its shape —
-- you migrate the existing values into the new shape in the same step so nothing
-- breaks for users who already have data.

ALTER TABLE public.decks
  RENAME COLUMN card_defaults TO card_attributes;

UPDATE public.decks
SET card_attributes = jsonb_build_object('front', card_attributes, 'back', card_attributes)
WHERE card_attributes IS NOT NULL
  AND NOT (card_attributes ? 'front' AND card_attributes ? 'back');

commit;
