import { mount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import StudyModal from '@/components/modals/study-modal/index.vue'

const mocks = vi.hoisted(() => {
  return {
    updateReviewByCardId: vi.fn()
  }
})

vi.mock('@/api/cards', () => ({
  updateReviewByCardId: mocks.updateReviewByCardId
}))

it('sets up study session with deck.cards when modal is opened', async () => {
  const cards = [{ id: '1', front_text: 'Front', back_text: 'Back' }]

  const wrapper = mount(StudyModal, {
    props: {
      open: true,
      deck: {
        title: 'Test Deck',
        cards
      }
    },
    global: {
      stubs: ['teleport']
    }
  })

  await wrapper.vm.$nextTick()

  expect(wrapper.vm.cards_in_deck).toMatchObject(cards)
  expect(wrapper.vm.current_card).toMatchObject(cards[0])
})

it('displays deck title in header', async () => {
  const wrapper = mount(StudyModal, {
    props: {
      open: true,
      deck: {
        title: 'Test Deck',
        cards: []
      }
    },
    global: {
      stubs: ['teleport']
    }
  })

  expect(wrapper.find('[data-testid="study-modal__header"]').text()).toContain('Test Deck')
})

it('updates current_card_state to revealed when revealed event is emitted', async () => {
  const wrapper = mount(StudyModal, {
    props: {
      open: true,
      deck: {
        title: 'Test Deck',
        cards: []
      }
    },
    global: {
      stubs: ['teleport']
    }
  })

  await wrapper.findComponent({ name: 'RatingButtons' }).vm.$emit('revealed')

  expect(wrapper.vm.current_card_state).toBe('revealed')
})

it('updates the card and session when reviewed event is emitted', async () => {
  const cards = [
    { id: '1', front_text: 'Front 1', back_text: 'Back 1' },
    { id: '2', front_text: 'Front 2', back_text: 'Back 2' }
  ]

  const wrapper = mount(StudyModal, {
    props: {
      open: true,
      deck: {
        title: 'Test Deck',
        cards
      }
    },
    global: {
      stubs: ['teleport']
    }
  })

  wrapper.vm.current_card_state = 'revealed'
  await wrapper.vm.$nextTick()

  const reviewOptions = wrapper.vm.active_card_review_options
  const ratingButtons = wrapper.findComponent({ name: 'RatingButtons' })
  await ratingButtons.vm.$emit('reviewed', reviewOptions?.[2])

  expect(mocks.updateReviewByCardId).toHaveBeenCalled()
  expect(wrapper.vm.current_card).toMatchObject(cards[1])
  expect(wrapper.vm.studied_card_ids.has('1')).toBe(true)
})
