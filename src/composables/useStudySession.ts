import { ref, computed } from 'vue'
import { createEmptyCard, FSRS, generatorParameters, type RecordLogItem } from 'ts-fsrs'
import { updateReviewByCardId } from '@/services/cardService'

export type ViewState = 'studying' | 'previewing' | 'completed'
export type CardDisplayState = 'hidden' | 'revealed'

export function useStudySession() {
  const _PARAMS = generatorParameters({ enable_fuzz: true })
  const _FSRS_INSTANCE: FSRS = new FSRS(_PARAMS)

  const view_state = ref<ViewState>('studying')
  const current_card_state = ref<CardDisplayState>('hidden')
  const cards_in_deck = ref<Card[]>([])
  const studied_card_ids = ref<Set<string>>(new Set())
  const failed_card_ids = ref<Set<string>>(new Set())

  const _active_card = ref<Card | undefined>(undefined) // card that is currently being reviewed
  const _preview_card = ref<Card | undefined>(undefined) // already reviewed card that is being previewed

  const last_studied_card = ref<Card | undefined>(undefined)

  const current_card = computed(() => {
    return view_state.value === 'studying' ? _active_card.value : _preview_card.value
  })

  function setupStudySession(cards?: Card[]) {
    cards_in_deck.value = cards ?? []
    advanceSession()
  }

  async function review(record: RecordLogItem) {
    if (current_card.value != _active_card.value || !_active_card.value?.id) return

    await updateReviewByCardId(_active_card.value.id, record.card)

    studied_card_ids.value.add(_active_card.value.id)
    last_studied_card.value = _active_card.value
  }

  function setPreviewCard(card: Card) {
    const isStudied = studied_card_ids.value.has(card.id!)
    const isFailed = failed_card_ids.value.has(card.id!)

    if (isStudied || isFailed) {
      _preview_card.value = card
      view_state.value = 'previewing'
    } else if (card.id === _active_card.value?.id) {
      _preview_card.value = undefined
      view_state.value = 'studying'
    }
  }

  function advanceSession() {
    const nextCard = cards_in_deck.value.find(
      (c) => !studied_card_ids.value.has(c.id!) && !failed_card_ids.value.has(c.id!)
    )

    if (nextCard && nextCard?.review === undefined) {
      nextCard.review = createEmptyCard(new Date())
    }

    _active_card.value = nextCard
    _preview_card.value = nextCard
    current_card_state.value = 'hidden'
  }

  function getActiveCardReviewOptions() {
    const review_card = _active_card.value?.review

    return review_card ? _FSRS_INSTANCE.repeat(review_card, new Date()) : undefined
  }

  return {
    cards_in_deck,
    studied_card_ids,
    failed_card_ids,
    current_card_state,
    current_card,
    view_state,
    getActiveCardReviewOptions,
    advanceSession,
    setupStudySession,
    setPreviewCard,
    review
  }
}
