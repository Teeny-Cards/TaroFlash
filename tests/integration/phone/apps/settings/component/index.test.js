import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'
import { shallowMount } from '@vue/test-utils'
import { defineComponent, h, useAttrs } from 'vue'

const { storageState, storageGet, storageSet } = vi.hoisted(() => {
  const state = { value: undefined }
  return {
    storageState: state,
    storageGet: vi.fn(() => state.value),
    storageSet: vi.fn((_key, v) => {
      state.value = v
    })
  }
})

vi.mock('@/utils/storage', () => ({
  default: { get: storageGet, set: storageSet }
}))

const AppSettingsStub = defineComponent({
  name: 'AppSettings',
  setup: () => () => h('div', { 'data-testid': 'app-settings-stub' })
})
const MemberSettingsStub = defineComponent({
  name: 'MemberSettings',
  setup: () => () => h('div', { 'data-testid': 'member-settings-stub' })
})

vi.mock('@/phone/apps/settings/component/app-settings.vue', () => ({ default: AppSettingsStub }))
vi.mock('@/phone/apps/settings/component/member-settings.vue', () => ({
  default: MemberSettingsStub
}))

const SettingsHeaderStub = defineComponent({
  name: 'SettingsHeader',
  inheritAttrs: false,
  props: ['selectedTab'],
  emits: ['change-tab', 'close'],
  setup(props, { emit }) {
    const attrs = useAttrs()
    return () =>
      h('div', { ...attrs, 'data-testid': 'settings-header-stub' }, [
        h(
          'button',
          {
            'data-testid': 'change-to-member',
            onClick: () => emit('change-tab', 'member-settings')
          },
          'member'
        ),
        h(
          'button',
          {
            'data-testid': 'change-to-app',
            onClick: () => emit('change-tab', 'app-settings')
          },
          'app'
        ),
        h(
          'button',
          {
            'data-testid': 'change-to-same',
            onClick: () => emit('change-tab', props.selectedTab)
          },
          'same'
        ),
        h('span', { 'data-testid': 'selected-tab' }, props.selectedTab)
      ])
  }
})

const UiIconStub = defineComponent({
  name: 'UiIcon',
  setup: () => () => h('span', { 'data-testid': 'ui-icon-stub' })
})

async function makeSettings() {
  const Settings = (await import('@/phone/apps/settings/component/index.vue')).default

  return shallowMount(Settings, {
    props: { close: vi.fn() },
    global: {
      stubs: {
        SettingsHeader: SettingsHeaderStub,
        AppSettings: AppSettingsStub,
        MemberSettings: MemberSettingsStub,
        UiIcon: UiIconStub
      }
    }
  })
}

beforeEach(() => {
  storageState.value = undefined
  storageGet.mockClear()
  storageSet.mockClear()
})

describe('settings app shell', () => {
  test('defaults to the app-settings tab when storage is empty', async () => {
    const wrapper = await makeSettings()
    expect(wrapper.find('[data-testid="app-settings-stub"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="selected-tab"]').text()).toBe('app-settings')
  })

  test('restores the selected tab from storage on mount', async () => {
    storageState.value = 'member-settings'
    const wrapper = await makeSettings()
    expect(wrapper.find('[data-testid="member-settings-stub"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="selected-tab"]').text()).toBe('member-settings')
  })

  test('change-tab switches the rendered tab component', async () => {
    const wrapper = await makeSettings()
    await wrapper.find('[data-testid="change-to-member"]').trigger('click')
    expect(wrapper.find('[data-testid="member-settings-stub"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="app-settings-stub"]').exists()).toBe(false)
  })

  test('change-tab persists the new tab to storage', async () => {
    const wrapper = await makeSettings()
    await wrapper.find('[data-testid="change-to-member"]').trigger('click')
    expect(storageSet).toHaveBeenCalledWith('settings-tab', 'member-settings')
  })

  test('clicking the currently-selected tab is a no-op (no storage write)', async () => {
    const wrapper = await makeSettings()
    storageSet.mockClear()
    await wrapper.find('[data-testid="change-to-same"]').trigger('click')
    expect(storageSet).not.toHaveBeenCalled()
  })
})
