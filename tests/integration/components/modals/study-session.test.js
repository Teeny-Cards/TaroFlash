import { mount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import StudySession from '@/components/modals/study-session/index.vue'
import { CardBuilder } from '@tests/mocks/models/card'

const mocks = vi.hoisted(() => {
  return {
    updateReviewByCardId: vi.fn()
  }
})

vi.mock('@/api/cards', () => ({
  updateReviewByCardId: mocks.updateReviewByCardId
}))

it('displays deck title in header', async () => {
  const wrapper = mount(StudySession, {
    props: {
      open: true,
      deck: {
        title: 'Test Deck',
        cards: []
      }
    }
  })

  expect(wrapper.find('[data-testid="study-session__header"]').text()).toContain('Test Deck')
})

// shows first card in hidden state when first opened
// only studys cards due today when study_all_cards is false
// studys all cards when study_all_cards is true
// retries failed cards when retry_failed_cards is true and card is due again today
// does not retry failed cards when retry_failed_cards is false
// studying a card marks it as studied and moves to next card

// HISTORY TRACK
// shows all cards in history track
// shows first card as active in history track
// shows a previously studied card in preview mode when clicked in history track
// returns to study mode when the active card is clicked in history track
// passed cards are marked in history track
// failed cards are marked in history track
// cannot preview a card that has not been studied
// tooltip shows card front text for studied/failed/active cards
// tooltip shows '?' for unstudied cards

// RATING BUTTONS
// shows reveal button when card is hidden
// shows rating options when card is revealed
// reveal button is shown and disabled when in preview mode
// emits reviewed event with rating option when rating button is clicked
// emits revealed event when reveal button is clicked

// STUDY CARD
// shows front of card and hides back when hidden
// shows back of card when revealed
