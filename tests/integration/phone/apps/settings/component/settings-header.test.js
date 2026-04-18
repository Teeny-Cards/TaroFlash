import { describe, test, expect, vi } from 'vite-plus/test'
import { shallowMount } from '@vue/test-utils'
import { defineComponent, h, useAttrs } from 'vue'

const UiButtonStub = defineComponent({
  name: 'UiButton',
  inheritAttrs: false,
  emits: ['click'],
  setup(_props, { slots, emit }) {
    const attrs = useAttrs()
    return () => h('button', { ...attrs, onClick: () => emit('click') }, slots.default?.())
  }
})

async function makeSettingsHeader(props = { selectedTab: 'app-settings' }) {
  const SettingsHeader = (await import('@/phone/apps/settings/component/settings-header.vue'))
    .default

  return shallowMount(SettingsHeader, {
    props,
    global: { stubs: { UiButton: UiButtonStub } }
  })
}

describe('settings-header', () => {
  test('renders a button for each tab', async () => {
    const wrapper = await makeSettingsHeader()
    const tabButtons = wrapper
      .findAll('button')
      .filter((b) => b.attributes('icon-left') !== 'close')
    const icons = tabButtons.map((b) => b.attributes('icon-left'))
    expect(icons).toContain('id-card')
    expect(icons).toContain('settings')
    expect(icons).toContain('book')
  })

  test('emits change-tab with the clicked tab key', async () => {
    const wrapper = await makeSettingsHeader({ selectedTab: 'app-settings' })
    const memberButton = wrapper
      .findAll('button')
      .find((b) => b.attributes('icon-left') === 'id-card')
    await memberButton.trigger('click')
    expect(wrapper.emitted('change-tab')).toBeTruthy()
    expect(wrapper.emitted('change-tab')[0]).toEqual(['member-settings'])
  })

  test('emits close when the close button is clicked', async () => {
    const wrapper = await makeSettingsHeader()
    const closeButton = wrapper.findAll('button').find((b) => b.attributes('icon-left') === 'close')
    await closeButton.trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  test('renders the translated title for the selected tab', async () => {
    const wrapper = await makeSettingsHeader({ selectedTab: 'member-settings' })
    expect(wrapper.find('h1').text()).toBe('Member Settings')
  })

  test('marks the selected tab as solid and others as outline', async () => {
    const wrapper = await makeSettingsHeader({ selectedTab: 'member-settings' })
    const tabButtons = wrapper
      .findAll('button')
      .filter((b) => b.attributes('icon-left') !== 'close')

    const memberBtn = tabButtons.find((b) => b.attributes('icon-left') === 'id-card')
    const appBtn = tabButtons.find((b) => b.attributes('icon-left') === 'settings')
    expect(memberBtn.attributes('variant')).toBe('solid')
    expect(appBtn.attributes('variant')).toBe('outline')
  })
})
