import { describe, test, expect, vi } from 'vite-plus/test'
import { shallowMount } from '@vue/test-utils'
import { defineComponent, h, useAttrs } from 'vue'

vi.mock('@/stores/member', () => ({
  useMemberStore: () => ({
    display_name: 'Alice',
    email: 'alice@example.com'
  })
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

async function makeMemberSettings() {
  const MemberSettings = (await import('@/phone/apps/settings/component/member-settings.vue'))
    .default

  return shallowMount(MemberSettings, {
    global: {
      stubs: {
        SectionHeader: SectionHeaderStub,
        UiInput: UiInputStub
      }
    }
  })
}

describe('member-settings', () => {
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

  test('no longer renders a subscription section (moved to billing tab)', async () => {
    const wrapper = await makeMemberSettings()
    expect(wrapper.find('[data-testid="member-settings__subscription"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="member-settings__subscription-free"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="member-settings__subscription-paid"]').exists()).toBe(false)
  })
})
