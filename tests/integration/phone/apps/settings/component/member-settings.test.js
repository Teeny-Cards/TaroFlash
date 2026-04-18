import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'
import { shallowMount } from '@vue/test-utils'
import { defineComponent, h, useAttrs } from 'vue'

const { mockModalOpen, subscriptionState } = vi.hoisted(() => ({
  mockModalOpen: vi.fn(),
  subscriptionState: {
    plan: 'paid',
    isLoading: false,
    error: null,
    data: { subscription: { id: 'sub_1' }, upcoming: null }
  }
}))

vi.mock('@/stores/member', () => ({
  useMemberStore: () => ({
    display_name: 'Alice',
    email: 'alice@example.com',
    get plan() {
      return subscriptionState.plan
    }
  })
}))

vi.mock('@/api/billing', () => {
  const noopMutation = () => ({ mutateAsync: vi.fn(), isLoading: { value: false } })
  const noopQuery = () => ({
    isLoading: { value: false },
    error: { value: null },
    data: { value: null }
  })
  return {
    useSubscriptionQuery: () => ({
      isLoading: {
        get value() {
          return subscriptionState.isLoading
        }
      },
      error: {
        get value() {
          return subscriptionState.error
        }
      },
      data: {
        get value() {
          return subscriptionState.data
        }
      }
    }),
    useInvoicesQuery: noopQuery,
    usePaymentMethodsQuery: noopQuery,
    useChangePlanMutation: noopMutation,
    useCancelSubscriptionMutation: noopMutation,
    useResumeSubscriptionMutation: noopMutation,
    useSetDefaultPaymentMethodMutation: noopMutation,
    useDetachPaymentMethodMutation: noopMutation,
    useCreateSetupIntentMutation: noopMutation
  }
})

vi.mock('@/composables/modal', () => ({
  useModal: () => ({ open: mockModalOpen })
}))

vi.mock('@/components/modals/checkout.vue', () => ({
  default: { name: 'Checkout' }
}))

const SectionHeaderStub = defineComponent({
  name: 'SectionHeader',
  inheritAttrs: false,
  setup(_props, { slots }) {
    const attrs = useAttrs()
    return () => h('div', { ...attrs, 'data-testid': 'section-header-stub' }, slots.default?.())
  }
})

const UiInputStub = defineComponent({
  name: 'UiInput',
  props: ['value'],
  setup(props) {
    return () => h('input', { 'data-testid': 'ui-input-stub', value: props.value })
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

async function makeMemberSettings() {
  const MemberSettings = (await import('@/phone/apps/settings/component/member-settings.vue'))
    .default

  return shallowMount(MemberSettings, {
    global: {
      stubs: {
        SectionHeader: SectionHeaderStub,
        UiInput: UiInputStub,
        UiButton: UiButtonStub,
        PlanSection: {
          name: 'PlanSection',
          render: () => h('div', { 'data-testid': 'plan-section-stub' })
        },
        PaymentMethodsSection: {
          name: 'PaymentMethodsSection',
          render: () => h('div', { 'data-testid': 'payment-methods-stub' })
        },
        InvoicesSection: {
          name: 'InvoicesSection',
          render: () => h('div', { 'data-testid': 'invoices-stub' })
        }
      }
    }
  })
}

beforeEach(() => {
  mockModalOpen.mockReset()
  subscriptionState.plan = 'paid'
  subscriptionState.isLoading = false
  subscriptionState.error = null
  subscriptionState.data = { subscription: { id: 'sub_1' }, upcoming: null }
})

describe('member-settings — general', () => {
  test('renders the general section', async () => {
    const wrapper = await makeMemberSettings()
    expect(wrapper.find('[data-testid="member-settings__general"]').exists()).toBe(true)
  })

  test('renders display name and email inputs from the member store', async () => {
    const wrapper = await makeMemberSettings()
    const inputs = wrapper.findAll('[data-testid="ui-input-stub"]')
    expect(inputs.length).toBe(2)
    const values = inputs.map((i) => i.attributes('value'))
    expect(values).toContain('Alice')
    expect(values).toContain('alice@example.com')
  })
})

describe('member-settings — billing (free plan)', () => {
  beforeEach(() => {
    subscriptionState.plan = 'free'
  })

  test('renders the free-plan upgrade prompt', async () => {
    const wrapper = await makeMemberSettings()
    expect(wrapper.find('[data-testid="member-settings__free"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="plan-section-stub"]').exists()).toBe(false)
  })

  test('clicking upgrade opens the Checkout modal as a mobile sheet', async () => {
    const wrapper = await makeMemberSettings()
    await wrapper.find('[data-testid="member-settings__upgrade"]').trigger('click')
    expect(mockModalOpen).toHaveBeenCalledWith(expect.objectContaining({ name: 'Checkout' }), {
      mode: 'mobile-sheet',
      backdrop: true
    })
  })
})

describe('member-settings — billing (paid plan)', () => {
  test('renders the loading state while the query resolves', async () => {
    subscriptionState.isLoading = true
    const wrapper = await makeMemberSettings()
    expect(wrapper.find('[data-testid="member-settings__billing-loading"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="plan-section-stub"]').exists()).toBe(false)
  })

  test('renders the error state when the query fails', async () => {
    subscriptionState.error = new Error('boom')
    const wrapper = await makeMemberSettings()
    expect(wrapper.find('[data-testid="member-settings__billing-error"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="plan-section-stub"]').exists()).toBe(false)
  })

  test('renders all three billing sections once loaded', async () => {
    const wrapper = await makeMemberSettings()
    expect(wrapper.find('[data-testid="plan-section-stub"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="payment-methods-stub"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="invoices-stub"]').exists()).toBe(true)
  })

  test('does not render the free-plan prompt', async () => {
    const wrapper = await makeMemberSettings()
    expect(wrapper.find('[data-testid="member-settings__free"]').exists()).toBe(false)
  })
})
