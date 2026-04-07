import { gsap } from 'gsap'

const BLUR_AMOUNT = 12
const TRANSLATE_AMOUNT = 100

const blurIn = (el: Element, done: () => void) => {
  const filters = getComputedStyle(el).filter

  gsap.fromTo(
    el,
    { translateY: `-${TRANSLATE_AMOUNT}px`, opacity: 0, filter: `blur(${BLUR_AMOUNT}px)` },
    {
      translateY: 0,
      opacity: 1,
      filter: `blur(0) ${filters}`,
      duration: 0.1,
      ease: 'expo.out',
      onComplete: done
    }
  )
}

const blurOut = (el: Element, done: () => void) => {
  gsap.to(el, {
    translateY: `-${TRANSLATE_AMOUNT}px`,
    opacity: 0,
    filter: `blur(${BLUR_AMOUNT}px)`,
    duration: 0.1,
    ease: 'expo.out',
    onComplete: done
  })
}

const slideUp = (el: Element, done: () => void) => {
  gsap.fromTo(
    el,
    { translateY: '100%' },
    { translateY: 0, duration: 0.1, ease: 'expo.out', onComplete: done }
  )
}

const slideDown = (el: Element, done: () => void) => {
  gsap.to(el, { translateY: '100%', duration: 0.1, ease: 'expo.out', onComplete: done })
}

const blurUp = (el: Element, done: () => void) => {
  gsap.fromTo(
    el,
    { opacity: 0, filter: `blur(${BLUR_AMOUNT}px)`, translateY: `${TRANSLATE_AMOUNT}px` },
    {
      opacity: 1,
      filter: 'blur(0)',
      translateY: 0,
      duration: 0.1,
      ease: 'expo.out',
      onComplete: done
    }
  )
}

const blurDown = (el: Element, done: () => void) => {
  gsap.to(el, {
    translateY: `${TRANSLATE_AMOUNT}px`,
    opacity: 0,
    filter: `blur(${BLUR_AMOUNT}px)`,
    duration: 0.1,
    ease: 'expo.out',
    onComplete: done
  })
}

export { blurIn, blurOut, blurUp, blurDown, slideUp, slideDown }
