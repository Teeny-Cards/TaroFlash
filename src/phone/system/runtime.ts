import { ref, shallowRef } from 'vue'
import type {
  AppContext,
  AppController,
  PhoneApp,
  PhoneContext,
  PhoneNotification,
  TransitionPreset,
  ViewApp
} from './types'

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

export function createPhoneRuntime({
  openFullApp
}: {
  openFullApp: (app: ViewApp, controller: AppController | undefined) => void
}) {
  const active_session = shallowRef<AppSession | null>(null)
  const transition = ref<TransitionPreset>('slide-left')
  const notifications = ref<PhoneNotification[]>([])

  const _registry: Record<string, AppSession> = {}

  function notify(n: PhoneNotification) {
    const idx = notifications.value.findIndex((x) => x.app_id === n.app_id)
    if (idx >= 0) notifications.value[idx] = n
    else notifications.value.push(n)
  }

  function clearNotification(app_id: string) {
    notifications.value = notifications.value.filter((x) => x.app_id !== app_id)
  }

  function init(apps: PhoneApp[], ctx: PhoneContext) {
    for (const app of apps) {
      const app_ctx: AppContext = {
        ...ctx,
        notify: (payload) => notify({ ...payload, app_id: app.id }),
        clearNotification: () => clearNotification(app.id)
      }

      _registry[app.id] = {
        app,
        controller: app.controller?.(app_ctx)
      }

      if (app.mount_policy === 'immediate') {
        _registry[app.id].controller?.setup?.()
      }
    }
  }

  async function open(id: string, t: TransitionPreset = 'slide-left') {
    const { app, controller } = _registry[id]

    clearNotification(id)

    if (app.type === 'trigger') {
      await controller?.run?.()
      return
    }

    if (app.type === 'view' && app.display === 'full') {
      await controller?.setup?.()
      openFullApp(app, controller)
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
    notifications,
    phoneOS: {
      open,
      close,
      clear
    }
  }
}
