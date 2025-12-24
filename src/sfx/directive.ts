// sfx/directive.ts
import type { Directive } from 'vue'
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

export const vSfx: Directive<HTMLElement, SfxBindingValue> = {
  mounted(el, binding) {
    if (!binding.value) return

    const cleanups: Cleanup[] = []
    const mods = binding.modifiers
    const cfg = _parseBinding(binding.value, mods)

    if (cfg.click) {
      cleanups.push(
        _add(el, 'click', (e) => {
          if (mods.prevent) e.preventDefault()
          if (mods.stop) e.stopPropagation()

          emitSfx(cfg.click!, { debounce: cfg.debounce })
        })
      )
    }

    if (cfg.hover) {
      cleanups.push(
        _add(el, 'mouseenter', () => {
          emitHoverSfx(cfg.hover!, {
            debounce: cfg.debounce
          })
        })
      )
    }

    if (cfg.focus) {
      cleanups.push(_add(el, 'focus', () => emitSfx(cfg.focus!, { debounce: cfg.debounce })))
    }

    if (cfg.blur) {
      cleanups.push(_add(el, 'blur', () => emitSfx(cfg.blur!, { debounce: cfg.debounce })))
    }

    ;(el as any).__vSfxCleanup = () => cleanups.forEach((c) => c())
  },

  beforeUnmount(el) {
    ;(el as any).__vSfxCleanup?.()
  }
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
