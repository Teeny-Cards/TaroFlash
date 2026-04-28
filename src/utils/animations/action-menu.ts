import { gsap } from 'gsap'

type ActionItemAnimOptions = {
  stagger: number
  duration: number
  onStart?: () => void
}

export function actionItemEnter(
  el: Element,
  index: number,
  { stagger, duration, onStart }: ActionItemAnimOptions,
  done: () => void
) {
  gsap.set(el, { scale: 0.6, opacity: 0 })
  gsap.to(el, {
    scale: 1,
    opacity: 1,
    duration,
    delay: index * stagger,
    ease: 'back.out(4)',
    onStart,
    onComplete: done
  })
}

export function actionItemLeave(
  el: Element,
  index: number,
  { stagger, duration, onStart }: ActionItemAnimOptions,
  done: () => void
) {
  gsap.to(el, {
    scale: 0.6,
    opacity: 0,
    duration,
    delay: index * stagger,
    ease: 'expo.out',
    onStart,
    onComplete: done
  })
}
