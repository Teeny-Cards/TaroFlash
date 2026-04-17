import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'

const { useMutationSpy, createSubscriptionMock, createPortalSessionMock } = vi.hoisted(() => ({
  useMutationSpy: vi.fn((cfg) => cfg),
  createSubscriptionMock: vi.fn().mockResolvedValue({
    clientSecret: 'pi_secret_x',
    subscriptionId: 'sub_1'
  }),
  createPortalSessionMock: vi.fn().mockResolvedValue({ url: 'https://portal' })
}))

vi.mock('@pinia/colada', () => ({ useMutation: useMutationSpy }))

vi.mock('@/api/billing/db', () => ({
  createSubscription: createSubscriptionMock,
  createPortalSession: createPortalSessionMock
}))

import { useCreateSubscriptionMutation } from '@/api/billing/mutations/create-subscription'
import { useCreatePortalSessionMutation } from '@/api/billing/mutations/create-portal-session'

beforeEach(() => {
  useMutationSpy.mockClear()
  createSubscriptionMock.mockClear()
  createPortalSessionMock.mockClear()
})

function configFrom(hook) {
  hook()
  return useMutationSpy.mock.calls.at(-1)[0]
}

describe('useCreateSubscriptionMutation', () => {
  test('delegates to createSubscription with the caller args', async () => {
    const { mutation } = configFrom(useCreateSubscriptionMutation)
    await mutation({ planId: 'paid' })
    expect(createSubscriptionMock).toHaveBeenCalledWith({ planId: 'paid' })
  })

  test('returns whatever createSubscription resolved with', async () => {
    const { mutation } = configFrom(useCreateSubscriptionMutation)
    const result = await mutation({ planId: 'paid' })
    expect(result).toEqual({ clientSecret: 'pi_secret_x', subscriptionId: 'sub_1' })
  })
})

describe('useCreatePortalSessionMutation', () => {
  test('delegates to createPortalSession with the caller args', async () => {
    const { mutation } = configFrom(useCreatePortalSessionMutation)
    await mutation({ returnUrl: 'https://app' })
    expect(createPortalSessionMock).toHaveBeenCalledWith({ returnUrl: 'https://app' })
  })

  test('returns the portal url', async () => {
    const { mutation } = configFrom(useCreatePortalSessionMutation)
    const result = await mutation({ returnUrl: 'https://app' })
    expect(result).toEqual({ url: 'https://portal' })
  })
})
