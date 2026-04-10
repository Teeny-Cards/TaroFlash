import { describe, test, expect, beforeEach } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import SessionSettings from '@/components/modals/study-session/session-settings.vue'

// ── Helpers ───────────────────────────────────────────────────────────────────

const defaultSettings = {
  study_all_cards: false,
  shuffle: false,
  flip_cards: false,
  card_limit: null
}

function mountSessionSettings(props = {}) {
  return mount(SessionSettings, {
    props: {
      settings: { ...defaultSettings },
      total_cards: 10,
      ...props
    }
  })
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('SessionSettings', () => {
  // ── Rendering ──────────────────────────────────────────────────────────────

  test('renders the component root element', () => {
    const wrapper = mountSessionSettings()

    expect(wrapper.find('[data-testid="session-settings"]').exists()).toBe(true)
  })

  test('shows "all" for the limit value when card_limit is null', () => {
    const wrapper = mountSessionSettings()

    expect(wrapper.find('[data-testid="session-settings__limit-value"]').text()).toBe('All')
  })

  test('shows the numeric limit when card_limit is set', () => {
    const wrapper = mountSessionSettings({ settings: { ...defaultSettings, card_limit: 5 } })

    expect(wrapper.find('[data-testid="session-settings__limit-value"]').text()).toBe('5')
  })

  // ── Decrement button ───────────────────────────────────────────────────────

  test('dec button is disabled when card_limit is null', () => {
    const wrapper = mountSessionSettings()

    expect(wrapper.find('[data-testid="session-settings__limit-dec"]').element.disabled).toBe(true)
  })

  test('dec button is enabled when card_limit is set', () => {
    const wrapper = mountSessionSettings({ settings: { ...defaultSettings, card_limit: 3 } })

    expect(wrapper.find('[data-testid="session-settings__limit-dec"]').element.disabled).toBe(false)
  })

  test('clicking dec decrements card_limit', async () => {
    const wrapper = mountSessionSettings({ settings: { ...defaultSettings, card_limit: 3 } })

    await wrapper.find('[data-testid="session-settings__limit-dec"]').trigger('click')

    expect(wrapper.find('[data-testid="session-settings__limit-value"]').text()).toBe('2')
  })

  test('clicking dec when card_limit is 1 sets it to null (shows "All")', async () => {
    const wrapper = mountSessionSettings({ settings: { ...defaultSettings, card_limit: 1 } })

    await wrapper.find('[data-testid="session-settings__limit-dec"]').trigger('click')

    expect(wrapper.find('[data-testid="session-settings__limit-value"]').text()).toBe('All')
  })

  // ── Increment button ───────────────────────────────────────────────────────

  test('inc button is disabled when card_limit equals total_cards', () => {
    const wrapper = mountSessionSettings({
      settings: { ...defaultSettings, card_limit: 10 },
      total_cards: 10
    })

    expect(wrapper.find('[data-testid="session-settings__limit-inc"]').element.disabled).toBe(true)
  })

  test('inc button is enabled when card_limit is below total_cards', () => {
    const wrapper = mountSessionSettings({ settings: { ...defaultSettings, card_limit: 5 } })

    expect(wrapper.find('[data-testid="session-settings__limit-inc"]').element.disabled).toBe(false)
  })

  test('clicking inc increments card_limit from null to 1', async () => {
    const wrapper = mountSessionSettings()

    await wrapper.find('[data-testid="session-settings__limit-inc"]').trigger('click')

    expect(wrapper.find('[data-testid="session-settings__limit-value"]').text()).toBe('1')
  })

  test('clicking inc increments card_limit', async () => {
    const wrapper = mountSessionSettings({ settings: { ...defaultSettings, card_limit: 4 } })

    await wrapper.find('[data-testid="session-settings__limit-inc"]').trigger('click')

    expect(wrapper.find('[data-testid="session-settings__limit-value"]').text()).toBe('5')
  })

  test('clicking inc does not exceed total_cards', async () => {
    const wrapper = mountSessionSettings({
      settings: { ...defaultSettings, card_limit: 9 },
      total_cards: 10
    })

    await wrapper.find('[data-testid="session-settings__limit-inc"]').trigger('click')

    expect(wrapper.find('[data-testid="session-settings__limit-value"]').text()).toBe('10')

    // A second click should be ignored (button is now disabled)
    await wrapper.find('[data-testid="session-settings__limit-inc"]').trigger('click')

    expect(wrapper.find('[data-testid="session-settings__limit-value"]').text()).toBe('10')
  })

  // ── emits 'change' ─────────────────────────────────────────────────────────

  test('emits "change" with updated settings when inc is clicked', async () => {
    const wrapper = mountSessionSettings()

    await wrapper.find('[data-testid="session-settings__limit-inc"]').trigger('click')

    expect(wrapper.emitted('change')).toHaveLength(1)
    expect(wrapper.emitted('change')[0][0]).toMatchObject({ card_limit: 1 })
  })

  test('emits "change" with updated settings when dec is clicked', async () => {
    const wrapper = mountSessionSettings({ settings: { ...defaultSettings, card_limit: 5 } })

    await wrapper.find('[data-testid="session-settings__limit-dec"]').trigger('click')

    expect(wrapper.emitted('change')).toHaveLength(1)
    expect(wrapper.emitted('change')[0][0]).toMatchObject({ card_limit: 4 })
  })

  test('"change" payload includes all current settings', async () => {
    const wrapper = mountSessionSettings({
      settings: { study_all_cards: true, shuffle: true, flip_cards: true, card_limit: 2 }
    })

    await wrapper.find('[data-testid="session-settings__limit-inc"]').trigger('click')

    const payload = wrapper.emitted('change')[0][0]
    expect(payload).toEqual({
      study_all_cards: true,
      shuffle: true,
      flip_cards: true,
      card_limit: 3
    })
  })
})
