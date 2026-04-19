import { gsap } from 'gsap'

const ENTER_SETTLE_DELAY = 0.033

export function slideUpFadeIn(el: Element, done: () => void) {
  gsap.set(el, { translateY: '200px', opacity: 0 })
  gsap.to(el, {
    translateY: 0,
    opacity: 1,
    duration: 0.2,
    delay: ENTER_SETTLE_DELAY,
    ease: 'expo.out',
    onComplete: done
  })
}

export function slideDownFadeOut(el: Element, done: () => void) {
  gsap.to(el, {
    translateY: '200px',
    opacity: 0,
    duration: 0.2,
    ease: 'expo.out',
    onComplete: done
  })
}

export function slideUpFromEdge(el: Element, done: () => void) {
  gsap.set(el, { translateY: '100%' })
  gsap.to(el, {
    translateY: 0,
    duration: 0.2,
    delay: ENTER_SETTLE_DELAY,
    ease: 'expo.out',
    onComplete: done
  })
}

export function slideDownToEdge(el: Element, done: () => void) {
  gsap.to(el, { translateY: '100%', duration: 0.2, ease: 'expo.out', onComplete: done })
}

export function springScaleIn(el: Element, done: () => void) {
  gsap.set(el, { scale: 0.8, opacity: 0 })
  gsap.to(el, {
    scale: 1,
    opacity: 1,
    duration: 0.1,
    delay: ENTER_SETTLE_DELAY,
    ease: 'back.out(1.7)',
    onComplete: done
  })
}

export function scaleFadeOut(el: Element, done: () => void) {
  gsap.to(el, { scale: 0.8, opacity: 0, duration: 0.2, ease: 'expo.out', onComplete: done })
}
