import type { ModalMode } from '@/composables/modal'
import {
  slideUpFadeIn,
  slideDownFadeOut,
  slideUpFromEdge,
  slideDownToEdge,
  springScaleIn,
  scaleFadeOut
} from '@/utils/animations/modal'

type ModeConfig = {
  containerClass: string
  enter(el: Element, isDesktop: boolean, done: () => void): void
  leave(el: Element, isDesktop: boolean, done: () => void): void
}

export const MODAL_MODE_CONFIG: Record<ModalMode, ModeConfig> = {
  dialog: {
    containerClass: 'items-center',
    enter: (el, _, done) => slideUpFadeIn(el, done),
    leave: (el, _, done) => slideDownFadeOut(el, done)
  },

  'mobile-sheet': {
    containerClass: 'items-end pt-4 sm:pt-0 sm:items-center',
    enter: (el, isDesktop, done) =>
      isDesktop ? slideUpFadeIn(el, done) : slideUpFromEdge(el, done),
    leave: (el, isDesktop, done) =>
      isDesktop ? slideDownFadeOut(el, done) : slideDownToEdge(el, done)
  },

  popup: {
    containerClass: 'items-center',
    enter: (el, _, done) => springScaleIn(el, done),
    leave: (el, _, done) => scaleFadeOut(el, done)
  }
}
