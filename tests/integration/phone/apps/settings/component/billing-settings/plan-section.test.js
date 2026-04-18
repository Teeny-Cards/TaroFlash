import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'
import { shallowMount, flushPromises } from '@vue/test-utils'
import { defineComponent, h, useAttrs } from 'vue'

const { cancelMutateMock, resumeMutateMock, toastSuccessMock, toastErrorMock, mutationState } =
  vi.hoisted(() => ({
    cancelMutateMock: vi.fn(),
    resumeMutateMock: vi.fn(),
    toastSuccessMock: vi.fn(),
    toastErrorMock: vi.fn(),
    mutationState: { cancelLoading: false, resumeLoading: false }
  }))

vi.mock('@/api/billing', () => ({
  useCancelSubscriptionMutation: () => ({
    mutateAsync: cancelMutateMock,
    isLoading: {
      get value() {
        return mutationState.cancelLoading
      }
    }
  }),
  useResumeSubscriptionMutation: () => ({
    mutateAsync: resumeMutateMock,
    isLoading: {
      get value() {
        return mutationState.resumeLoading
      }
    }
  })
}))

vi.mock('@/composables/toast', () => ({
  useToast: () => ({ success: toastSuccessMock, error: toastErrorMock })
}))

const SectionHeaderStub = defineComponent({
  name: 'SectionHeader',
  inheritAttrs: false,
  setup(_props, { slots }) {
    const attrs = useAttrs()
    return () => h('div', { ...attrs, 'data-testid': 'section-header-stub' }, slots.default?.())
  }
})

const UiButtonStub = defineComponent({
  name: 'UiButton',
  inheritAttrs: false,
  emits: ['click'],
  setup(_props, { slots, emit }) {
    const attrs = useAttrs()
    return () => h('button', { ...attrs, onClick: () => emit('click') }, slots.default?.())
  }
})

function makeSubscriptionQuery(subscription) {
  return {
    data: { value: { subscription, upcoming: null } },
    isLoading: { value: false },
    error: { value: null }
  }
}

const baseSubscription = {
  id: 'sub_1',
  status: 'active',
  current_period_end: 1800000000,
  cancel_at_period_end: false,
  canceled_at: null,
  items: {
    data: [
      {
        id: 'si_1',
        price: {
          id: 'price_1',
          unit_amount: 1000,
          currency: 'usd',
          recurring: { interval: 'month' },
          product: { id: 'prod_1', name: 'Pro Plan' }
        }
      }
    ]
  },
  default_payment_method: null
}

async function makePlanSection(subscription = baseSubscription) {
  const PlanSection = (
    await import('@/phone/apps/settings/component/billing-settings/plan-section.vue')
  ).default

  return shallowMount(PlanSection, {
    props: { subscriptionQuery: makeSubscriptionQuery(subscription) },
    global: {
      stubs: {
        SectionHeader: SectionHeaderStub,
        UiButton: UiButtonStub
      }
    }
  })
}

beforeEach(() => {
  cancelMutateMock.mockReset()
  resumeMutateMock.mockReset()
  toastSuccessMock.mockReset()
  toastErrorMock.mockReset()
  mutationState.cancelLoading = false
  mutationState.resumeLoading = false
})

describe('plan-section — plan details', () => {
  test('renders the product name from the subscription price', async () => {
    const wrapper = await makePlanSection()
    expect(wrapper.find('[data-testid="billing-settings__plan-name"]').text()).toContain('Pro Plan')
  })

  test('formats the price with currency and interval', async () => {
    const wrapper = await makePlanSection()
    const price = wrapper.find('[data-testid="billing-settings__plan-price"]')
    expect(price.text()).toContain('10.00')
    expect(price.text()).toContain('USD')
    expect(price.text()).toContain('month')
  })

  test('shows the renewal date when subscription is not set to cancel', async () => {
    const wrapper = await makePlanSection()
    const renewal = wrapper.find('[data-testid="billing-settings__plan-renewal"]')
    expect(renewal.exists()).toBe(true)
    expect(renewal.text()).toMatch(/Renews/i)
  })

  test('shows the cancellation date when cancel_at_period_end is true', async () => {
    const wrapper = await makePlanSection({ ...baseSubscription, cancel_at_period_end: true })
    const renewal = wrapper.find('[data-testid="billing-settings__plan-renewal"]')
    expect(renewal.text()).toMatch(/Cancels/i)
  })

  test('renders a translated status label', async () => {
    const wrapper = await makePlanSection({ ...baseSubscription, status: 'active' })
    expect(wrapper.find('[data-testid="billing-settings__plan-status"]').text()).toBe('Active')
  })
})

describe('plan-section — cancel flow (inline confirm)', () => {
  test('starts collapsed with only the cancel trigger visible', async () => {
    const wrapper = await makePlanSection()
    expect(wrapper.find('[data-testid="billing-settings__plan-cancel"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="billing-settings__plan-cancel-confirm"]').exists()).toBe(
      false
    )
  })

  test('clicking cancel reveals the confirm + abort buttons', async () => {
    const wrapper = await makePlanSection()
    await wrapper.find('[data-testid="billing-settings__plan-cancel"]').trigger('click')
    expect(wrapper.find('[data-testid="billing-settings__plan-cancel-confirm"]').exists()).toBe(
      true
    )
    expect(wrapper.find('[data-testid="billing-settings__plan-cancel-abort"]').exists()).toBe(true)
  })

  test('abort returns to the collapsed state', async () => {
    const wrapper = await makePlanSection()
    await wrapper.find('[data-testid="billing-settings__plan-cancel"]').trigger('click')
    await wrapper.find('[data-testid="billing-settings__plan-cancel-abort"]').trigger('click')
    expect(wrapper.find('[data-testid="billing-settings__plan-cancel"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="billing-settings__plan-cancel-confirm"]').exists()).toBe(
      false
    )
  })

  test('confirm calls cancelSubscription with atPeriodEnd=true and toasts success', async () => {
    cancelMutateMock.mockResolvedValue({ subscription: baseSubscription })
    const wrapper = await makePlanSection()
    await wrapper.find('[data-testid="billing-settings__plan-cancel"]').trigger('click')
    await wrapper.find('[data-testid="billing-settings__plan-cancel-confirm"]').trigger('click')
    await flushPromises()
    expect(cancelMutateMock).toHaveBeenCalledWith(true)
    expect(toastSuccessMock).toHaveBeenCalled()
  })

  test('toasts an error when the cancel mutation rejects', async () => {
    cancelMutateMock.mockRejectedValue(new Error('api down'))
    const wrapper = await makePlanSection()
    await wrapper.find('[data-testid="billing-settings__plan-cancel"]').trigger('click')
    await wrapper.find('[data-testid="billing-settings__plan-cancel-confirm"]').trigger('click')
    await flushPromises()
    expect(toastErrorMock).toHaveBeenCalled()
    expect(toastSuccessMock).not.toHaveBeenCalled()
  })
})

describe('plan-section — resume flow', () => {
  test('shows the resume button when cancel_at_period_end is true', async () => {
    const wrapper = await makePlanSection({ ...baseSubscription, cancel_at_period_end: true })
    expect(wrapper.find('[data-testid="billing-settings__plan-resume"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="billing-settings__plan-cancel"]').exists()).toBe(false)
  })

  test('clicking resume calls resumeSubscription and toasts success', async () => {
    resumeMutateMock.mockResolvedValue({ subscription: baseSubscription })
    const wrapper = await makePlanSection({ ...baseSubscription, cancel_at_period_end: true })
    await wrapper.find('[data-testid="billing-settings__plan-resume"]').trigger('click')
    await flushPromises()
    expect(resumeMutateMock).toHaveBeenCalled()
    expect(toastSuccessMock).toHaveBeenCalled()
  })

  test('toasts an error when the resume mutation rejects', async () => {
    resumeMutateMock.mockRejectedValue(new Error('api down'))
    const wrapper = await makePlanSection({ ...baseSubscription, cancel_at_period_end: true })
    await wrapper.find('[data-testid="billing-settings__plan-resume"]').trigger('click')
    await flushPromises()
    expect(toastErrorMock).toHaveBeenCalled()
  })
})

describe('plan-section — edge cases', () => {
  test('falls back to "Unknown plan" when the product is a string id (unexpanded)', async () => {
    const wrapper = await makePlanSection({
      ...baseSubscription,
      items: {
        data: [
          {
            id: 'si_1',
            price: {
              ...baseSubscription.items.data[0].price,
              product: 'prod_1'
            }
          }
        ]
      }
    })
    expect(wrapper.find('[data-testid="billing-settings__plan-name"]').text()).toContain(
      'Unknown plan'
    )
  })

  test('hides the price line when unit_amount is null (free price, edge case)', async () => {
    const wrapper = await makePlanSection({
      ...baseSubscription,
      items: {
        data: [
          {
            id: 'si_1',
            price: { ...baseSubscription.items.data[0].price, unit_amount: null }
          }
        ]
      }
    })
    expect(wrapper.find('[data-testid="billing-settings__plan-price"]').exists()).toBe(false)
  })
})
