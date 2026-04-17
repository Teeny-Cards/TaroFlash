import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'
import { shallowMount, flushPromises } from '@vue/test-utils'
import { defineComponent, h, useAttrs } from 'vue'

// ── Hoisted mocks ──────────────────────────────────────────────────────────────

const { mockPortalMutate, mockModalOpen, mockToastError, state } = vi.hoisted(() => ({
  mockPortalMutate: vi.fn(),
  mockModalOpen: vi.fn(),
  mockToastError: vi.fn(),
  state: { plan: 'free', deckCount: 0 }
}))

vi.mock('@/stores/member', () => ({
  useMemberStore: () => ({
    get plan() {
      return state.plan
    },
    display_name: 'Alice',
    email: 'alice@example.com'
  })
}))

vi.mock('@/api/decks', async () => {
  const { ref } = await vi.importActual('vue')
  return {
    useMemberDeckCountQuery: () => ({
      data: {
        get value() {
          return state.deckCount
        }
      }
    })
  }
})

vi.mock('@/api/billing', () => ({
  useCreatePortalSessionMutation: () => ({ mutateAsync: mockPortalMutate })
}))

vi.mock('@/composables/modal', () => ({
  useModal: () => ({ open: mockModalOpen })
}))

vi.mock('@/composables/toast', () => ({
  useToast: () => ({ error: mockToastError })
}))

vi.mock('@/components/modals/checkout.vue', () => ({
  default: { name: 'Checkout' }
}))

// ── Stubs (render functions — no runtime compiler in browser mode) ────────────

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
  setup() {
    return () => h('input', { 'data-testid': 'ui-input-stub' })
  }
})

const UiButtonStub = defineComponent({
  name: 'UiButton',
  inheritAttrs: false,
  emits: ['click'],
  setup(_props, { slots, emit }) {
    const attrs = useAttrs()
    return () =>
      h(
        'button',
        {
          ...attrs,
          onClick: () => emit('click')
        },
        slots.default?.()
      )
  }
})

// ── Component-under-test loader ────────────────────────────────────────────────

async function makeMemberSettings() {
  const MemberSettings = (
    await import('@/phone/apps/settings/component/member-settings.vue')
  ).default

  return shallowMount(MemberSettings, {
    global: {
      stubs: {
        SectionHeader: SectionHeaderStub,
        UiInput: UiInputStub,
        UiButton: UiButtonStub
      }
    }
  })
}

// ── Setup ──────────────────────────────────────────────────────────────────────

beforeEach(() => {
  state.plan = 'free'
  state.deckCount = 0
  mockPortalMutate.mockReset()
  mockModalOpen.mockReset()
  mockToastError.mockReset()
})

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('member-settings subscription section', () => {
  describe('free plan', () => {
    beforeEach(() => {
      state.plan = 'free'
      state.deckCount = 3
    })

    test('renders the free-plan subsection', async () => {
      const wrapper = await makeMemberSettings()
      expect(wrapper.find('[data-testid="member-settings__subscription-free"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="member-settings__subscription-paid"]').exists()).toBe(
        false
      )
    })

    test('shows an Upgrade button', async () => {
      const wrapper = await makeMemberSettings()
      expect(
        wrapper.find('[data-testid="member-settings__subscription-upgrade"]').exists()
      ).toBe(true)
    })

    test('displays the current deck usage', async () => {
      const wrapper = await makeMemberSettings()
      const usage = wrapper.find('[data-testid="member-settings__subscription-usage"]')
      expect(usage.exists()).toBe(true)
      expect(usage.text()).toContain('3')
      expect(usage.text()).toContain('5')
    })

    test('clicking Upgrade opens the Checkout modal as a mobile sheet with backdrop', async () => {
      const wrapper = await makeMemberSettings()
      await wrapper
        .find('[data-testid="member-settings__subscription-upgrade"]')
        .trigger('click')

      expect(mockModalOpen).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Checkout' }),
        { mode: 'mobile-sheet', backdrop: true }
      )
    })
  })

  describe('paid plan', () => {
    beforeEach(() => {
      state.plan = 'paid'
    })

    test('renders the paid-plan subsection', async () => {
      const wrapper = await makeMemberSettings()
      expect(wrapper.find('[data-testid="member-settings__subscription-paid"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="member-settings__subscription-free"]').exists()).toBe(
        false
      )
    })

    test('shows a Manage billing button', async () => {
      const wrapper = await makeMemberSettings()
      expect(wrapper.find('[data-testid="member-settings__subscription-manage"]').exists()).toBe(
        true
      )
    })

    test('clicking Manage billing creates a portal session with the current URL as returnUrl', async () => {
      // Never resolves — the component redirects via `window.location.href = url`
      // on success, which navigates the test iframe away and trips Vitest's
      // iframe-connect watchdog. We only need to assert the mutation arg here.
      mockPortalMutate.mockReturnValue(new Promise(() => {}))
      const wrapper = await makeMemberSettings()

      await wrapper
        .find('[data-testid="member-settings__subscription-manage"]')
        .trigger('click')

      expect(mockPortalMutate).toHaveBeenCalledWith({
        returnUrl: window.location.href
      })
    })

    test('shows a toast when the portal session fails', async () => {
      mockPortalMutate.mockRejectedValue(new Error('network down'))
      const wrapper = await makeMemberSettings()

      await wrapper
        .find('[data-testid="member-settings__subscription-manage"]')
        .trigger('click')
      await flushPromises()

      expect(mockToastError).toHaveBeenCalledTimes(1)
      expect(mockToastError.mock.calls[0][0]).toContain('billing portal')
    })
  })
})
