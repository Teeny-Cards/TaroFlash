import { describe, test, expect, beforeEach, vi } from 'vite-plus/test'
import { mount, flushPromises } from '@vue/test-utils'
import { FSRS, generatorParameters, createEmptyCard, Rating } from 'ts-fsrs'
import StudyCard from '@/components/modals/study-session/study-card.vue'

// ── Hoisted mocks ─────────────────────────────────────────────────────────────

const { mockRegister } = vi.hoisted(() => ({
  mockRegister: vi.fn().mockReturnValue(() => {})
}))

const { mockEmitSfx } = vi.hoisted(() => ({ mockEmitSfx: vi.fn() }))

vi.mock('@/composables/use-gestures', () => ({
  useGestures: vi.fn(() => ({ register: mockRegister }))
}))

vi.mock('@/sfx/bus', () => ({ emitSfx: mockEmitSfx }))

// ── Card stub ─────────────────────────────────────────────────────────────────
// Passes through $attrs so data-testid="study-card" lands on the root element.

const CardStub = { template: '<div v-bind="$attrs"><slot /></div>' }

// ── FSRS options fixture ───────────────────────────────────────────────────────

function makeOptions() {
  const fsrs = new FSRS(generatorParameters({ enable_fuzz: false }))
  return fsrs.repeat(createEmptyCard(new Date()), new Date())
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function mountStudyCard(props = {}) {
  return mount(StudyCard, {
    props: { side: 'front', ...props },
    attachTo: document.body,
    global: { stubs: { Card: CardStub } }
  })
}

/**
 * Get the callbacks registered for a given gesture type.
 * Returns { el, callbacks } or null if not found.
 */
function getCallbacks(gesture) {
  const call = mockRegister.mock.calls.find(([, g]) => g === gesture)
  if (!call) return null
  return { el: call[0], callbacks: call[2] }
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('StudyCard', () => {
  let options

  beforeEach(() => {
    mockRegister.mockClear()
    mockEmitSfx.mockClear()
    options = makeOptions()
  })

  // ── Review labels ──────────────────────────────────────────────────────────

  test('pass label gets review-label--visible class when dragged right past threshold', async () => {
    const wrapper = mountStudyCard({ options })
    await flushPromises()

    const { el, callbacks } = getCallbacks('swipe-right')
    callbacks.onMove(el, { dx: 60, dy: 0 })
    await flushPromises()

    const passLabel = wrapper.find('.bg-green-400')
    expect(passLabel.classes()).toContain('review-label--visible')
  })

  test('fail label gets review-label--visible class when dragged left past threshold', async () => {
    const wrapper = mountStudyCard({ options })
    await flushPromises()

    // onMove lives on swipe-right — it handles all horizontal drag tracking
    const { el, callbacks } = getCallbacks('swipe-right')
    callbacks.onMove(el, { dx: -60, dy: 0 })
    await flushPromises()

    const failLabel = wrapper.find('.bg-pink-400')
    expect(failLabel.classes()).toContain('review-label--visible')
  })

  test('pass label is not visible below threshold', async () => {
    const wrapper = mountStudyCard({ options })
    await flushPromises()

    const { el, callbacks } = getCallbacks('swipe-right')
    callbacks.onMove(el, { dx: 30, dy: 0 })
    await flushPromises()

    const passLabel = wrapper.find('.bg-green-400')
    expect(passLabel.classes()).not.toContain('review-label--visible')
  })

  test('fail label is not visible below threshold', async () => {
    const wrapper = mountStudyCard({ options })
    await flushPromises()

    // onMove lives on swipe-right — it handles all horizontal drag tracking
    const { el, callbacks } = getCallbacks('swipe-right')
    callbacks.onMove(el, { dx: -30, dy: 0 })
    await flushPromises()

    const failLabel = wrapper.find('.bg-pink-400')
    expect(failLabel.classes()).not.toContain('review-label--visible')
  })

  // ── toggleSide ─────────────────────────────────────────────────────────────

  test('mouseup emits side-changed with toggled side when not dragging', async () => {
    const wrapper = mountStudyCard({ side: 'front', options })
    await flushPromises()

    await wrapper.find('[data-testid="study-card"]').trigger('mouseup')

    expect(wrapper.emitted('side-changed')).toHaveLength(1)
    expect(wrapper.emitted('side-changed')[0]).toEqual(['back'])
  })

  test('mouseup from back side emits side-changed with front', async () => {
    const wrapper = mountStudyCard({ side: 'back', options })
    await flushPromises()

    await wrapper.find('[data-testid="study-card"]').trigger('mouseup')

    expect(wrapper.emitted('side-changed')[0]).toEqual(['front'])
  })

  test('mouseup does not emit side-changed while dragging', async () => {
    const wrapper = mountStudyCard({ side: 'front', options })
    await flushPromises()

    // Trigger a move to set is_dragging = true
    const { el, callbacks } = getCallbacks('swipe-right')
    callbacks.onMove(el, { dx: 10, dy: 0 })
    await flushPromises()

    await wrapper.find('[data-testid="study-card"]').trigger('mouseup')

    expect(wrapper.emitted('side-changed')).toBeFalsy()
  })

  // ── rate() / fling animation ───────────────────────────────────────────────

  test('rate(Good) plays ui.music_plink_ok sfx', async () => {
    const wrapper = mountStudyCard({ side: 'back', options })
    await flushPromises()

    wrapper.vm.rate(Rating.Good)
    await flushPromises()

    expect(mockEmitSfx).toHaveBeenCalledWith('ui.music_plink_ok')
  })

  test('rate(Again) plays ui.music_plink_locancel sfx', async () => {
    const wrapper = mountStudyCard({ side: 'back', options })
    await flushPromises()

    wrapper.vm.rate(Rating.Again)
    await flushPromises()

    expect(mockEmitSfx).toHaveBeenCalledWith('ui.music_plink_locancel')
  })

  test('rate(Good) emits reviewed with the Good RecordLogItem after transitionend', async () => {
    const wrapper = mountStudyCard({ side: 'back', options })
    await flushPromises()

    wrapper.vm.rate(Rating.Good)
    await flushPromises()

    const cardEl = wrapper.find('[data-testid="study-card"]').element
    cardEl.dispatchEvent(new Event('transitionend'))
    await flushPromises()

    expect(wrapper.emitted('reviewed')).toHaveLength(1)
    expect(wrapper.emitted('reviewed')[0][0]).toEqual(options[Rating.Good])
  })

  test('rate(Again) emits reviewed with the Again RecordLogItem after transitionend', async () => {
    const wrapper = mountStudyCard({ side: 'back', options })
    await flushPromises()

    wrapper.vm.rate(Rating.Again)
    await flushPromises()

    const cardEl = wrapper.find('[data-testid="study-card"]').element
    cardEl.dispatchEvent(new Event('transitionend'))
    await flushPromises()

    expect(wrapper.emitted('reviewed')).toHaveLength(1)
    expect(wrapper.emitted('reviewed')[0][0]).toEqual(options[Rating.Again])
  })

  test('reviewed is not emitted if options prop is not passed', async () => {
    const wrapper = mountStudyCard({ side: 'back' })
    await flushPromises()

    wrapper.vm.rate(Rating.Good)
    await flushPromises()

    const cardEl = wrapper.find('[data-testid="study-card"]').element
    cardEl.dispatchEvent(new Event('transitionend'))
    await flushPromises()

    expect(wrapper.emitted('reviewed')).toBeFalsy()
  })

  // ── Zone sfx (card_offset crossing ±50) ───────────────────────────────────

  test('ui.music_plink_mid plays when card_offset crosses the +50 threshold', async () => {
    mountStudyCard({ options })
    await flushPromises()

    const { el, callbacks } = getCallbacks('swipe-right')

    // Cross into the pass zone
    callbacks.onMove(el, { dx: 60, dy: 0 })
    await flushPromises()

    expect(mockEmitSfx).toHaveBeenCalledWith('ui.music_plink_mid')
    const call_count = mockEmitSfx.mock.calls.filter((c) => c[0] === 'ui.music_plink_mid').length
    expect(call_count).toBe(1)

    // Another move within the same zone should NOT trigger the sfx again
    callbacks.onMove(el, { dx: 80, dy: 0 })
    await flushPromises()

    const call_count_after = mockEmitSfx.mock.calls.filter(
      (c) => c[0] === 'ui.music_plink_mid'
    ).length
    expect(call_count_after).toBe(1)
  })

  test('ui.music_plink_mid plays when card_offset crosses the -50 threshold', async () => {
    mountStudyCard({ options })
    await flushPromises()

    // onMove lives on swipe-right — it handles all horizontal drag tracking
    const { el, callbacks } = getCallbacks('swipe-right')

    callbacks.onMove(el, { dx: -60, dy: 0 })
    await flushPromises()

    expect(mockEmitSfx).toHaveBeenCalledWith('ui.music_plink_mid')
  })

  // ── snapBack on cancel ─────────────────────────────────────────────────────

  test('onCancel resets card transform to empty string', async () => {
    mountStudyCard({ options })
    await flushPromises()

    const { el, callbacks } = getCallbacks('swipe-right')

    // Move to set some transform
    callbacks.onMove(el, { dx: 40, dy: 0 })
    await flushPromises()

    // Cancel should snap back
    callbacks.onCancel(el)
    await flushPromises()

    // After the snap-back transition (which sets style.transform = ''), the element
    // should have its transform cleared
    expect(el.style.transform).toBe('')
  })
})
