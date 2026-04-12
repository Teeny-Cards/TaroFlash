import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'
import { createPhoneRuntime } from '@/phone/system/runtime'

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeCtx(overrides = {}) {
  return {
    open: vi.fn(),
    close: vi.fn(),
    clear: vi.fn(),
    t: vi.fn((k) => k),
    ...overrides
  }
}

function makePanelApp(overrides = {}) {
  return {
    id: 'panel-app',
    title: 'Panel App',
    type: 'view',
    display: 'panel',
    component: {},
    ...overrides
  }
}

function makeFullApp(overrides = {}) {
  return {
    id: 'full-app',
    title: 'Full App',
    type: 'view',
    display: 'full',
    component: {},
    ...overrides
  }
}

function makeTriggerApp(overrides = {}) {
  return {
    id: 'trigger-app',
    title: 'Trigger App',
    type: 'trigger',
    ...overrides
  }
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('createPhoneRuntime', () => {
  let openFullApp
  let runtime

  beforeEach(() => {
    openFullApp = vi.fn()
    runtime = createPhoneRuntime({ openFullApp })
  })

  // ── init ──────────────────────────────────────────────────────────────────

  describe('init', () => {
    test('registers apps and leaves controller undefined for lazy apps', () => {
      const controller = vi.fn()
      const app = makePanelApp({ controller })
      runtime.init([app], makeCtx())

      // controller factory not yet called — lazy by default
      expect(controller).not.toHaveBeenCalled()
    })

    test('immediately instantiates controller for mount_policy=immediate apps', () => {
      const controllerFactory = vi.fn().mockReturnValue({})
      const app = makePanelApp({ mount_policy: 'immediate', controller: controllerFactory })
      runtime.init([app], makeCtx())

      expect(controllerFactory).toHaveBeenCalledOnce()
    })

    test('does not call controller factory for mount_policy=lazy apps', () => {
      const controllerFactory = vi.fn().mockReturnValue({})
      const app = makePanelApp({ mount_policy: 'lazy', controller: controllerFactory })
      runtime.init([app], makeCtx())

      expect(controllerFactory).not.toHaveBeenCalled()
    })
  })

  // ── open — panel/view app ─────────────────────────────────────────────────

  describe('open – panel view app', () => {
    test('sets active_session to the app session', async () => {
      const app = makePanelApp()
      runtime.init([app], makeCtx())

      await runtime.phoneOS.open('panel-app')

      expect(runtime.active_session.value?.app).toBe(app)
    })

    test('sets transition to the supplied preset', async () => {
      const app = makePanelApp()
      runtime.init([app], makeCtx())

      await runtime.phoneOS.open('panel-app', 'slide-right')

      expect(runtime.transition.value).toBe('slide-right')
    })

    test('defaults transition to slide-left', async () => {
      const app = makePanelApp()
      runtime.init([app], makeCtx())

      await runtime.phoneOS.open('panel-app')

      expect(runtime.transition.value).toBe('slide-left')
    })

    test('lazily instantiates controller on first open', async () => {
      const controllerFactory = vi.fn().mockReturnValue({})
      const app = makePanelApp({ controller: controllerFactory })
      runtime.init([app], makeCtx())

      expect(controllerFactory).not.toHaveBeenCalled()
      await runtime.phoneOS.open('panel-app')
      expect(controllerFactory).toHaveBeenCalledOnce()
    })

    test('does not re-instantiate controller on subsequent opens', async () => {
      const controllerFactory = vi.fn().mockReturnValue({})
      const app = makePanelApp({ controller: controllerFactory })
      runtime.init([app], makeCtx())

      await runtime.phoneOS.open('panel-app')
      await runtime.phoneOS.open('panel-app')

      expect(controllerFactory).toHaveBeenCalledOnce()
    })

    test('calls onOpen on the controller', async () => {
      const onOpen = vi.fn()
      const app = makePanelApp({ controller: () => ({ onOpen }) })
      runtime.init([app], makeCtx())

      await runtime.phoneOS.open('panel-app')

      expect(onOpen).toHaveBeenCalledOnce()
    })
  })

  // ── open — full view app ──────────────────────────────────────────────────

  describe('open – full view app', () => {
    test('calls openFullApp instead of setting active_session', async () => {
      const app = makeFullApp()
      runtime.init([app], makeCtx())

      await runtime.phoneOS.open('full-app')

      expect(openFullApp).toHaveBeenCalledWith(app, undefined)
      expect(runtime.active_session.value).toBeNull()
    })

    test('calls onOpen on the controller before handing off to openFullApp', async () => {
      const onOpen = vi.fn()
      const app = makeFullApp({ controller: () => ({ onOpen }) })
      runtime.init([app], makeCtx())

      await runtime.phoneOS.open('full-app')

      expect(onOpen).toHaveBeenCalledOnce()
    })
  })

  // ── open — trigger app ────────────────────────────────────────────────────

  describe('open – trigger app', () => {
    test('calls onTrigger on the controller', async () => {
      const onTrigger = vi.fn()
      const app = makeTriggerApp({ controller: () => ({ onTrigger }) })
      runtime.init([app], makeCtx())

      await runtime.phoneOS.open('trigger-app')

      expect(onTrigger).toHaveBeenCalledOnce()
    })

    test('does not set active_session', async () => {
      const app = makeTriggerApp({ controller: () => ({ onTrigger: vi.fn() }) })
      runtime.init([app], makeCtx())

      await runtime.phoneOS.open('trigger-app')

      expect(runtime.active_session.value).toBeNull()
    })
  })

  // ── clear_notifications_on_open ───────────────────────────────────────────

  describe('clear_notifications_on_open', () => {
    test('clears the notification for the app when the flag is set', async () => {
      const app = makePanelApp({ clear_notifications_on_open: true })
      runtime.init([app], makeCtx())

      // Add a notification first
      runtime.notifications.value.push({ app_id: 'panel-app', count: 3 })

      await runtime.phoneOS.open('panel-app')

      expect(runtime.notifications.value).toHaveLength(0)
    })

    test('does not clear notifications when flag is not set', async () => {
      const app = makePanelApp()
      runtime.init([app], makeCtx())
      runtime.notifications.value.push({ app_id: 'panel-app', count: 2 })

      await runtime.phoneOS.open('panel-app')

      expect(runtime.notifications.value).toHaveLength(1)
    })
  })

  // ── close ─────────────────────────────────────────────────────────────────

  describe('close', () => {
    test('clears active_session', async () => {
      const app = makePanelApp()
      runtime.init([app], makeCtx())
      await runtime.phoneOS.open('panel-app')

      runtime.phoneOS.close()

      expect(runtime.active_session.value).toBeNull()
    })

    test('reverses the current transition', async () => {
      const app = makePanelApp()
      runtime.init([app], makeCtx())
      await runtime.phoneOS.open('panel-app', 'slide-left')

      runtime.phoneOS.close()

      expect(runtime.transition.value).toBe('slide-right')
    })
  })

  // ── clear ─────────────────────────────────────────────────────────────────

  describe('clear', () => {
    test('clears active_session', async () => {
      const app = makePanelApp()
      runtime.init([app], makeCtx())
      await runtime.phoneOS.open('panel-app')

      runtime.phoneOS.clear()

      expect(runtime.active_session.value).toBeNull()
    })

    test('reverses the current transition', async () => {
      const app = makePanelApp()
      runtime.init([app], makeCtx())
      await runtime.phoneOS.open('panel-app', 'pop-up')

      runtime.phoneOS.clear()

      expect(runtime.transition.value).toBe('pop-down')
    })
  })

  // ── notifications ─────────────────────────────────────────────────────────

  describe('notifications (via AppContext)', () => {
    test('notify adds a new notification', async () => {
      const app = makePanelApp({
        controller: (ctx) => {
          ctx.notify({ count: 5 })
          return {}
        }
      })
      runtime.init([app], makeCtx())
      await runtime.phoneOS.open('panel-app')

      expect(runtime.notifications.value).toHaveLength(1)
      expect(runtime.notifications.value[0]).toMatchObject({ app_id: 'panel-app', count: 5 })
    })

    test('notify updates an existing notification for the same app', async () => {
      const app = makePanelApp({
        controller: (ctx) => {
          ctx.notify({ count: 1 })
          ctx.notify({ count: 2 })
          return {}
        }
      })
      runtime.init([app], makeCtx())
      await runtime.phoneOS.open('panel-app')

      expect(runtime.notifications.value).toHaveLength(1)
      expect(runtime.notifications.value[0].count).toBe(2)
    })

    test('clearNotification removes the notification for the app', async () => {
      const app = makePanelApp({
        controller: (ctx) => {
          ctx.notify({ count: 3 })
          ctx.clearNotification()
          return {}
        }
      })
      runtime.init([app], makeCtx())
      await runtime.phoneOS.open('panel-app')

      expect(runtime.notifications.value).toHaveLength(0)
    })
  })
})
