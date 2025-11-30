import { type CardBase } from '@type/card'
import { type CardAttributes } from '@/composables/rich-text-editor'

export function sanitizeCard(card: Card): CardBase {
  return {
    id: card.id,
    deck_id: card.deck_id,
    front_text: card.front_text,
    back_text: card.back_text,
    front_delta: card.front_delta,
    back_delta: card.back_delta,
    attributes: card.attributes,
    created_at: card.created_at,
    updated_at: card.updated_at,
    rank: card.rank,
    member_id: card.member_id
  }
}

export function mergeCards(
  card1: Card,
  card2: Partial<Card>,
  { sanitize = false }: { sanitize?: boolean } = {}
) {
  const mergedAttributes = {
    ...card1.attributes,
    ...(card2.attributes ?? {})
  }

  const merged = {
    ...card1,
    ...card2,
    attributes: mergedAttributes
  }

  return {
    merged: sanitize ? sanitizeCard(merged) : merged,
    diff: hasDiff(card1, merged)
  }
}

export function hasDiff(card1: Card, card2: Card) {
  return (
    card1.front_text !== card2.front_text ||
    card1.back_text !== card2.back_text ||
    card1.front_delta !== card2.front_delta ||
    card1.back_delta !== card2.back_delta ||
    hasDiffAttributes(card1.attributes, card2.attributes)
  )
}

function hasDiffAttributes(attributes1?: CardAttributes, attributes2?: CardAttributes) {
  if (attributes1 === undefined && attributes2 === undefined) return true
  if (!attributes1 || !attributes2) return false

  return attributes1.bg_color !== attributes2.bg_color
}
