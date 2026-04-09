import { describe, test, expect, beforeEach, afterEach, vi } from 'vite-plus/test'
import { useGestures, _resetGestureState } from '@/composables/use-gestures'

// jsdom doesn't implement PointerEvent — extend MouseEvent with the fields we need
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

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeElement() {
  const el = document.createElement('div')
  document.body.appendChild(el)
  return el
}

function cleanup(el) {
  el.remove()
}

let pointer_id = 0

function pointerDown(target, x, y, pointer_type = 'touch') {
  const e = new PointerEvent('pointerdown', {
    bubbles: true,
    clientX: x,
    clientY: y,
    pointerId: ++pointer_id,
    pointerType: pointer_type
  })
  target.dispatchEvent(e)
  return pointer_id
}

function pointerMove(x, y, pid = pointer_id, pointer_type = 'touch') {
  document.dispatchEvent(
    new PointerEvent('pointermove', {
      bubbles: true,
      clientX: x,
      clientY: y,
      pointerId: pid,
      pointerType: pointer_type
    })
  )
}

function pointerUp(x, y, pid = pointer_id, pointer_type = 'touch') {
  document.dispatchEvent(
    new PointerEvent('pointerup', {
      bubbles: true,
      clientX: x,
      clientY: y,
      pointerId: pid,
      pointerType: pointer_type
    })
  )
}

function pointerCancel(pid = pointer_id) {
  document.dispatchEvent(new PointerEvent('pointercancel', { bubbles: true, pointerId: pid }))
}

/** Simulate a complete swipe gesture. */
function swipe(target, dx, dy, pointer_type = 'touch') {
  const start_x = 100
  const start_y = 100
  pointerDown(target, start_x, start_y, pointer_type)
  pointerMove(start_x + dx / 2, start_y + dy / 2, pointer_id, pointer_type)
  pointerUp(start_x + dx, start_y + dy, pointer_id, pointer_type)
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('useGestures', () => {
  let el

  beforeEach(() => {
    _resetGestureState()
    pointer_id = 0
    el = makeElement()
  })

  afterEach(() => {
    cleanup(el)
  })

  // ── Swipe recognition ──────────────────────────────────────────────────────

  describe('swipe-down', () => {
    test('recognizes a downward swipe and calls onEnd', () => {
      const onEnd = vi.fn()
      const { register } = useGestures()
      register(el, 'swipe-down', { onEnd })

      swipe(el, 0, 80)

      expect(onEnd).toHaveBeenCalledOnce()
      expect(onEnd.mock.calls[0][0].direction).toBe('down')
    })

    test('does not fire for a swipe that is too short', () => {
      const onEnd = vi.fn()
      const { register } = useGestures()
      register(el, 'swipe-down', { onEnd })

      swipe(el, 0, 20)

      expect(onEnd).not.toHaveBeenCalled()
    })

    test('does not fire when the swipe is too diagonal', () => {
      const onEnd = vi.fn()
      const { register } = useGestures()
      register(el, 'swipe-down', { onEnd })

      // dy=50, dx=40 — ratio 40/50 = 0.8 exceeds MAX_SWIPE_ANGLE_RATIO (0.5)
      swipe(el, 40, 50)

      expect(onEnd).not.toHaveBeenCalled()
    })

    test('does not fire when swiping upward', () => {
      const onEnd = vi.fn()
      const { register } = useGestures()
      register(el, 'swipe-down', { onEnd })

      swipe(el, 0, -80)

      expect(onEnd).not.toHaveBeenCalled()
    })
  })

  describe('swipe-up', () => {
    test('recognizes an upward swipe and calls onEnd', () => {
      const onEnd = vi.fn()
      const { register } = useGestures()
      register(el, 'swipe-up', { onEnd })

      swipe(el, 0, -80)

      expect(onEnd).toHaveBeenCalledOnce()
      expect(onEnd.mock.calls[0][0].direction).toBe('up')
    })

    test('does not fire when swiping down', () => {
      const onEnd = vi.fn()
      const { register } = useGestures()
      register(el, 'swipe-up', { onEnd })

      swipe(el, 0, 80)

      expect(onEnd).not.toHaveBeenCalled()
    })
  })

  describe('swipe-left', () => {
    test('recognizes a leftward swipe and calls onEnd', () => {
      const onEnd = vi.fn()
      const { register } = useGestures()
      register(el, 'swipe-left', { onEnd })

      swipe(el, -80, 0)

      expect(onEnd).toHaveBeenCalledOnce()
      expect(onEnd.mock.calls[0][0].direction).toBe('left')
    })

    test('does not fire when swiping right', () => {
      const onEnd = vi.fn()
      const { register } = useGestures()
      register(el, 'swipe-left', { onEnd })

      swipe(el, 80, 0)

      expect(onEnd).not.toHaveBeenCalled()
    })
  })

  describe('swipe-right', () => {
    test('recognizes a rightward swipe and calls onEnd', () => {
      const onEnd = vi.fn()
      const { register } = useGestures()
      register(el, 'swipe-right', { onEnd })

      swipe(el, 80, 0)

      expect(onEnd).toHaveBeenCalledOnce()
      expect(onEnd.mock.calls[0][0].direction).toBe('right')
    })

    test('does not fire when swiping left', () => {
      const onEnd = vi.fn()
      const { register } = useGestures()
      register(el, 'swipe-right', { onEnd })

      swipe(el, -80, 0)

      expect(onEnd).not.toHaveBeenCalled()
    })
  })

  // ── onEnd result shape ─────────────────────────────────────────────────────

  test('onEnd result contains dx, dy, velocity, duration', () => {
    const onEnd = vi.fn()
    const { register } = useGestures()
    register(el, 'swipe-right', { onEnd })

    swipe(el, 80, 0)

    const result = onEnd.mock.calls[0][0]
    expect(result.dx).toBe(80)
    expect(result.dy).toBe(0)
    expect(typeof result.velocity).toBe('number')
    expect(typeof result.duration).toBe('number')
    expect(result.velocity).toBeGreaterThanOrEqual(0)
    expect(result.duration).toBeGreaterThanOrEqual(0)
  })

  // ── Lifecycle callbacks ────────────────────────────────────────────────────

  test('onStart fires when touch begins on the element', () => {
    const onStart = vi.fn()
    const { register } = useGestures()
    register(el, 'swipe-right', { onStart })

    pointerDown(el, 100, 100)

    expect(onStart).toHaveBeenCalledOnce()
    expect(onStart.mock.calls[0][0]).toEqual({ x: 100, y: 100 })
  })

  test('onMove fires for every move event during the gesture', () => {
    const onMove = vi.fn()
    const { register } = useGestures()
    register(el, 'swipe-right', { onMove })

    pointerDown(el, 100, 100)
    pointerMove(120, 100)
    pointerMove(140, 100)
    pointerMove(160, 100)

    expect(onMove).toHaveBeenCalledTimes(3)
  })

  test('onMove provides current coordinates and deltas from start', () => {
    const onMove = vi.fn()
    const { register } = useGestures()
    register(el, 'swipe-right', { onMove })

    pointerDown(el, 100, 100)
    pointerMove(150, 110)

    expect(onMove.mock.calls[0][0]).toEqual({ x: 150, y: 110, dx: 50, dy: 10 })
  })

  test('onStart does not fire for touches outside the element', () => {
    const onStart = vi.fn()
    const { register } = useGestures()
    register(el, 'swipe-right', { onStart })

    const other = makeElement()
    pointerDown(other, 100, 100)
    cleanup(other)

    expect(onStart).not.toHaveBeenCalled()
  })

  // ── Element containment ────────────────────────────────────────────────────

  test('callbacks fire when touch targets a child of the registered element', () => {
    const onEnd = vi.fn()
    const child = document.createElement('span')
    el.appendChild(child)

    const { register } = useGestures()
    register(el, 'swipe-right', { onEnd })

    swipe(child, 80, 0)

    expect(onEnd).toHaveBeenCalledOnce()
  })

  test('callbacks do not fire when touch targets a sibling element', () => {
    const onEnd = vi.fn()
    const sibling = makeElement()

    const { register } = useGestures()
    register(el, 'swipe-right', { onEnd })

    swipe(sibling, 80, 0)
    cleanup(sibling)

    expect(onEnd).not.toHaveBeenCalled()
  })

  // ── Multiple registrations ─────────────────────────────────────────────────

  test('multiple gesture types on the same element fire their respective onEnd', () => {
    const onSwipeDown = vi.fn()
    const onSwipeRight = vi.fn()
    const { register } = useGestures()
    register(el, 'swipe-down', { onEnd: onSwipeDown })
    register(el, 'swipe-right', { onEnd: onSwipeRight })

    swipe(el, 0, 80) // swipe-down
    expect(onSwipeDown).toHaveBeenCalledOnce()
    expect(onSwipeRight).not.toHaveBeenCalled()

    _resetGestureState()
    pointer_id = 0
    // re-register after reset
    register(el, 'swipe-down', { onEnd: onSwipeDown })
    register(el, 'swipe-right', { onEnd: onSwipeRight })

    swipe(el, 80, 0) // swipe-right
    expect(onSwipeDown).toHaveBeenCalledOnce() // not called again
    expect(onSwipeRight).toHaveBeenCalledOnce()
  })

  test('registrations on different elements are independent', () => {
    const el2 = makeElement()
    const onEnd1 = vi.fn()
    const onEnd2 = vi.fn()
    const { register } = useGestures()
    register(el, 'swipe-right', { onEnd: onEnd1 })
    register(el2, 'swipe-right', { onEnd: onEnd2 })

    swipe(el, 80, 0)

    expect(onEnd1).toHaveBeenCalledOnce()
    expect(onEnd2).not.toHaveBeenCalled()

    cleanup(el2)
  })

  // ── Input mode ────────────────────────────────────────────────────────────

  test('input:touch ignores mouse pointer events', () => {
    const onEnd = vi.fn()
    const { register } = useGestures({ input: 'touch' })
    register(el, 'swipe-right', { onEnd })

    swipe(el, 80, 0, 'mouse')

    expect(onEnd).not.toHaveBeenCalled()
  })

  test('input:touch responds to touch pointer events', () => {
    const onEnd = vi.fn()
    const { register } = useGestures({ input: 'touch' })
    register(el, 'swipe-right', { onEnd })

    swipe(el, 80, 0, 'touch')

    expect(onEnd).toHaveBeenCalledOnce()
  })

  test('input:pointer responds to mouse events', () => {
    const onEnd = vi.fn()
    const { register } = useGestures({ input: 'pointer' })
    register(el, 'swipe-right', { onEnd })

    swipe(el, 80, 0, 'mouse')

    expect(onEnd).toHaveBeenCalledOnce()
  })

  test('input:pointer ignores touch events', () => {
    const onEnd = vi.fn()
    const { register } = useGestures({ input: 'pointer' })
    register(el, 'swipe-right', { onEnd })

    swipe(el, 80, 0, 'touch')

    expect(onEnd).not.toHaveBeenCalled()
  })

  test('input:both responds to touch and mouse', () => {
    const onEnd = vi.fn()
    const { register } = useGestures({ input: 'both' })
    register(el, 'swipe-right', { onEnd })

    swipe(el, 80, 0, 'touch')
    _resetGestureState()
    pointer_id = 0
    register(el, 'swipe-right', { onEnd })
    swipe(el, 80, 0, 'mouse')

    expect(onEnd).toHaveBeenCalledTimes(2)
  })

  // ── onCancel ──────────────────────────────────────────────────────────────

  test('onCancel fires when pointer is released without a recognized swipe', () => {
    const onCancel = vi.fn()
    const onEnd = vi.fn()
    const { register } = useGestures()
    register(el, 'swipe-right', { onCancel, onEnd })

    pointerDown(el, 100, 100)
    pointerUp(105, 100) // too short to be a swipe

    expect(onCancel).toHaveBeenCalledOnce()
    expect(onEnd).not.toHaveBeenCalled()
  })

  test('onCancel does not fire when a swipe is recognized', () => {
    const onCancel = vi.fn()
    const { register } = useGestures()
    register(el, 'swipe-right', { onCancel })

    swipe(el, 80, 0)

    expect(onCancel).not.toHaveBeenCalled()
  })

  test('onCancel fires on pointercancel', () => {
    const onCancel = vi.fn()
    const { register } = useGestures()
    register(el, 'swipe-right', { onCancel })

    pointerDown(el, 100, 100)
    pointerCancel()

    expect(onCancel).toHaveBeenCalledOnce()
  })

  // ── Pointer cancel ────────────────────────────────────────────────────────

  test('pointercancel aborts tracking so a subsequent swipe is fresh', () => {
    const onEnd = vi.fn()
    const onStart = vi.fn()
    const { register } = useGestures()
    register(el, 'swipe-right', { onStart, onEnd })

    pointerDown(el, 100, 100)
    pointerCancel()

    // Start a fresh gesture — onStart should fire again
    pointerDown(el, 100, 100)
    pointerUp(200, 100)

    expect(onStart).toHaveBeenCalledTimes(2)
    expect(onEnd).toHaveBeenCalledOnce()
  })

  // ── Unregister ────────────────────────────────────────────────────────────

  test('returned unregister function stops callbacks from firing', () => {
    const onEnd = vi.fn()
    const { register } = useGestures()
    const unregister = register(el, 'swipe-right', { onEnd })

    unregister()
    swipe(el, 80, 0)

    expect(onEnd).not.toHaveBeenCalled()
  })

  test('global listeners are detached when all registrations are removed', () => {
    const add_spy = vi.spyOn(document, 'addEventListener')
    const remove_spy = vi.spyOn(document, 'removeEventListener')

    const { register } = useGestures()
    const unregister = register(el, 'swipe-right', {})

    expect(add_spy).toHaveBeenCalled()

    unregister()

    expect(remove_spy).toHaveBeenCalled()

    add_spy.mockRestore()
    remove_spy.mockRestore()
  })

  test('global listeners are attached only once for multiple registrations', () => {
    const add_spy = vi.spyOn(document, 'addEventListener')

    const { register } = useGestures()
    register(el, 'swipe-right', {})
    register(el, 'swipe-left', {})
    register(el, 'swipe-down', {})

    // 4 listeners (down, move, up, cancel) added only once total
    expect(add_spy).toHaveBeenCalledTimes(4)

    add_spy.mockRestore()
  })

  // ── Null element guard ────────────────────────────────────────────────────

  test('register with null element returns a no-op and does not attach listeners', () => {
    const add_spy = vi.spyOn(document, 'addEventListener')
    const onEnd = vi.fn()
    const { register } = useGestures()

    const unregister = register(null, 'swipe-right', { onEnd })
    swipe(el, 80, 0)

    expect(onEnd).not.toHaveBeenCalled()
    expect(add_spy).not.toHaveBeenCalled()
    // returned fn should be callable without error
    expect(() => unregister()).not.toThrow()

    add_spy.mockRestore()
  })
})
