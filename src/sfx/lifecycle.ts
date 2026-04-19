import { Howler } from 'howler'

let installed = false
let gestureArmed = false

const GESTURE_EVENTS = ['pointerdown', 'keydown', 'touchend'] as const

export function installAudioLifecycle(): () => void {
  if (installed || typeof window === 'undefined') return () => {}
  installed = true

  const tryResume = async () => {
    const ctx = Howler.ctx
    if (!ctx) return
    if (ctx.state === 'suspended') {
      try {
        await ctx.resume()
      } catch {
        armGestureRetry()
        return
      }
    }
    if (ctx.state !== 'running') armGestureRetry()
  }

  const gestureResume = async () => {
    removeGestureListeners()
    gestureArmed = false
    const ctx = Howler.ctx
    if (!ctx) return
    try {
      await ctx.resume()
    } catch {
      // Gesture didn't satisfy the browser; next gesture will rearm.
    }
  }

  const armGestureRetry = () => {
    if (gestureArmed) return
    gestureArmed = true
    for (const ev of GESTURE_EVENTS) {
      window.addEventListener(ev, gestureResume, { once: true, passive: true })
    }
  }

  const removeGestureListeners = () => {
    for (const ev of GESTURE_EVENTS) {
      window.removeEventListener(ev, gestureResume)
    }
  }

  const onVisibility = () => {
    if (document.visibilityState === 'visible') void tryResume()
  }

  document.addEventListener('visibilitychange', onVisibility)
  window.addEventListener('pageshow', tryResume)
  window.addEventListener('focus', tryResume)

  return () => {
    document.removeEventListener('visibilitychange', onVisibility)
    window.removeEventListener('pageshow', tryResume)
    window.removeEventListener('focus', tryResume)
    removeGestureListeners()
    installed = false
    gestureArmed = false
  }
}
