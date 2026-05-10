// sfx/directive.ts
import type { Directive, DirectiveBinding } from 'vue'
import { emitSfx, emitHoverSfx } from './bus'
import { type NamespacedAudioKey } from './config'

export type SfxOptions = {
  click?: NamespacedAudioKey
  hover?: NamespacedAudioKey
  focus?: NamespacedAudioKey
  blur?: NamespacedAudioKey
  debounce?: number
}

type SfxBindingValue = NamespacedAudioKey | SfxOptions

type Cleanup = () => void

type SfxState = {
  cfg: SfxOptions
  mods: Partial<Record<string, boolean>>
  cleanup: Cleanup
}

const STATE_KEY = '__vSfxState'

export const vSfx: Directive<HTMLElement, SfxBindingValue> = {
  mounted(el, binding) {
    _attach(el, binding)
  },

  updated(el, binding) {
    if (binding.value === binding.oldValue) return
    const state = (el as any)[STATE_KEY] as SfxState | undefined
    if (!state) {
      _attach(el, binding)
      return
    }
    state.cfg = _parseBinding(binding.value, binding.modifiers)
  },

  beforeUnmount(el) {
    const state = (el as any)[STATE_KEY] as SfxState | undefined
    state?.cleanup()
    ;(el as any)[STATE_KEY] = undefined
  }
}

function _attach(el: HTMLElement, binding: DirectiveBinding<SfxBindingValue>) {
  if (!binding.value) return

  const state: SfxState = {
    cfg: _parseBinding(binding.value, binding.modifiers),
    mods: binding.modifiers,
    cleanup: () => {}
  }

  const cleanups: Cleanup[] = []

  cleanups.push(
    _add(el, 'click', (e) => {
      if (!state.cfg.click) return
      if (state.mods.prevent) e.preventDefault()
      if (state.mods.stop) e.stopPropagation()
      emitSfx(state.cfg.click, { debounce: state.cfg.debounce })
    })
  )

  cleanups.push(
    _add(el, 'pointerenter', (e) => {
      if (!state.cfg.hover) return
      if ((e as PointerEvent).pointerType !== 'mouse') return
      emitHoverSfx(state.cfg.hover, { debounce: state.cfg.debounce })
    })
  )

  cleanups.push(
    _add(el, 'focus', () => {
      if (!state.cfg.focus) return
      emitSfx(state.cfg.focus, { debounce: state.cfg.debounce })
    })
  )

  cleanups.push(
    _add(el, 'blur', () => {
      if (!state.cfg.blur) return
      emitSfx(state.cfg.blur, { debounce: state.cfg.debounce })
    })
  )

  state.cleanup = () => cleanups.forEach((c) => c())
  ;(el as any)[STATE_KEY] = state
}

function _add(el: HTMLElement, event: string, handler: EventListener) {
  el.addEventListener(event, handler, { passive: true })
  return () => el.removeEventListener(event, handler)
}

function _parseBinding(
  binding: SfxBindingValue,
  mods: Partial<Record<string, boolean>>
): SfxOptions {
  if (typeof binding === 'string') {
    // binding is an audio key
    let c: SfxOptions = {}

    // add audio key to all options specified in modifiers
    if (mods.click) c.click = binding
    if (mods.hover) c.hover = binding
    if (mods.focus) c.focus = binding
    if (mods.blur) c.blur = binding

    return c // return new SfxOptions object
  }

  return binding // binding is an SfxOptions object
}
