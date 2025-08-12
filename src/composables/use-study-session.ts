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

type StudySessionConfig = {
  study_all_cards?: boolean
}

type StudyCard = Card & { preview?: IPreview }

export function useStudySession(cards?: Card[], config?: StudySessionConfig) {
  const _PARAMS = generatorParameters({ enable_fuzz: true })
  const _FSRS_INSTANCE: FSRS = new FSRS(_PARAMS)

  const mode = ref<StudyMode>('studying')
  const current_card_state = ref<CardDisplayState>('hidden')
  const cards_in_deck = ref<StudyCard[]>(_setupCards(cards, config))
  const studied_card_ids = ref<Set<number>>(new Set())
  const failed_card_ids = ref<Set<number>>(new Set())

  const _active_card = ref<StudyCard | undefined>(undefined)
  const _preview_card = ref<StudyCard | undefined>(undefined)

  // START SETUP
  setupNextCard()
  // END SETUP

  const current_card = computed(() =>
    mode.value === 'studying' ? _active_card.value : _preview_card.value
  )

  function setPreviewCard(card: StudyCard) {
    const isStudied = studied_card_ids.value.has(card.id!)
    const isFailed = failed_card_ids.value.has(card.id!)

    if (isStudied || isFailed) {
      _preview_card.value = card
      mode.value = 'previewing'
    } else {
      _preview_card.value = undefined
      mode.value = 'studying'
    }
  }

  function setupNextCard() {
    current_card_state.value = 'hidden'

    _active_card.value = cards_in_deck.value.find(
      (c) => !studied_card_ids.value.has(c.id!) && !failed_card_ids.value.has(c.id!)
    )
  }

  function reviewCard(item: RecordLogItem) {
    _markCurrentCardStudied(item.log.rating)

    if (current_card.value?.id) {
      return updateReviewByCardId(current_card.value.id, item.card)
    }
  }

  // private methods
  function _setupCards(cards: Card[] = [], config?: StudySessionConfig): StudyCard[] {
    const now = DateTime.now()

    // Filter out cards that are not due if we are not studying all cards
    const filtered = config?.study_all_cards
      ? [...cards]
      : cards.filter((c) => !c.review?.due || DateTime.fromISO(c.review.due as string) <= now)

    // Compute the review options for each card
    return filtered.map((c) => {
      const review = c.review ?? (createEmptyCard(new Date()) as Review)
      const preview = _FSRS_INSTANCE.repeat(review, new Date())
      return { ...c, review, preview }
    })
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

  return {
    mode,
    current_card_state,
    current_card,
    cards_in_deck,
    studied_card_ids,
    failed_card_ids,
    setupNextCard,
    setPreviewCard,
    reviewCard
  }
}
