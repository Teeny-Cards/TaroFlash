import { computed, ref, type Ref } from 'vue'
import type { useCardsInDeckInfiniteQuery } from '@/api/cards'

export type VirtualCardList = ReturnType<typeof useVirtualCardList>

type CardsQuery = ReturnType<typeof useCardsInDeckInfiniteQuery>

type TempCardEntry = {
  card: Card
  anchor_id: number | null
  side: 'before' | 'after' | null
}

// Monotonically decreasing counter for in-memory-only cards. Negative IDs
// cannot collide with real bigserial IDs from Postgres, so `card.id < 0` is
// a reliable "not yet persisted" sentinel.
let temp_id_counter = 0
function nextTempId(): number {
  return --temp_id_counter
}

let local_key_counter = 0
function nextLocalKey(): string {
  return `lk-${++local_key_counter}`
}

export function useVirtualCardList(cards_query: CardsQuery, deck_id: Ref<number | undefined>) {
  const temp_cards = ref<TempCardEntry[]>([])

  // Stable v-for keys that survive the temp → real id transition AND the
  // cache-refetch handoff. Keyed by the card's current id; on promotion the
  // entry is migrated from the negative temp id to the real persisted id.
  const local_keys = new Map<number, string>()

  function getKey(card: Card): string | number {
    if (card.id === undefined) return Math.random()
    return local_keys.get(card.id) ?? card.id
  }

  const persisted_cards = computed<Card[]>(() => {
    return (cards_query.data.value?.pages ?? []).flat() as Card[]
  })

  // Set of promoted-temp ids. Once a temp has swapped to a real id, the same
  // id will eventually appear in the refetched persisted_cards. Dedupe on id
  // and keep the temp's instance as the canonical render source so the v-for
  // entry doesn't churn.
  const promoted_temp_ids = computed(() => {
    const set = new Set<number>()
    for (const t of temp_cards.value) {
      if (t.card.id !== undefined && t.card.id > 0) set.add(t.card.id)
    }
    return set
  })

  const all_cards = computed<Card[]>(() => {
    const persisted = persisted_cards.value.filter(
      (c) => c.id === undefined || !promoted_temp_ids.value.has(c.id)
    )
    const merged: Card[] = [...persisted]

    for (const temp of temp_cards.value) {
      if (temp.anchor_id === null) {
        merged.push(temp.card)
        continue
      }
      const idx = merged.findIndex((c) => c.id === temp.anchor_id)
      if (idx === -1) {
        merged.push(temp.card)
      } else {
        const insert_at = temp.side === 'after' ? idx + 1 : idx
        merged.splice(insert_at, 0, temp.card)
      }
    }

    return merged
  })

  function addCard(left_card_id?: number, right_card_id?: number) {
    let anchor_id: number | null = null
    let side: 'before' | 'after' | null = null

    if (left_card_id !== undefined) {
      anchor_id = left_card_id
      side = 'after'
    } else if (right_card_id !== undefined) {
      anchor_id = right_card_id
      side = 'before'
    } else {
      const last = persisted_cards.value.at(-1)
      if (last?.id !== undefined) {
        anchor_id = last.id
        side = 'after'
      }
    }

    const temp_id = nextTempId()
    local_keys.set(temp_id, nextLocalKey())

    const new_card: Card = {
      id: temp_id,
      rank: 0,
      deck_id: deck_id.value,
      front_text: '',
      back_text: ''
    }

    temp_cards.value.push({ card: new_card, anchor_id, side })
  }

  function appendCard(card_id: number) {
    addCard(card_id)
  }

  function prependCard(card_id: number) {
    addCard(undefined, card_id)
  }

  function findTemp(id: number): TempCardEntry | undefined {
    return temp_cards.value.find((t) => t.card.id === id)
  }

  function findCard(id: number): Card | undefined {
    return all_cards.value.find((c) => c.id === id)
  }

  // Migrate a temp entry from its negative id to a real persisted id. Keeps
  // the same card object reference (so any text-editor bound to it stays
  // mounted) and carries the v-for key across. The temp stays in the list so
  // the merge keeps using its instance after the cache refetch lands.
  function promoteTemp(temp_id: number, new_id: number, new_rank: number, values: Partial<Card>) {
    const temp = findTemp(temp_id)
    if (!temp) return
    const old_key = local_keys.get(temp_id) ?? nextLocalKey()
    local_keys.delete(temp_id)
    local_keys.set(new_id, old_key)
    temp.card.id = new_id
    temp.card.rank = new_rank
    Object.assign(temp.card, values)
  }

  return {
    persisted_cards,
    all_cards,
    temp_cards,
    getKey,
    addCard,
    appendCard,
    prependCard,
    findTemp,
    findCard,
    promoteTemp
  }
}
