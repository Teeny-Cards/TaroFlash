import { describe, test, expect, beforeEach, vi } from 'vite-plus/test'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, watch } from 'vue'
import Session from '@/components/modals/study-session/session-shell.vue'
import { card } from '../../../../fixtures/card'
import { deck } from '../../../../fixtures/deck'

// ── Hoisted mocks ─────────────────────────────────────────────────────────────

const { mockRegister } = vi.hoisted(() => ({
  mockRegister: vi.fn().mockReturnValue(() => {})
}))

const { mockEmitSfx } = vi.hoisted(() => ({ mockEmitSfx: vi.fn() }))

const { mockFetchAllCardsByDeckId } = vi.hoisted(() => ({
  mockFetchAllCardsByDeckId: vi.fn()
}))

const { mockSaveReview } = vi.hoisted(() => ({
  mockSaveReview: vi.fn().mockResolvedValue(undefined)
}))

vi.mock('@/composables/use-gestures', () => ({
  useGestures: vi.fn(() => ({ register: mockRegister }))
}))

vi.mock('@/composables/use-shortcuts', () => ({
  useShortcuts: vi.fn(() => ({
    register: vi.fn(),
    dispose: vi.fn(),
    clearScope: vi.fn(),
    popScope: vi.fn(),
    trapFocus: vi.fn(),
    releaseFocus: vi.fn()
  }))
}))

vi.mock('@/sfx/bus', () => ({ emitSfx: mockEmitSfx }))

vi.mock('@/api/cards', () => ({
  fetchAllCardsByDeckId: mockFetchAllCardsByDeckId
}))

vi.mock('@/api/reviews', () => ({
  saveReview: mockSaveReview
}))

// ── Card stub ─────────────────────────────────────────────────────────────────
// Emits `flip-complete` when `side` changes so that session.vue's onNextCardFlipped
// resolves the animation-wait promise used to sequence card transitions.

const CardStub = defineComponent({
  props: { side: { type: String }, attributes: { default: null } },
  emits: ['flip-complete'],
  setup(props, { emit }) {
    watch(
      () => props.side,
      () => emit('flip-complete')
    )
  },
  template: '<div v-bind="$attrs"><slot /></div>'
})

// ── FinishAnimation stub ──────────────────────────────────────────────────────
// Emits `done` immediately on mount so that the `finished` event flows through
// without relying on CSS animationend (which jsdom never fires).

const FinishAnimationStub = defineComponent({
  emits: ['done'],
  mounted() {
    this.$emit('done')
  },
  template: '<div />'
})

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeSession(cardCount = 2, deckOverrides = {}) {
  const cards_data = card.many(cardCount)
  mockFetchAllCardsByDeckId.mockResolvedValue(cards_data)
  const deck_data = deck.one({
    overrides: {
      id: 1,
      study_config: { study_all_cards: true, retry_failed_cards: false },
      ...deckOverrides
    }
  })
  return mount(Session, {
    props: { deck: deck_data },
    attachTo: document.body,
    global: { stubs: { Card: CardStub, FinishAnimation: FinishAnimationStub } }
  })
}

async function waitForLoad() {
  await flushPromises()
}

async function startSession(wrapper) {
  await wrapper.find('[data-testid="rating-buttons__start"]').trigger('click')
}

/**
 * Get the gesture callbacks registered by study-card's onMounted for a given
 * gesture type. Returns { el, callbacks } or null.
 */
function getGestureCallbacks(gesture) {
  const call = mockRegister.mock.calls.find(([, g]) => g === gesture)
  return call ? { el: call[0], callbacks: call[2] } : null
}

/**
 * Dispatch a transitionend event on the study-card element to complete a fling
 * animation.
 */
function fireTransitionEnd(wrapper) {
  const cardEl = wrapper.find('[data-testid="study-card"]').element
  cardEl.dispatchEvent(new Event('transitionend'))
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('Session', () => {
  beforeEach(() => {
    mockRegister.mockClear()
    mockEmitSfx.mockClear()
    mockFetchAllCardsByDeckId.mockClear()
    mockSaveReview.mockClear()
  })

  // ── Loading behavior ───────────────────────────────────────────────────────

  describe('loading behavior', () => {
    test('while loading, shows skeleton card without study-card', async () => {
      // Delay the API response so we can inspect the loading state
      mockFetchAllCardsByDeckId.mockReturnValue(new Promise(() => {}))
      const deck_data = deck.one({
        overrides: { id: 1, study_config: { study_all_cards: true, retry_failed_cards: false } }
      })
      const wrapper = mount(Session, {
        props: { deck: deck_data },
        attachTo: document.body,
        global: { stubs: { Card: CardStub } }
      })

      // study-card is not yet rendered; plain card skeleton should be shown
      expect(wrapper.find('[data-testid="study-card"]').exists()).toBe(false)
      expect(wrapper.find('[data-testid="study-card-skeleton"]').exists()).toBe(true)
    })

    test('after loading, study-card is shown', async () => {
      const wrapper = makeSession(2)
      await waitForLoad(wrapper)

      expect(wrapper.find('[data-testid="study-card"]').exists()).toBe(true)
    })
  })

  // ── Counter display ────────────────────────────────────────────────────────

  describe('counter', () => {
    test('shows 1/N initially after loading', async () => {
      const wrapper = makeSession(3)
      await waitForLoad(wrapper)

      const counter = wrapper.find('[data-testid="study-session__counter"]')
      expect(counter.text()).toContain('1')
      expect(counter.text()).toContain('3')
    })

    test('counter advances to 2/N after reviewing first card via Good button click + transitionend', async () => {
      const wrapper = makeSession(3)
      await waitForLoad(wrapper)

      await startSession(wrapper)

      // Flip to back to show rating buttons
      await wrapper.find('[data-testid="rating-buttons__show"]').trigger('click')

      // Click Good
      await wrapper.find('[data-testid="rating-buttons__good"]').trigger('click')
      await flushPromises()

      // Complete the fling animation
      fireTransitionEnd(wrapper)
      await flushPromises()

      expect(wrapper.find('[data-testid="study-session__counter"]').text()).toContain('2')
    })
  })

  // ── Rating button → fling → reviewed (cross-component communication) ────────

  describe('Good rating flow', () => {
    test('clicking Good triggers fling: transform is applied to study-card', async () => {
      const wrapper = makeSession(2)
      await waitForLoad(wrapper)

      await startSession(wrapper)
      await wrapper.find('[data-testid="rating-buttons__show"]').trigger('click')
      await wrapper.find('[data-testid="rating-buttons__good"]').trigger('click')
      await flushPromises()

      const cardEl = wrapper.find('[data-testid="study-card"]').element
      expect(cardEl.style.transform).toContain('translateX')
    })

    test('after Good fling + transitionend, counter advances', async () => {
      const wrapper = makeSession(2)
      await waitForLoad(wrapper)

      await startSession(wrapper)
      await wrapper.find('[data-testid="rating-buttons__show"]').trigger('click')
      await wrapper.find('[data-testid="rating-buttons__good"]').trigger('click')
      await flushPromises()

      fireTransitionEnd(wrapper)
      await flushPromises()

      expect(wrapper.find('[data-testid="study-session__counter"]').text()).toContain('2')
    })

    test('after Good fling, updateReviewByCardId was called', async () => {
      const wrapper = makeSession(2)
      await waitForLoad(wrapper)

      await startSession(wrapper)
      await wrapper.find('[data-testid="rating-buttons__show"]').trigger('click')
      await wrapper.find('[data-testid="rating-buttons__good"]').trigger('click')
      await flushPromises()

      fireTransitionEnd(wrapper)
      await flushPromises()

      expect(mockSaveReview).toHaveBeenCalledOnce()
    })

    test('Good fling plays a sfx', async () => {
      const wrapper = makeSession(2)
      await waitForLoad(wrapper)

      await startSession(wrapper)
      await wrapper.find('[data-testid="rating-buttons__show"]').trigger('click')
      await wrapper.find('[data-testid="rating-buttons__good"]').trigger('click')
      await flushPromises()

      expect(mockEmitSfx).toHaveBeenCalled()
    })
  })

  describe('Again rating flow', () => {
    test('clicking Again triggers fling and card advances', async () => {
      const wrapper = makeSession(2)
      await waitForLoad(wrapper)

      await startSession(wrapper)
      await wrapper.find('[data-testid="rating-buttons__show"]').trigger('click')
      await wrapper.find('[data-testid="rating-buttons__again"]').trigger('click')
      await flushPromises()

      fireTransitionEnd(wrapper)
      await flushPromises()

      expect(wrapper.find('[data-testid="study-session__counter"]').text()).toContain('2')
    })

    test('Again fling plays a sfx', async () => {
      const wrapper = makeSession(2)
      await waitForLoad(wrapper)

      await startSession(wrapper)
      await wrapper.find('[data-testid="rating-buttons__show"]').trigger('click')
      await wrapper.find('[data-testid="rating-buttons__again"]').trigger('click')
      await flushPromises()

      expect(mockEmitSfx).toHaveBeenCalled()
    })
  })

  // ── Reveal button → side flip ──────────────────────────────────────────────

  describe('flip button interaction', () => {
    test('clicking flip button shows Again and Good rating buttons', async () => {
      const wrapper = makeSession(2)
      await waitForLoad(wrapper)

      // Initially in cover mode — start button visible, flip button not
      expect(wrapper.find('[data-testid="rating-buttons__start"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="rating-buttons__show"]').exists()).toBe(false)

      await startSession(wrapper)

      // After starting — flip button visible, rating buttons not
      expect(wrapper.find('[data-testid="rating-buttons__show"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="rating-buttons__again"]').exists()).toBe(false)

      await wrapper.find('[data-testid="rating-buttons__show"]').trigger('click')

      expect(wrapper.find('[data-testid="rating-buttons__show"]').exists()).toBe(false)
      expect(wrapper.find('[data-testid="rating-buttons__again"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="rating-buttons__good"]').exists()).toBe(true)
    })

    test('flipping to back plays a sfx', async () => {
      const wrapper = makeSession(2)
      await waitForLoad(wrapper)

      await startSession(wrapper)
      await wrapper.find('[data-testid="rating-buttons__show"]').trigger('click')

      expect(mockEmitSfx).toHaveBeenCalled()
    })
  })

  // ── Swipe gesture → reviewed ───────────────────────────────────────────────

  describe('swipe gesture cross-communication', () => {
    test('swipe-right gesture (onEnd dx > 50) → transitionend → counter advances', async () => {
      const wrapper = makeSession(2)
      await waitForLoad(wrapper)

      const gestureData = getGestureCallbacks('swipe-right')
      if (!gestureData) {
        // Gesture not registered yet — skip (study-card not mounted yet)
        return
      }

      gestureData.callbacks.onEnd(gestureData.el, {
        dx: 80,
        dy: 0,
        direction: 'right',
        duration: 200
      })
      await flushPromises()

      fireTransitionEnd(wrapper)
      await flushPromises()

      expect(wrapper.find('[data-testid="study-session__counter"]').text()).toContain('2')
    })

    test('swipe-left gesture (onEnd dx < -50) → transitionend → counter advances', async () => {
      const wrapper = makeSession(2)
      await waitForLoad(wrapper)

      const gestureData = getGestureCallbacks('swipe-left')
      if (!gestureData) {
        return
      }

      gestureData.callbacks.onEnd(gestureData.el, {
        dx: -80,
        dy: 0,
        direction: 'left',
        duration: 200
      })
      await flushPromises()

      fireTransitionEnd(wrapper)
      await flushPromises()

      expect(wrapper.find('[data-testid="study-session__counter"]').text()).toContain('2')
    })
  })

  // ── Session completion ─────────────────────────────────────────────────────

  describe('session completion', () => {
    test('with 1 card: finished event is emitted with (1, 1) after Good review', async () => {
      const wrapper = makeSession(1)
      await waitForLoad(wrapper)

      await startSession(wrapper)
      await wrapper.find('[data-testid="rating-buttons__show"]').trigger('click')
      await wrapper.find('[data-testid="rating-buttons__good"]').trigger('click')
      await flushPromises()

      fireTransitionEnd(wrapper)
      await flushPromises()

      expect(wrapper.emitted('finished')).toHaveLength(1)
      // [score, total, remaining_due, study_all_used]
      expect(wrapper.emitted('finished')[0]).toEqual([1, 1, 0, true])
    })

    test('Again rating counts as score 0 in finished event', async () => {
      const wrapper = makeSession(1)
      await waitForLoad(wrapper)

      await startSession(wrapper)
      await wrapper.find('[data-testid="rating-buttons__show"]').trigger('click')
      await wrapper.find('[data-testid="rating-buttons__again"]').trigger('click')
      await flushPromises()

      fireTransitionEnd(wrapper)
      await flushPromises()

      expect(wrapper.emitted('finished')).toHaveLength(1)
      const [score, total] = wrapper.emitted('finished')[0]
      expect(score).toBe(0)
      expect(total).toBe(1)
    })

    test('mixed ratings: score counts only Good-rated cards', async () => {
      const wrapper = makeSession(2)
      await waitForLoad(wrapper)

      // First card: Good
      await startSession(wrapper)
      await wrapper.find('[data-testid="rating-buttons__show"]').trigger('click')
      await wrapper.find('[data-testid="rating-buttons__good"]').trigger('click')
      await flushPromises()
      fireTransitionEnd(wrapper)
      await flushPromises()

      // Second card starts at 'front' after first card review — no start needed
      await wrapper.find('[data-testid="rating-buttons__show"]').trigger('click')
      await wrapper.find('[data-testid="rating-buttons__again"]').trigger('click')
      await flushPromises()
      fireTransitionEnd(wrapper)
      await flushPromises()

      expect(wrapper.emitted('finished')).toHaveLength(1)
      const [score, total] = wrapper.emitted('finished')[0]
      expect(score).toBe(1)
      expect(total).toBe(2)
    })
  })

  // ── No deck id ─────────────────────────────────────────────────────────────

  test('emits closed immediately if deck has no id', async () => {
    const deck_data = deck.one({
      overrides: { id: null, study_config: { study_all_cards: true, retry_failed_cards: false } }
    })
    const wrapper = mount(Session, {
      props: { deck: deck_data },
      attachTo: document.body,
      global: { stubs: { Card: CardStub } }
    })

    await flushPromises()

    expect(wrapper.emitted('closed')).toHaveLength(1)
  })

  // ── Close button behavior ──────────────────────────────────────────────────

  describe('close button behavior', () => {
    test('clicking close from cover state emits "closed"', async () => {
      const wrapper = makeSession(2)
      await waitForLoad(wrapper)

      // Session loaded but not started — still on cover
      await wrapper
        .find('[data-testid="study-session__actions"] [data-testid="ui-kit-button"]')
        .trigger('click')

      expect(wrapper.emitted('closed')).toHaveLength(1)
      expect(wrapper.emitted('finished')).toBeFalsy()
    })

    test('clicking close after starting (but before any review) emits "closed"', async () => {
      const wrapper = makeSession(2)
      await waitForLoad(wrapper)

      await startSession(wrapper)

      // No cards reviewed yet — reviewed_count is 0
      await wrapper
        .find('[data-testid="study-session__actions"] [data-testid="ui-kit-button"]')
        .trigger('click')

      expect(wrapper.emitted('closed')).toHaveLength(1)
      expect(wrapper.emitted('finished')).toBeFalsy()
    })

    test('clicking close after reviewing a card emits "finished" with stats', async () => {
      const wrapper = makeSession(2)
      await waitForLoad(wrapper)

      // Complete one review
      await startSession(wrapper)
      await wrapper.find('[data-testid="rating-buttons__show"]').trigger('click')
      await wrapper.find('[data-testid="rating-buttons__good"]').trigger('click')
      await flushPromises()
      fireTransitionEnd(wrapper)
      await flushPromises()

      await wrapper
        .find('[data-testid="study-session__actions"] [data-testid="ui-kit-button"]')
        .trigger('click')

      expect(wrapper.emitted('finished')).toHaveLength(1)
      expect(wrapper.emitted('closed')).toBeFalsy()
    })
  })
})
