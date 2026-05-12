import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { defineComponent, h, ref, useAttrs } from 'vue'

vi.mock('@/composables/use-media-query', async () => {
  const m = await import('../../../../../helpers/responsive-mock')
  return m.responsiveMockModule
})

import { setBelowMd, resetResponsive } from '../../../../../helpers/responsive-mock'
import TabProfile from '@/phone/apps/settings/component/tab-profile/index.vue'
import { memberEditorKey } from '@/composables/member-editor'

const InputStub = defineComponent({
  name: 'UiInput',
  props: { value: { type: String, default: '' } },
  emits: ['update:value'],
  inheritAttrs: false,
  setup(props, { emit }) {
    const attrs = useAttrs()
    return () =>
      h('input', {
        ...attrs,
        value: props.value,
        onInput: (e) => emit('update:value', e.target.value)
      })
  }
})

const MemberCardStub = defineComponent({
  name: 'MemberCard',
  inheritAttrs: false,
  setup() {
    const attrs = useAttrs()
    return () => h('div', { ...attrs, 'data-testid': 'member-card-stub' })
  }
})

function makeEditor() {
  return {
    settings: { display_name: 'Chris', description: 'Hi' },
    cover: { theme: 'green-500', theme_dark: 'green-800', pattern: 'bank-note' },
    email: ref('chris@example.com'),
    created_at: ref('2024-04-15T00:00:00Z'),
    plan: ref('free'),
    is_dirty: ref(false),
    saving: ref(false),
    saveMember: () => Promise.resolve(false)
  }
}

function makeTab(editor = makeEditor()) {
  return mount(TabProfile, {
    global: {
      provide: { [memberEditorKey]: editor },
      stubs: { UiInput: InputStub, MemberCard: MemberCardStub },
      mocks: { $t: (k) => k }
    }
  })
}

describe('TabProfile', () => {
  beforeEach(() => resetResponsive())

  test('renders the profile container with name + email + description rows', () => {
    const wrapper = makeTab()
    expect(wrapper.find('[data-testid="tab-profile"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="tab-profile__email"]').text()).toContain('chris@example.com')
  })

  test('hides the inline member-card preview on desktop', () => {
    const wrapper = makeTab()
    expect(wrapper.find('[data-testid="tab-profile__preview"]').exists()).toBe(false)
  })

  test('shows the inline member-card preview on mobile', () => {
    setBelowMd(true)
    const wrapper = makeTab()
    expect(wrapper.find('[data-testid="tab-profile__preview"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="member-card-stub"]').exists()).toBe(true)
  })
})
