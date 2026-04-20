import { describe, test, expect, beforeEach, afterEach, vi } from 'vite-plus/test'
import { flushPromises, mount } from '@vue/test-utils'

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  push: vi.fn()
}))

vi.mock('@/supabase-client', () => ({
  supabase: { auth: { getSession: mocks.getSession } }
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mocks.push })
}))

import Callback from '@/views/auth/callback.vue'

function setOpener(value) {
  Object.defineProperty(window, 'opener', {
    configurable: true,
    get: () => value
  })
}

describe('auth/callback', () => {
  let closeSpy
  let originalOpenerDescriptor

  beforeEach(() => {
    mocks.getSession.mockReset()
    mocks.getSession.mockResolvedValue({ data: { session: null }, error: null })
    mocks.push.mockReset()
    originalOpenerDescriptor = Object.getOwnPropertyDescriptor(window, 'opener')
    closeSpy = vi.spyOn(window, 'close').mockImplementation(() => {})
  })

  afterEach(() => {
    closeSpy.mockRestore()
    if (originalOpenerDescriptor) {
      Object.defineProperty(window, 'opener', originalOpenerDescriptor)
    } else {
      // Best-effort reset when browser has no own descriptor for opener.
      try {
        // eslint-disable-next-line no-self-assign
        delete window.opener
      } catch {
        setOpener(null)
      }
    }
  })

  test('awaits getSession on mount', async () => {
    setOpener(null)
    mount(Callback)
    await flushPromises()
    expect(mocks.getSession).toHaveBeenCalledTimes(1)
  })

  test('pushes to the dashboard route when not running inside a popup', async () => {
    setOpener(null)
    mount(Callback)
    await flushPromises()
    expect(mocks.push).toHaveBeenCalledWith({ name: 'dashboard' })
    expect(closeSpy).not.toHaveBeenCalled()
  })

  test('closes the window when running inside a popup and does not navigate', async () => {
    setOpener({})
    mount(Callback)
    await flushPromises()
    expect(closeSpy).toHaveBeenCalledTimes(1)
    expect(mocks.push).not.toHaveBeenCalled()
  })

  test('ignores a self-referential opener (same window) and routes to dashboard', async () => {
    setOpener(window)
    mount(Callback)
    await flushPromises()
    expect(closeSpy).not.toHaveBeenCalled()
    expect(mocks.push).toHaveBeenCalledWith({ name: 'dashboard' })
  })
})
