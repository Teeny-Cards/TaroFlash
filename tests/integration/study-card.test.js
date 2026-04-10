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

vi.mock('@/composables/use-shortcuts', () => ({
  useShortcuts: vi.fn(() => ({ register: vi.fn(), dispose: vi.fn(), clearScope: vi.fn() }))
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
 * Get the element and callbacks from the single drag registration.
 * Returns { el, callbacks } or null if not yet registered.
 */
function getCallbacks() {
  const call = mockRegister.mock.calls[0]
  if (!call) return null
  return { el: call[0], callbacks: call[1] }
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

    const { el, callbacks } = getCallbacks()
    callbacks.onMove({ dx: 60, dy: 0 })
    await flushPromises()

    const passLabel = wrapper.find('[data-testid="review-label--pass"]')
    expect(passLabel.classes()).toContain('review-label--visible')
  })

  test('fail label gets review-label--visible class when dragged left past threshold', async () => {
    const wrapper = mountStudyCard({ options })
    await flushPromises()

const { el, callbacks } = getCallbacks()
    callbacks.onMove({ dx: -60, dy: 0 })
    await flushPromises()

    const failLabel = wrapper.find('[data-testid="review-label--fail"]')
    expect(failLabel.classes()).toContain('review-label--visible')
  })

  test('pass label is not visible below threshold', async () => {
    const wrapper = mountStudyCard({ options })
    await flushPromises()

    const { el, callbacks } = getCallbacks()
    callbacks.onMove({ dx: 30, dy: 0 })
    await flushPromises()

    const passLabel = wrapper.find('[data-testid="review-label--pass"]')
    expect(passLabel.classes()).not.toContain('review-label--visible')
  })

  test('fail label is not visible below threshold', async () => {
    const wrapper = mountStudyCard({ options })
    await flushPromises()

const { el, callbacks } = getCallbacks()
    callbacks.onMove({ dx: -30, dy: 0 })
    await flushPromises()

    const failLabel = wrapper.find('[data-testid="review-label--fail"]')
    expect(failLabel.classes()).not.toContain('review-label--visible')
  })

  // ── onCardClick ────────────────────────────────────────────────────────────

  test('mouseup emits side-changed when not dragging (front side)', async () => {
    const wrapper = mountStudyCard({ side: 'front', options })
    await flushPromises()

    await wrapper.find('[data-testid="study-card"]').trigger('mouseup')

    expect(wrapper.emitted('side-changed')).toHaveLength(1)
  })

  test('mouseup emits side-changed when not dragging (back side)', async () => {
    const wrapper = mountStudyCard({ side: 'back', options })
    await flushPromises()

    await wrapper.find('[data-testid="study-card"]').trigger('mouseup')

    expect(wrapper.emitted('side-changed')).toHaveLength(1)
  })

  test('mouseup does not emit side-changed while dragging', async () => {
    const wrapper = mountStudyCard({ side: 'front', options })
    await flushPromises()

    // is_dragging requires Math.abs(dx) > FLIP_THRESHOLD (10), so use dx=20
    const { el, callbacks } = getCallbacks()
    callbacks.onMove({ dx: 20, dy: 0 })
    await flushPromises()

    await wrapper.find('[data-testid="study-card"]').trigger('mouseup')

    expect(wrapper.emitted('side-changed')).toBeFalsy()
  })

  test('mouseup on cover side emits "started" instead of side-changed', async () => {
    const wrapper = mountStudyCard({ side: 'cover', options })
    await flushPromises()

    await wrapper.find('[data-testid="study-card"]').trigger('mouseup')

    expect(wrapper.emitted('started')).toHaveLength(1)
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

  test('rate(Again) plays a sfx', async () => {
    const wrapper = mountStudyCard({ side: 'back', options })
    await flushPromises()

    wrapper.vm.rate(Rating.Again)
    await flushPromises()

    expect(mockEmitSfx).toHaveBeenCalled()
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

  test('reviewed is emitted even when options prop is not passed', async () => {
    const wrapper = mountStudyCard({ side: 'back' })
    await flushPromises()

    wrapper.vm.rate(Rating.Good)
    await flushPromises()

    const cardEl = wrapper.find('[data-testid="study-card"]').element
    cardEl.dispatchEvent(new Event('transitionend'))
    await flushPromises()

    expect(wrapper.emitted('reviewed')).toHaveLength(1)
    expect(wrapper.emitted('reviewed')[0][0]).toBeUndefined()
  })

  // ── Zone sfx (card_offset crossing ±50) ───────────────────────────────────

  test('ui.music_plink_mid plays when card_offset crosses the +50 threshold', async () => {
    mountStudyCard({ options })
    await flushPromises()

    const { el, callbacks } = getCallbacks()

    // Cross into the pass zone
    callbacks.onMove({ dx: 60, dy: 0 })
    await flushPromises()

    expect(mockEmitSfx).toHaveBeenCalledWith('ui.music_plink_mid')
    const call_count = mockEmitSfx.mock.calls.filter((c) => c[0] === 'ui.music_plink_mid').length
    expect(call_count).toBe(1)

    // Another move within the same zone should NOT trigger the sfx again
    callbacks.onMove({ dx: 80, dy: 0 })
    await flushPromises()

    const call_count_after = mockEmitSfx.mock.calls.filter(
      (c) => c[0] === 'ui.music_plink_mid'
    ).length
    expect(call_count_after).toBe(1)
  })

  test('ui.music_plink_mid plays when card_offset crosses the -50 threshold', async () => {
    mountStudyCard({ options })
    await flushPromises()

const { el, callbacks } = getCallbacks()

    callbacks.onMove({ dx: -60, dy: 0 })
    await flushPromises()

    expect(mockEmitSfx).toHaveBeenCalledWith('ui.music_plink_mid')
  })

  // ── cover side: gestures and rate() are no-ops ────────────────────────────

  test('rate() does not emit reviewed when side is cover', async () => {
    const wrapper = mountStudyCard({ side: 'cover', options })
    await flushPromises()

    wrapper.vm.rate(Rating.Good)
    await flushPromises()

    expect(wrapper.emitted('reviewed')).toBeFalsy()
  })

  test('drag does not move card when side is cover', async () => {
    mountStudyCard({ side: 'cover', options })
    await flushPromises()

    const { el, callbacks } = getCallbacks()
    callbacks.onMove({ dx: 80, dy: 0 })
    await flushPromises()

    // No transform applied when cover mode ignores drag
    expect(el.style.transform).toBe('')
  })

  // ── snapBack on cancel ─────────────────────────────────────────────────────

  test('onCancel resets card transform to empty string', async () => {
    mountStudyCard({ options })
    await flushPromises()

    const { el, callbacks } = getCallbacks()

    // Move to set some transform
    callbacks.onMove({ dx: 40, dy: 0 })
    await flushPromises()

    // Cancel should snap back
    callbacks.onCancel()
    await flushPromises()

    // After the snap-back transition (which sets style.transform = ''), the element
    // should have its transform cleared
    expect(el.style.transform).toBe('')
  })
})
