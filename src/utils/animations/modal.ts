import { gsap } from 'gsap'

export function slideUpFadeIn(el: Element, done: () => void) {
  gsap.fromTo(
    el,
    { translateY: '200px', opacity: 0 },
    { translateY: 0, opacity: 1, duration: 0.2, ease: 'expo.out', onComplete: done }
  )
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
  gsap.fromTo(
    el,
    { translateY: '100%' },
    { translateY: 0, duration: 0.2, ease: 'expo.out', onComplete: done }
  )
}

export function slideDownToEdge(el: Element, done: () => void) {
  gsap.to(el, { translateY: '100%', duration: 0.2, ease: 'expo.out', onComplete: done })
}

export function springScaleIn(el: Element, done: () => void) {
  gsap.fromTo(
    el,
    { scale: 0.8, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.1, ease: 'back.out(1.7)', onComplete: done }
  )
}

export function scaleFadeOut(el: Element, done: () => void) {
  gsap.to(el, { scale: 0.8, opacity: 0, duration: 0.2, ease: 'expo.out', onComplete: done })
}
