import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'
import { shallowMount, flushPromises } from '@vue/test-utils'
import { defineComponent, h, useAttrs } from 'vue'

const {
  setDefaultMutateMock,
  detachMutateMock,
  modalOpenMock,
  toastSuccessMock,
  toastErrorMock,
  queryState,
  mutationState
} = vi.hoisted(() => ({
  setDefaultMutateMock: vi.fn(),
  detachMutateMock: vi.fn(),
  modalOpenMock: vi.fn(),
  toastSuccessMock: vi.fn(),
  toastErrorMock: vi.fn(),
  queryState: { isLoading: false, data: null },
  mutationState: { setDefaultLoading: false, detachLoading: false }
}))

vi.mock('@/api/billing', () => ({
  usePaymentMethodsQuery: () => ({
    isLoading: {
      get value() {
        return queryState.isLoading
      }
    },
    data: {
      get value() {
        return queryState.data
      }
    }
  }),
  useSetDefaultPaymentMethodMutation: () => ({
    mutateAsync: setDefaultMutateMock,
    isLoading: {
      get value() {
        return mutationState.setDefaultLoading
      }
    }
  }),
  useDetachPaymentMethodMutation: () => ({
    mutateAsync: detachMutateMock,
    isLoading: {
      get value() {
        return mutationState.detachLoading
      }
    }
  })
}))

vi.mock('@/composables/modal', () => ({
  useModal: () => ({ open: modalOpenMock })
}))

vi.mock('@/composables/toast', () => ({
  useToast: () => ({ success: toastSuccessMock, error: toastErrorMock })
}))

vi.mock('@/phone/apps/settings/component/billing-settings/add-credit-card-modal.vue', () => ({
  default: { name: 'AddCreditCardModal' }
}))

const LabeledSectionStub = defineComponent({
  name: 'LabeledSection',
  inheritAttrs: false,
  setup(_props, { slots }) {
    const attrs = useAttrs()
    return () => h('div', { ...attrs, 'data-testid': 'labeled-section-stub' }, slots.default?.())
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

async function makePaymentMethodsSection() {
  const PaymentMethodsSection = (
    await import('@/phone/apps/settings/component/billing-settings/payment-methods-section.vue')
  ).default

  return shallowMount(PaymentMethodsSection, {
    global: {
      stubs: {
        LabeledSection: LabeledSectionStub,
        UiButton: UiButtonStub
      }
    }
  })
}

function card(id, brand, last4, month = 12, year = 2030) {
  return { id, card: { brand, last4, exp_month: month, exp_year: year } }
}

beforeEach(() => {
  setDefaultMutateMock.mockReset()
  detachMutateMock.mockReset()
  modalOpenMock.mockReset()
  toastSuccessMock.mockReset()
  toastErrorMock.mockReset()
  queryState.isLoading = false
  queryState.data = null
  mutationState.setDefaultLoading = false
  mutationState.detachLoading = false
})

describe('payment-methods-section — list states', () => {
  test('shows the loading state while the query is pending', async () => {
    queryState.isLoading = true
    const wrapper = await makePaymentMethodsSection()
    expect(wrapper.find('[data-testid="billing-settings__payment-methods-loading"]').exists()).toBe(
      true
    )
  })

  test('shows the empty state when no cards are returned', async () => {
    queryState.data = { paymentMethods: [], defaultPaymentMethodId: null }
    const wrapper = await makePaymentMethodsSection()
    expect(wrapper.find('[data-testid="billing-settings__payment-methods-empty"]').exists()).toBe(
      true
    )
  })

  test('renders one list item per payment method', async () => {
    queryState.data = {
      paymentMethods: [card('pm_1', 'visa', '4242'), card('pm_2', 'mastercard', '5555')],
      defaultPaymentMethodId: null
    }
    const wrapper = await makePaymentMethodsSection()
    expect(wrapper.find('[data-testid="billing-settings__payment-method-pm_1"]').exists()).toBe(
      true
    )
    expect(wrapper.find('[data-testid="billing-settings__payment-method-pm_2"]').exists()).toBe(
      true
    )
  })
})

describe('payment-methods-section — default handling', () => {
  test('marks the default card with a default badge and hides the make-default button', async () => {
    queryState.data = {
      paymentMethods: [card('pm_1', 'visa', '4242')],
      defaultPaymentMethodId: 'pm_1'
    }
    const wrapper = await makePaymentMethodsSection()
    expect(wrapper.find('[data-testid="billing-settings__payment-method-default"]').exists()).toBe(
      true
    )
    expect(
      wrapper.find('[data-testid="billing-settings__payment-method-make-default-pm_1"]').exists()
    ).toBe(false)
  })

  test('clicking make-default calls setDefaultPaymentMethod with the pm id', async () => {
    setDefaultMutateMock.mockResolvedValue({})
    queryState.data = {
      paymentMethods: [card('pm_1', 'visa', '4242'), card('pm_2', 'visa', '1111')],
      defaultPaymentMethodId: 'pm_1'
    }
    const wrapper = await makePaymentMethodsSection()
    await wrapper
      .find('[data-testid="billing-settings__payment-method-make-default-pm_2"]')
      .trigger('click')
    await flushPromises()
    expect(setDefaultMutateMock).toHaveBeenCalledWith('pm_2')
    expect(toastSuccessMock).toHaveBeenCalled()
  })

  test('toasts an error when make-default mutation rejects', async () => {
    setDefaultMutateMock.mockRejectedValue(new Error('api'))
    queryState.data = {
      paymentMethods: [card('pm_1', 'visa', '4242'), card('pm_2', 'visa', '1111')],
      defaultPaymentMethodId: 'pm_1'
    }
    const wrapper = await makePaymentMethodsSection()
    await wrapper
      .find('[data-testid="billing-settings__payment-method-make-default-pm_2"]')
      .trigger('click')
    await flushPromises()
    expect(toastErrorMock).toHaveBeenCalled()
  })
})

describe('payment-methods-section — detach', () => {
  test('clicking detach calls detachPaymentMethod and toasts success', async () => {
    detachMutateMock.mockResolvedValue({})
    queryState.data = {
      paymentMethods: [card('pm_1', 'visa', '4242')],
      defaultPaymentMethodId: null
    }
    const wrapper = await makePaymentMethodsSection()
    await wrapper
      .find('[data-testid="billing-settings__payment-method-detach-pm_1"]')
      .trigger('click')
    await flushPromises()
    expect(detachMutateMock).toHaveBeenCalledWith('pm_1')
    expect(toastSuccessMock).toHaveBeenCalled()
  })

  test('toasts an error when detach mutation rejects', async () => {
    detachMutateMock.mockRejectedValue(new Error('api'))
    queryState.data = {
      paymentMethods: [card('pm_1', 'visa', '4242')],
      defaultPaymentMethodId: null
    }
    const wrapper = await makePaymentMethodsSection()
    await wrapper
      .find('[data-testid="billing-settings__payment-method-detach-pm_1"]')
      .trigger('click')
    await flushPromises()
    expect(toastErrorMock).toHaveBeenCalled()
  })
})

describe('payment-methods-section — add card', () => {
  test('clicking add opens the AddCreditCardModal as a mobile sheet', async () => {
    queryState.data = { paymentMethods: [], defaultPaymentMethodId: null }
    const wrapper = await makePaymentMethodsSection()
    await wrapper.find('[data-testid="billing-settings__payment-methods-add"]').trigger('click')
    expect(modalOpenMock).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'AddCreditCardModal' }),
      {
        mode: 'mobile-sheet',
        backdrop: true
      }
    )
  })
})
