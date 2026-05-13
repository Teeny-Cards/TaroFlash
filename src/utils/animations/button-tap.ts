import { gsap } from 'gsap'

export const BUTTON_TAP_DURATION = 0.1

export function playButtonTap(el: Element, duration: number = BUTTON_TAP_DURATION) {
  return new Promise<void>((resolve) => {
    gsap.to(el, {
      scale: 1.2,
      rotate: 3,
      duration,
      ease: 'power2.out',
      onComplete: resolve
    })
  })
}
