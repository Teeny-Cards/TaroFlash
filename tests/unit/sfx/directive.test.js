import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'

vi.mock('@/sfx/bus', () => ({
  emitSfx: vi.fn(),
  emitHoverSfx: vi.fn()
}))

const { emitSfx, emitHoverSfx } = await import('@/sfx/bus')
const { vSfx } = await import('@/sfx/directive')

if (typeof PointerEvent === 'undefined') {
  class PointerEvent extends MouseEvent {
    constructor(type, params = {}) {
      super(type, params)
      this.pointerId = params.pointerId ?? 1
      this.pointerType = params.pointerType ?? 'mouse'
    }
  }
  globalThis.PointerEvent = PointerEvent
}

function mountDirective(value, modifiers = {}) {
  const el = document.createElement('button')
  document.body.appendChild(el)
  vSfx.mounted(el, { value, modifiers })
  return el
}

function unmount(el) {
  vSfx.beforeUnmount(el)
  el.remove()
}

describe('vSfx directive', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('hover', () => {
    test('plays hover sfx when pointerenter pointerType is mouse', () => {
      const el = mountDirective({ hover: 'ui.click_07' })

      el.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }))

      expect(emitHoverSfx).toHaveBeenCalledWith('ui.click_07', { debounce: undefined })
      unmount(el)
    })

    test('does NOT play hover sfx when pointerenter pointerType is touch', () => {
      const el = mountDirective({ hover: 'ui.click_07' })

      el.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'touch' }))

      expect(emitHoverSfx).not.toHaveBeenCalled()
      unmount(el)
    })

    test('does NOT play hover sfx when pointerenter pointerType is pen', () => {
      const el = mountDirective({ hover: 'ui.click_07' })

      el.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'pen' }))

      expect(emitHoverSfx).not.toHaveBeenCalled()
      unmount(el)
    })

    test('passes debounce option through', () => {
      const el = mountDirective({ hover: 'ui.click_07', debounce: 250 })

      el.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }))

      expect(emitHoverSfx).toHaveBeenCalledWith('ui.click_07', { debounce: 250 })
      unmount(el)
    })

    test('beforeUnmount removes the listener', () => {
      const el = mountDirective({ hover: 'ui.click_07' })

      vSfx.beforeUnmount(el)
      el.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }))

      expect(emitHoverSfx).not.toHaveBeenCalled()
      el.remove()
    })
  })

  describe('click', () => {
    test('still fires sfx on click regardless of pointer type', () => {
      const el = mountDirective({ click: 'ui.click_07' })

      el.dispatchEvent(new MouseEvent('click', { bubbles: true }))

      expect(emitSfx).toHaveBeenCalledWith('ui.click_07', {
        debounce: undefined,
        blocking: undefined
      })
      unmount(el)
    })

    test('forwards click_blocking option as PlayOptions.blocking', () => {
      const el = mountDirective({ click: 'ui.select', click_blocking: true })

      el.dispatchEvent(new MouseEvent('click', { bubbles: true }))

      expect(emitSfx).toHaveBeenCalledWith('ui.select', {
        debounce: undefined,
        blocking: true
      })
      unmount(el)
    })
  })

  describe('updated hook (binding value changes)', () => {
    test('picks up the new audio key on the next event without unbinding', () => {
      const el = mountDirective({ hover: 'ui.click_07' })
      const oldValue = { hover: 'ui.click_07' }
      const newValue = { hover: 'ui.select' }

      vSfx.updated(el, { value: newValue, oldValue, modifiers: {} })

      el.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }))

      expect(emitHoverSfx).toHaveBeenCalledWith('ui.select', { debounce: undefined })
      unmount(el)
    })

    test('skips work when value reference is unchanged', () => {
      const el = mountDirective({ hover: 'ui.click_07' })
      const value = { hover: 'ui.click_07' }

      vSfx.updated(el, { value, oldValue: value, modifiers: {} })

      el.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }))

      expect(emitHoverSfx).toHaveBeenCalledTimes(1)
      unmount(el)
    })

    test('attaches listeners on update if mounted with no binding value', () => {
      const el = document.createElement('button')
      document.body.appendChild(el)
      vSfx.mounted(el, { value: undefined, modifiers: {} })

      vSfx.updated(el, {
        value: { hover: 'ui.click_07' },
        oldValue: undefined,
        modifiers: {}
      })

      el.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }))

      expect(emitHoverSfx).toHaveBeenCalledWith('ui.click_07', { debounce: undefined })
      unmount(el)
    })

    test('clearing the audio key on update silences the listener', () => {
      const el = mountDirective({ hover: 'ui.click_07' })

      vSfx.updated(el, {
        value: {},
        oldValue: { hover: 'ui.click_07' },
        modifiers: {}
      })

      el.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }))

      expect(emitHoverSfx).not.toHaveBeenCalled()
      unmount(el)
    })
  })

  describe('binding shorthand', () => {
    test('string binding + .hover modifier wires hover sfx', () => {
      const el = mountDirective('ui.click_07', { hover: true })

      el.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }))

      expect(emitHoverSfx).toHaveBeenCalledWith('ui.click_07', { debounce: undefined })
      unmount(el)
    })

    test('string binding + .hover modifier still filters touch', () => {
      const el = mountDirective('ui.click_07', { hover: true })

      el.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'touch' }))

      expect(emitHoverSfx).not.toHaveBeenCalled()
      unmount(el)
    })
  })
})
