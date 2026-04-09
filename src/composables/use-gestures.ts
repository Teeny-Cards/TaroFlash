import { getCurrentScope, onScopeDispose, unref } from 'vue'
import type { MaybeRef } from 'vue'
import { useShortcuts } from '@/composables/use-shortcuts'
import uid from '@/utils/uid'

// ── Types ─────────────────────────────────────────────────────────────────────

export type GestureType = 'swipe-down' | 'swipe-up' | 'swipe-left' | 'swipe-right'

/** Which input devices to respond to. 'pointer' covers mouse and pen. */
export type InputMode = 'touch' | 'pointer' | 'both'

export interface GestureStartCoords {
  x: number
  y: number
}

export interface GestureMoveCoords {
  x: number
  y: number
  /** Delta from gesture start */
  dx: number
  /** Delta from gesture start */
  dy: number
}

export interface SwipeResult {
  x: number
  y: number
  dx: number
  dy: number
  /** pixels per millisecond */
  velocity: number
  /** milliseconds */
  duration: number
  direction: 'down' | 'up' | 'left' | 'right'
}

export interface GestureCallbacks {
  /** Fires when the pointer/touch first contacts the element. Gesture not yet determined. */
  onStart?: (element: Element, coords: GestureStartCoords) => void
  /** Fires on every move event while the gesture is in progress. */
  onMove?: (element: Element, coords: GestureMoveCoords) => void
  /** Fires when the pointer/touch is released and the gesture is recognized. */
  onEnd?: (element: Element, result: SwipeResult) => void
  /** Fires when the pointer/touch is released but no gesture was recognized. */
  onCancel?: (element: Element) => void
}

export interface UseGesturesOptions {
  /** Defaults to 'both'. */
  input?: InputMode
}

// ── Constants ─────────────────────────────────────────────────────────────────

const MIN_SWIPE_DISTANCE = 30
/** max |perpendicular| / |parallel| ratio to qualify as a directional swipe (~27°) */
const MAX_SWIPE_ANGLE_RATIO = 0.5

const GESTURE_KEY_MAP: Record<GestureType, KeyCombo> = {
  'swipe-right': 'arrowright',
  'swipe-left': 'arrowleft',
  'swipe-up': 'arrowup',
  'swipe-down': 'arrowdown'
}

// ── Module-level state ────────────────────────────────────────────────────────
// Single shared state so N components share one set of document listeners.

interface Registration {
  id: number
  element: Element
  gesture: GestureType
  callbacks: GestureCallbacks
  input: InputMode
}

interface TrackingState {
  start_x: number
  start_y: number
  start_time: number
  pointer_id: number
  active: Registration[]
}

let _next_id = 0
const _registry = new Map<number, Registration>()
let _tracking: TrackingState | null = null
let _listener_count = 0

// ── Gesture classification ────────────────────────────────────────────────────

function classifySwipe(dx: number, dy: number): GestureType | null {
  const abs_dx = Math.abs(dx)
  const abs_dy = Math.abs(dy)
  const distance = Math.sqrt(dx * dx + dy * dy)

  if (distance < MIN_SWIPE_DISTANCE) return null

  if (abs_dy >= abs_dx) {
    // Vertical dominant
    if (dy > 0 && abs_dx / abs_dy < MAX_SWIPE_ANGLE_RATIO) return 'swipe-down'
    if (dy < 0 && abs_dx / abs_dy < MAX_SWIPE_ANGLE_RATIO) return 'swipe-up'
  } else {
    // Horizontal dominant
    if (dx < 0 && abs_dy / abs_dx < MAX_SWIPE_ANGLE_RATIO) return 'swipe-left'
    if (dx > 0 && abs_dy / abs_dx < MAX_SWIPE_ANGLE_RATIO) return 'swipe-right'
  }

  return null
}

function matchesInput(pointer_type: string, mode: InputMode): boolean {
  if (mode === 'touch') return pointer_type === 'touch'
  if (mode === 'pointer') return pointer_type === 'mouse' || pointer_type === 'pen'
  return true // 'both'
}

// ── Global pointer event handlers ─────────────────────────────────────────────

function onPointerDown(e: PointerEvent): void {
  if (_tracking) return // already tracking

  const target = e.target as Element | null
  if (!target) return

  // Collect registrations whose element contains the event target
  const active: Registration[] = []
  for (const reg of _registry.values()) {
    if (!matchesInput(e.pointerType, reg.input)) continue
    if (reg.element.contains(target)) active.push(reg)
  }

  if (active.length === 0) return

  _tracking = {
    start_x: e.clientX,
    start_y: e.clientY,
    start_time: Date.now(),
    pointer_id: e.pointerId,
    active
  }

  const coords: GestureStartCoords = { x: e.clientX, y: e.clientY }
  for (const reg of active) reg.callbacks.onStart?.(reg.element, coords)
}

function onPointerMove(e: PointerEvent): void {
  if (!_tracking || _tracking.pointer_id !== e.pointerId) return

  const dx = e.clientX - _tracking.start_x
  const dy = e.clientY - _tracking.start_y
  const coords: GestureMoveCoords = { x: e.clientX, y: e.clientY, dx, dy }

  for (const reg of _tracking.active) reg.callbacks.onMove?.(reg.element, coords)
}

function onPointerUp(e: PointerEvent): void {
  if (!_tracking || _tracking.pointer_id !== e.pointerId) return

  const dx = e.clientX - _tracking.start_x
  const dy = e.clientY - _tracking.start_y
  const duration = Date.now() - _tracking.start_time
  const distance = Math.sqrt(dx * dx + dy * dy)
  const velocity = duration > 0 ? distance / duration : 0

  const gesture = classifySwipe(dx, dy)

  const active = _tracking.active
  _tracking = null

  if (gesture !== null) {
    const direction: SwipeResult['direction'] =
      gesture === 'swipe-down'
        ? 'down'
        : gesture === 'swipe-up'
          ? 'up'
          : gesture === 'swipe-left'
            ? 'left'
            : 'right'
    const result: SwipeResult = {
      x: e.clientX,
      y: e.clientY,
      dx,
      dy,
      velocity,
      duration,
      direction
    }
    for (const reg of active) {
      if (reg.gesture === gesture) reg.callbacks.onEnd?.(reg.element, result)
    }
  } else {
    for (const reg of active) reg.callbacks.onCancel?.(reg.element)
  }
}

function onPointerCancel(e: PointerEvent): void {
  if (!_tracking || _tracking.pointer_id !== e.pointerId) return
  const active = _tracking.active
  _tracking = null
  for (const reg of active) reg.callbacks.onCancel?.(reg.element)
}

// ── Listener lifecycle ────────────────────────────────────────────────────────

function attachListeners(): void {
  document.addEventListener('pointerdown', onPointerDown)
  document.addEventListener('pointermove', onPointerMove, { passive: true })
  document.addEventListener('pointerup', onPointerUp)
  document.addEventListener('pointercancel', onPointerCancel)
}

function detachListeners(): void {
  document.removeEventListener('pointerdown', onPointerDown)
  document.removeEventListener('pointermove', onPointerMove)
  document.removeEventListener('pointerup', onPointerUp)
  document.removeEventListener('pointercancel', onPointerCancel)
}

function addToRegistry(reg: Registration): void {
  _registry.set(reg.id, reg)
  _listener_count++
  if (_listener_count === 1) attachListeners()
}

function removeFromRegistry(id: number): void {
  if (!_registry.has(id)) return
  _registry.delete(id)

  if (_tracking) {
    _tracking.active = _tracking.active.filter((r) => r.id !== id)
    if (_tracking.active.length === 0) _tracking = null
  }

  _listener_count--
  if (_listener_count === 0) detachListeners()
}

// ── Test utilities ────────────────────────────────────────────────────────────

/** Reset all module-level state. Call in beforeEach in tests. */
export function _resetGestureState(): void {
  if (_listener_count > 0) detachListeners()
  _registry.clear()
  _tracking = null
  _listener_count = 0
  _next_id = 0
}

// ── Composable ────────────────────────────────────────────────────────────────

export function useGestures(options: UseGesturesOptions = {}) {
  const { input = 'both' } = options
  const owned_ids: number[] = []
  const shortcuts = useShortcuts(`gestures/${uid()}`)

  if (getCurrentScope()) onScopeDispose(() => shortcuts.dispose())

  /**
   * Register a gesture listener on an element.
   * Returns an unregister function. Auto-unregisters when the component scope is disposed.
   *
   * Keyboard equivalents are registered automatically:
   * swipe-right → ArrowRight, swipe-left → ArrowLeft, swipe-up → ArrowUp, swipe-down → ArrowDown
   *
   * @param element - The element (or template ref) to watch. Must be mounted.
   * @param gesture - Which gesture to listen for.
   * @param callbacks - Lifecycle callbacks for the gesture. Element is passed as the first argument.
   */
  function register(
    element: MaybeRef<Element | null | undefined>,
    gesture: GestureType,
    callbacks: GestureCallbacks
  ): () => void {
    const el = unref(element)
    if (!el) return () => {}

    const id = _next_id++
    addToRegistry({ id, element: el, gesture, callbacks, input })
    owned_ids.push(id)

    // Register keyboard shortcut equivalent so gestures can also be triggered by keyboard.
    const direction = gesture.replace('swipe-', '') as SwipeResult['direction']
    const synthetic_dx = gesture === 'swipe-right' ? 100 : gesture === 'swipe-left' ? -100 : 0
    const synthetic_dy = gesture === 'swipe-down' ? 100 : gesture === 'swipe-up' ? -100 : 0
    shortcuts.register({
      combo: GESTURE_KEY_MAP[gesture],
      handler: () => {
        callbacks.onEnd?.(el, {
          x: 0,
          y: 0,
          dx: synthetic_dx,
          dy: synthetic_dy,
          velocity: 0,
          duration: 0,
          direction
        })
      }
    })

    const unregister = () => {
      removeFromRegistry(id)
      const idx = owned_ids.indexOf(id)
      if (idx !== -1) owned_ids.splice(idx, 1)
    }

    if (getCurrentScope()) onScopeDispose(unregister)

    return unregister
  }

  return { register }
}
