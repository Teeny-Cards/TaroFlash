import { ref, shallowRef } from 'vue'
import type { AppController, PhoneApp, PhoneContext, TransitionPreset, ViewApp } from './types'

export type AppSession = {
  app: PhoneApp
  controller: AppController | undefined
}

const reverse_transition: Record<TransitionPreset, TransitionPreset> = {
  'slide-left': 'slide-right',
  'slide-right': 'slide-left',
  'pop-up': 'pop-down',
  'pop-down': 'pop-up',
  none: 'none'
}

export function createPhoneRuntime({ openFullApp }: { openFullApp: (app: ViewApp) => void }) {
  const active_session = shallowRef<AppSession | null>(null)
  const transition = ref<TransitionPreset>('slide-left')

  const _registry: Record<string, AppSession> = {}

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

  async function open(id: string, t: TransitionPreset = 'slide-left') {
    const { app, controller } = _registry[id]

    if (app.type === 'trigger') {
      await controller?.run?.()
      return
    }

    if (app.type === 'view' && app.display === 'full') {
      await controller?.setup?.()
      openFullApp(app)
      return
    }

    transition.value = t
    active_session.value = _registry[id]
    await controller?.setup?.()
  }

  function close() {
    transition.value = reverse_transition[transition.value]
    active_session.value = null
  }

  function clear() {
    transition.value = reverse_transition[transition.value]
    active_session.value = null
  }

  return {
    init,
    active_session,
    transition,
    phoneOS: {
      open,
      close,
      clear
    }
  }
}
