import { ref, computed } from 'vue'
import { createEmptyCard, FSRS, generatorParameters, Rating, type IPreview } from 'ts-fsrs'
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

  const _active_card = ref<Card | undefined>(undefined)
  const _preview_card = ref<Card | undefined>(undefined)
  const _review_options = ref<Record<number, IPreview>>({})

  const current_card = computed(() =>
    view_state.value === 'studying' ? _active_card.value : _preview_card.value
  )

  const active_card_review_options = computed(() => {
    const id = _active_card.value?.id
    if (!id) return undefined
    return _review_options.value?.[id]
  })

  function setupStudySession(cards?: Card[], config?: StudySessionConfig) {
    cards_in_deck.value = _filterDueCards(cards, config)
  }

  function startSession() {
    advanceToNextCard()
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

  function advanceToNextCard(rating?: Rating) {
    _markCurrentCardStudied(rating)

    _active_card.value = _pickNextCard()
    current_card_state.value = 'hidden'
    _computeReviewOptionsForActiveCard()
  }

  // private methods
  function _filterDueCards(cards: Card[] = [], config?: StudySessionConfig): Card[] {
    const now = DateTime.now()
    return config?.study_all_cards
      ? [...cards]
      : cards.filter((c) => !c.review?.due || DateTime.fromISO(c.review.due as string) <= now)
  }

  function _markCurrentCardStudied(rating?: Rating) {
    const card = current_card.value
    if (!card || card !== _active_card.value || !card.id) return

    if (rating === Rating.Again) {
      failed_card_ids.value.add(card.id)
    } else {
      studied_card_ids.value.add(card.id)
    }
  }

  function _pickNextCard(): Card | undefined {
    const nextCard = cards_in_deck.value.find(
      (c) => !studied_card_ids.value.has(c.id!) && !failed_card_ids.value.has(c.id!)
    )

    if (nextCard && nextCard.review === undefined) {
      nextCard.review = createEmptyCard(new Date())
    }

    return nextCard
  }

  function _computeReviewOptionsForActiveCard() {
    const card = _active_card.value
    if (!card?.id || !card.review) return

    if (_review_options.value[card.id]) return

    _review_options.value = {
      ..._review_options.value,
      [card.id]: _FSRS_INSTANCE.repeat(card.review, new Date())
    }
  }

  return {
    // state
    view_state,
    current_card_state,
    current_card,
    cards_in_deck,
    studied_card_ids,
    failed_card_ids,
    active_card_review_options,

    // control
    setupStudySession,
    startSession,
    advanceToNextCard,
    setPreviewCard
  }
}
