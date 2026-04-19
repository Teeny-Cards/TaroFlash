import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'
import { flushPromises } from '@vue/test-utils'
import { useDeckSettingsModal } from '@/composables/modals/use-deck-settings-modal'

const { mockEmitSfx } = vi.hoisted(() => ({ mockEmitSfx: vi.fn() }))
const { mockOpen } = vi.hoisted(() => ({ mockOpen: vi.fn() }))

vi.mock('@/sfx/bus', () => ({ emitSfx: mockEmitSfx }))

vi.mock('@/composables/modal', () => ({
  useModal: vi.fn(() => ({ open: mockOpen }))
}))

// DeckSettings is wrapped with defineAsyncComponent inside the composable, so
// the component identity doesn't match the raw .vue import. Assert on shape.
const asyncComponentMatcher = expect.objectContaining({ __asyncLoader: expect.any(Function) })

function makeModalResult(value) {
  return { response: Promise.resolve(value) }
}

describe('useDeckSettingsModal', () => {
  beforeEach(() => {
    mockEmitSfx.mockClear()
    mockOpen.mockReset()
  })

  test('plays camera-reel sfx when opening', () => {
    mockOpen.mockReturnValueOnce(makeModalResult(undefined))

    const { open } = useDeckSettingsModal()
    open()

    expect(mockEmitSfx).toHaveBeenCalled()
  })

  test('opens modal with backdrop, mobile-sheet mode, and the deck prop', () => {
    const deck = { id: 42, title: 'A' }
    mockOpen.mockReturnValueOnce(makeModalResult(undefined))

    const { open } = useDeckSettingsModal()
    open(deck)

    expect(mockOpen).toHaveBeenCalledWith(asyncComponentMatcher, {
      backdrop: true,
      mode: 'mobile-sheet',
      props: { deck }
    })
  })

  test('passes undefined deck when called without an argument', () => {
    mockOpen.mockReturnValueOnce(makeModalResult(undefined))

    const { open } = useDeckSettingsModal()
    open()

    expect(mockOpen).toHaveBeenCalledWith(asyncComponentMatcher, {
      backdrop: true,
      mode: 'mobile-sheet',
      props: { deck: undefined }
    })
  })

  test('returns the result of modal.open unchanged', () => {
    const result = makeModalResult('x')
    mockOpen.mockReturnValueOnce(result)

    const { open } = useDeckSettingsModal()
    const returned = open()

    expect(returned).toBe(result)
  })

  test('plays card-drop sfx after the modal closes', async () => {
    mockOpen.mockReturnValueOnce(makeModalResult(undefined))

    const { open } = useDeckSettingsModal()
    open()
    const openSfxCount = mockEmitSfx.mock.calls.length

    await flushPromises()

    expect(mockEmitSfx.mock.calls.length).toBeGreaterThan(openSfxCount)
  })
})
