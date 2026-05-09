import { gsap } from 'gsap'

const DURATION = 0.18
const OFFSET = 16

/** Slide-and-fade the entering tab pane down into place from above. */
export function tabContentEnter(el: Element, done: () => void) {
  gsap.set(el, { y: -OFFSET, opacity: 0 })
  gsap.to(el, { y: 0, opacity: 1, duration: DURATION, ease: 'expo.out', onComplete: done })
}

/** Slide-and-fade the leaving tab pane downward and out. */
export function tabContentLeave(el: Element, done: () => void) {
  gsap.to(el, { y: OFFSET, opacity: 0, duration: DURATION, ease: 'expo.in', onComplete: done })
}
