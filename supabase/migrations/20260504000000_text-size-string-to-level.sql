-- Migrate legacy `text_size` string enums on `decks.card_attributes`
-- (front + back) to integer levels 1..10 so the FE no longer needs the
-- string-to-level fallback in text-editor.
--
-- Mapping mirrors LEGACY_LEVEL in src/components/text-editor/text-editor.vue:
--   small=1, medium=2, large=4, x-large=5, huge=6, ginormous=7

update public.decks
set card_attributes = jsonb_set(
  card_attributes,
  '{front,text_size}',
  to_jsonb(
    case card_attributes -> 'front' ->> 'text_size'
      when 'small'     then 1
      when 'medium'    then 2
      when 'large'     then 4
      when 'x-large'   then 5
      when 'huge'      then 6
      when 'ginormous' then 7
    end
  )
)
where jsonb_typeof(card_attributes -> 'front' -> 'text_size') = 'string';

update public.decks
set card_attributes = jsonb_set(
  card_attributes,
  '{back,text_size}',
  to_jsonb(
    case card_attributes -> 'back' ->> 'text_size'
      when 'small'     then 1
      when 'medium'    then 2
      when 'large'     then 4
      when 'x-large'   then 5
      when 'huge'      then 6
      when 'ginormous' then 7
    end
  )
)
where jsonb_typeof(card_attributes -> 'back' -> 'text_size') = 'string';
