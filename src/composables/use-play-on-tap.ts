import { ref } from 'vue'
import { useMediaQuery } from '@/composables/use-media-query'
import { BUTTON_TAP_DURATION, playButtonTap } from '@/utils/animations/button-tap'

type Options = {
  /** Run GSAP scale/rotate tween on the element. When false, just hold `playing` for the same duration so consumers can drive their own CSS via `[data-playing]`. Defaults to true. */
  animate?: boolean
  /** Flip `playing` back to false after `onAfter` runs. Defaults to true. Set false to hold the active state (e.g. when a GSAP transform should remain applied until unmount). */
  reset?: boolean
  /** How long (in seconds) the tap state holds — also the duration handed to GSAP when `animate` is true. Defaults to `BUTTON_TAP_DURATION`. */
  duration?: number
  /** Pointer environments where the intercept is active. Defaults to 'coarse-only' so desktop clicks pass straight through; 'always' forces the tap on every pointer type. */
  activeOn?: 'coarse-only' | 'always'
  /** Hook fired at the start of the intercept (after stop/preventDefault, before the tween). Use for sfx or other side-effects. */
  beforePlay?: (e: MouseEvent) => void
}

/**
 * Intercepts a click, plays (or waits out) the button-tap animation, then invokes the original handler.
 * The MouseEvent is preserved end-to-end so downstream handlers still see `isTrusted=true` within the
 * browser's user-activation window.
 */
export function usePlayOnTap(options: Options = {}) {
  const playing = ref(false)
  const animate = options.animate ?? true
  const reset = options.reset ?? true
  const duration = options.duration ?? BUTTON_TAP_DURATION
  const active_on = options.activeOn ?? 'coarse-only'
  const is_coarse = useMediaQuery('coarse')

  /** Stop the click, run the tap (or its delay), then invoke `onAfter` with the original event. No-op while already playing. */
  async function interceptClick(e: MouseEvent, onAfter: (e: MouseEvent) => void) {
    if (playing.value) return

    if (active_on === 'coarse-only' && !is_coarse.value) return

    e.stopImmediatePropagation()
    e.preventDefault()

    options.beforePlay?.(e)

    playing.value = true
    if (animate) {
      await playButtonTap(e.currentTarget as HTMLElement, duration)
    } else {
      await new Promise((resolve) => setTimeout(resolve, duration * 1000))
    }

    onAfter(e)

    if (reset) playing.value = false
  }

  return { playing, interceptClick }
}
