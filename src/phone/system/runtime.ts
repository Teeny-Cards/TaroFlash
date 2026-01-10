import { ref, shallowRef } from 'vue'
import type { AppController, PhoneApp, PhoneContext } from './types'
import type { PhoneNavigator, NavigateEvent, TransitionPreset } from './phone-navigator'

export type AppSession = {
  app: PhoneApp
  controller: AppController | undefined
}

export function createPhoneRuntime({ nav }: { nav: PhoneNavigator }) {
  const active_session = shallowRef<AppSession | null>(null)
  const loading = ref(false)

  const _registry: Record<string, AppSession> = {}
  let _token = 0

  function init(apps: PhoneApp[], ctx: PhoneContext) {
    for (const app of apps) {
      _registry[app.id] = {
        app,
        controller: app.controller?.(ctx)
      }

      if (app.mount_policy === 'immediate') {
        _registry[app.id].controller?.setup?.()
      }
    }
  }

  async function open(id: string, transition: TransitionPreset = 'slide-left') {
    const { app, controller } = _registry[id]

    // handle action-only apps
    if (app.type === 'widget') {
      await controller?.run?.()
      return
    }

    const e = nav.push({ id, transition })
    _syncSession(e)
    await _loadApp(id)
  }

  function close() {
    const e = nav.pop()
    _syncSession(e)
  }

  function clear() {
    const e = nav.reset()
    _syncSession(e)
  }

  function _syncSession(e: NavigateEvent) {
    if (!e.to) {
      active_session.value = null
      return
    }

    active_session.value = _registry[e.to.id]
  }

  async function _loadApp(id: string) {
    const { controller } = _registry[id]
    const setupFn = controller?.setup
    if (!setupFn) return

    const my_token = ++_token
    loading.value = true

    try {
      await setupFn()
    } finally {
      if (my_token === _token) loading.value = false
    }
  }

  return {
    init,
    active_session,
    phoneOS: {
      open,
      close,
      clear,
      loading
    }
  }
}
