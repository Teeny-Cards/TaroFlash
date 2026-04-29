import { gsap } from 'gsap'

const DURATION = 0.3
const DISTANCE = '100%'

export function primeOverlayBelow(el: Element) {
  gsap.set(el, { translateY: DISTANCE })
}

export function slideOverlayUp(el: Element, done: () => void) {
  gsap.to(el, {
    translateY: 0,
    duration: DURATION,
    ease: 'expo.out',
    onComplete: done
  })
}

export function slideOverlayDown(el: Element, done: () => void) {
  gsap.to(el, {
    translateY: DISTANCE,
    duration: DURATION,
    ease: 'expo.out',
    onComplete: done
  })
}
