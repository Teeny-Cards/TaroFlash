import { gsap } from 'gsap'

const DURATION = 0.1
const OFFSET = 24

/**
 * Slide-and-fade the entering grid in from the given direction.
 * `direction = 'forward'` enters from the right; `'backward'` from the left.
 */
export function slideInFromDirection(
  el: Element,
  direction: 'forward' | 'backward',
  done: () => void
) {
  const offset = direction === 'forward' ? OFFSET : -OFFSET
  gsap.set(el, { x: offset, opacity: 0 })
  gsap.to(el, {
    x: 0,
    opacity: 1,
    duration: DURATION,
    ease: 'expo.out',
    onComplete: done
  })
}

/**
 * Slide-and-fade the leaving grid out in the given direction.
 * `direction = 'forward'` exits to the left; `'backward'` to the right.
 */
export function slideOutInDirection(
  el: Element,
  direction: 'forward' | 'backward',
  done: () => void
) {
  const offset = direction === 'forward' ? -OFFSET : OFFSET
  gsap.to(el, {
    x: offset,
    opacity: 0,
    duration: DURATION,
    ease: 'expo.out',
    onComplete: done
  })
}
