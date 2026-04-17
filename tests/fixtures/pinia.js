import { createApp } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { PiniaColada } from '@pinia/colada'

/**
 * Activates a fresh Pinia instance with the Pinia Colada plugin installed.
 * Call in `beforeEach` for tests that touch stores, composables, or api
 * hooks (`useXxxQuery` / `useXxxMutation`).
 */
export function setupTestPinia() {
  const pinia = createPinia()
  pinia.use(() => {}) // no-op to match plugin wiring shape
  setActivePinia(pinia)
  // PiniaColada registers a Vue plugin, so we need a host app to install it
  // against. The app is only for plugin wiring — mount it to a detached node.
  const app = createApp({ setup: () => () => null })
  app.use(pinia)
  app.use(PiniaColada)
  app.mount(document.createElement('div'))
  return { pinia, app }
}

/**
 * Runs a composable inside a host component with Pinia + Pinia Colada
 * available. Returns [result, app] — call `app.unmount()` to trigger
 * onUnmounted hooks and tear down the cache.
 */
export function withColada(composable) {
  let result
  const app = createApp({
    setup() {
      result = composable()
      return () => null
    }
  })
  const pinia = createPinia()
  app.use(pinia)
  app.use(PiniaColada)
  app.mount(document.createElement('div'))
  return [result, app]
}
