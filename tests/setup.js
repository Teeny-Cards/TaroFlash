import { config } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import messages from '@intlify/unplugin-vue-i18n/messages'

const i18n = createI18n({
  locale: 'en-us',
  legacy: false,
  messages
})

config.global.plugins = [i18n]

// window.matchMedia is not implemented in jsdom. use-theme.ts calls it at
// module scope, so the mock must live in setup (runs before any import).
// Tests control `matches` via global.__matchMedia and fire the 'change'
// listener to simulate an OS preference flip.
const _matchMediaState = {
  matches: false,
  listeners: []
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    get matches() {
      return _matchMediaState.matches
    },
    media: query,
    onchange: null,
    addEventListener(type, listener) {
      if (type === 'change') _matchMediaState.listeners.push(listener)
    },
    removeEventListener() {},
    dispatchEvent: () => false
  })
})

global.__matchMedia = _matchMediaState
