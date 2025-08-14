import { ref, computed } from 'vue'
import {
  createEmptyCard,
  FSRS,
  generatorParameters,
  Rating,
  type IPreview,
  type RecordLogItem
} from 'ts-fsrs'
import { DateTime } from 'luxon'
import { updateReviewByCardId } from '@/api/reviews'

export type StudyMode = 'studying' | 'previewing' | 'completed'
export type CardDisplayState = 'hidden' | 'revealed'
export type StudyCard = Card & { preview?: IPreview; state: ReviewState }

type ReviewState = 'failed' | 'passed' | 'unreviewed'

const defaultConfig: DeckConfig = {
  study_all_cards: true,
  retry_failed_cards: true
}

export function useStudySession(config: DeckConfig = defaultConfig) {
  const _PARAMS = generatorParameters({ enable_fuzz: true })
  const _FSRS_INSTANCE: FSRS = new FSRS(_PARAMS)
  const _cards_in_deck = ref<StudyCard[]>([])
  const _retry_cards = ref<StudyCard[]>([])

  const mode = ref<StudyMode>('studying')
  const current_card_state = ref<CardDisplayState>('hidden')

  const active_card = ref<StudyCard | undefined>(undefined)
  const preview_card = ref<StudyCard | undefined>(undefined)

  const current_card = computed(() =>
    mode.value === 'studying' ? active_card.value : preview_card.value
  )

  const cards = computed(() => {
    if (!config.retry_failed_cards) return _cards_in_deck.value

    return [..._cards_in_deck.value, ..._retry_cards.value]
  })

  function setup(cards?: Card[]) {
    _cards_in_deck.value = _setupCards(cards)
    pickNextCard()
  }

  function setPreviewCard(card: StudyCard) {
    if (card.state !== 'unreviewed') {
      preview_card.value = card
      mode.value = 'previewing'
    } else {
      preview_card.value = undefined
      mode.value = 'studying'
    }
  }

  function pickNextCard() {
    current_card_state.value = 'hidden'
    active_card.value = cards.value.find((c) => c.state === 'unreviewed')
  }

  function reviewCard(item: RecordLogItem) {
    if (!current_card.value) return

    current_card.value.review = item.card
    _markCurrentCardStudied(item.log.rating)

    if (current_card.value?.id) {
      return updateReviewByCardId(current_card.value.id, item.card)
    }
  }

  // private methods
  function _setupCards(cards: Card[] = []): StudyCard[] {
    const now = DateTime.now()

    // Filter out cards that are not due if we are not studying all cards
    const filtered = config.study_all_cards
      ? cards
      : cards.filter(
          (c) =>
            !c.review?.due ||
            DateTime.fromISO(c.review.due as string).startOf('day') <= now.startOf('day')
        )

    // Compute the review options for each card
    return filtered.map(_setupCard)
  }

  function _setupCard(card: Card): StudyCard {
    const review = card.review ?? (createEmptyCard(new Date()) as Review)
    const preview = _FSRS_INSTANCE.repeat(review, new Date())

    return { state: 'unreviewed', ...card, review, preview }
  }

  function _markCurrentCardStudied(rating?: Rating) {
    const card = current_card.value
    if (!card || card !== active_card.value || !card.id) return

    if (rating === Rating.Again) {
      card.state = 'failed'
      _retryCard(card)
    } else {
      card.state = 'passed'
    }
  }

  function _retryCard(card: StudyCard) {
    if (!config.retry_failed_cards) return

    const due_today = DateTime.fromISO(card.review?.due as string).hasSame(DateTime.now(), 'day')
    if (!due_today) return

    const retry_card = _setupCard(card)
    _retry_cards.value.push(retry_card)
  }

  return {
    mode,
    current_card_state,
    current_card,
    active_card,
    preview_card,
    cards,
    setup,
    pickNextCard,
    setPreviewCard,
    reviewCard
  }
}
