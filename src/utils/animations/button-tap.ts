import { gsap } from 'gsap'

export const BUTTON_TAP_DURATION = 0.1

type Options = {
  /** Animate back to neutral after peaking. Total runtime is `duration` regardless. */
  yoyo?: boolean
  /** Seconds to hold at peak before resolving + returning. Yoyo-only. Defaults to 0.1. */
  hold?: number
}

export function playButtonTap(
  el: Element,
  duration: number = BUTTON_TAP_DURATION,
  options: Options = {}
) {
  if (!options.yoyo) {
    return new Promise<void>((resolve) => {
      gsap.to(el, {
        scale: 1.2,
        rotate: 3,
        duration,
        ease: 'expo.out',
        onComplete: resolve
      })
    })
  }

  return new Promise<void>((resolve) => {
    const up = duration * 0.5
    const hold = options.hold ?? 0.1
    const down = duration * 0.5
    gsap
      .timeline()
      .to(el, { scale: 1.3, rotate: 3, duration: up, ease: 'back.out' })
      .call(resolve, undefined, `+=${hold}`)
      .to(el, { scale: 1, rotate: 0, duration: down, ease: 'back.out(3)' })
  })
}
