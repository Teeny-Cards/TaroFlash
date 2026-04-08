import { ref, computed, shallowRef } from 'vue'
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

export type StudyMode = 'studying' | 'completed'
export type StudyCard = Card & { preview?: IPreview; state: ReviewState }

type ReviewState = 'failed' | 'passed' | 'unreviewed'

const defaultConfig: DeckConfig = {
  study_all_cards: false,
  retry_failed_cards: false
}

export function useStudySession(config: DeckConfig = defaultConfig) {
  const _PARAMS = generatorParameters({
    enable_fuzz: true,
    learning_steps: [],
    relearning_steps: []
  })

  const _FSRS_INSTANCE: FSRS = new FSRS(_PARAMS)
  const _cards_in_deck = shallowRef<StudyCard[]>([])
  const _retry_cards = shallowRef<StudyCard[]>([])

  const mode = ref<StudyMode>('studying')
  const current_card_side = ref<'front' | 'back'>('front')
  const active_card = shallowRef<StudyCard | undefined>(undefined)

  const cards = computed(() => {
    if (!config.retry_failed_cards) return _cards_in_deck.value

    return [..._cards_in_deck.value, ..._retry_cards.value]
  })

  const num_correct = computed(() => cards.value.filter((c) => c.state === 'passed').length)

  const current_index = computed(() => {
    if (!active_card.value) return cards.value.length
    return cards.value.findIndex((c) => c.id === active_card.value!.id)
  })

  function setCards(cards: Card[]) {
    let filtered = cards

    if (!config.study_all_cards) {
      filtered = cards.filter((c) => _isCardDue(c))
    }

    _cards_in_deck.value = filtered.map(_setupCard)
    _pickNextCard()
  }

  function _pickNextCard() {
    current_card_side.value = 'front'
    active_card.value = cards.value.find((c) => c.state === 'unreviewed')

    if (!active_card.value) {
      mode.value = 'completed'
    }
  }

  function reviewCard(item: RecordLogItem) {
    if (!active_card.value) return

    const card = active_card.value
    card.review = item.card
    _markCurrentCardStudied(item.log.rating)
    _pickNextCard()

    if (card.id) {
      return updateReviewByCardId(card.id, item.card)
    }
  }

  function _setupCard(card: Card): StudyCard {
    const review = card.review ?? (createEmptyCard(new Date()) as Review)
    const preview = _FSRS_INSTANCE.repeat(review, new Date())

    return { state: 'unreviewed', ...card, review, preview }
  }

  function _markCurrentCardStudied(rating?: Rating) {
    const card = active_card.value
    if (!card || !card.id) return

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

  function _isCardDue(card: Card) {
    if (!card.review?.due) return true

    const due = DateTime.fromISO(card.review?.due as string)
    const now = DateTime.now()

    return due <= now
  }

  return {
    mode,
    current_card_side,
    active_card,
    cards,
    num_correct,
    current_index,
    setCards,
    reviewCard
  }
}
