import { ref, computed } from 'vue'
import { createEmptyCard, FSRS, generatorParameters, type IPreview } from 'ts-fsrs'
import { DateTime } from 'luxon'

export type ViewState = 'studying' | 'previewing' | 'completed'
export type CardDisplayState = 'hidden' | 'revealed'

type StudySessionConfig = {
  study_all_cards?: boolean
}

export function useStudySession() {
  const _PARAMS = generatorParameters({ enable_fuzz: true })
  const _FSRS_INSTANCE: FSRS = new FSRS(_PARAMS)

  const view_state = ref<ViewState>('studying')
  const current_card_state = ref<CardDisplayState>('hidden')
  const cards_in_deck = ref<Card[]>([])
  const studied_card_ids = ref<Set<number>>(new Set())
  const failed_card_ids = ref<Set<number>>(new Set())

  const _active_card = ref<Card | undefined>(undefined) // card that is currently being reviewed
  const _preview_card = ref<Card | undefined>(undefined) // already reviewed card that is being previewed
  const _active_card_review_options = ref<{ [key: string]: IPreview } | undefined>(undefined)

  const current_card = computed(() => {
    return view_state.value === 'studying' ? _active_card.value : _preview_card.value
  })

  const active_card_review_options = computed(() => {
    const id = _active_card.value?.id
    if (!id) return undefined

    return _active_card_review_options.value?.[id]
  })

  function setupStudySession(cards?: Card[], config?: StudySessionConfig) {
    const now = DateTime.now()
    const _cards = config?.study_all_cards
      ? cards
      : cards?.filter((c) => c.review?.due && DateTime.fromISO(c.review.due as string) <= now)

    cards_in_deck.value = _cards ?? []
    advanceSession()
  }

  function setPreviewCard(card: Card) {
    const isStudied = studied_card_ids.value.has(card.id!)
    const isFailed = failed_card_ids.value.has(card.id!)

    if (isStudied || isFailed) {
      _preview_card.value = card
      view_state.value = 'previewing'
    } else {
      _preview_card.value = undefined
      view_state.value = 'studying'
    }
  }

  function advanceSession() {
    if (current_card.value === _active_card.value && _active_card.value?.id) {
      studied_card_ids.value.add(_active_card.value.id)
    }

    const nextCard = cards_in_deck.value.find(
      (c) => !studied_card_ids.value.has(c.id!) && !failed_card_ids.value.has(c.id!)
    )

    if (nextCard && nextCard?.review === undefined) {
      nextCard.review = createEmptyCard(new Date())
    }

    _active_card.value = nextCard
    current_card_state.value = 'hidden'
    setActive_card_review_options()
  }

  function setActive_card_review_options() {
    const card = _active_card.value
    if (!card) return

    const cache = { ..._active_card_review_options.value }
    const id = card.id

    if (!id || cache[id] || !card.review) return

    cache[id] = _FSRS_INSTANCE.repeat(card.review, new Date())
    _active_card_review_options.value = cache
  }

  return {
    cards_in_deck,
    studied_card_ids,
    failed_card_ids,
    current_card_state,
    current_card,
    view_state,
    active_card_review_options,
    advanceSession,
    setupStudySession,
    setPreviewCard
  }
}
