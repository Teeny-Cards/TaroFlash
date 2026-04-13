import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'
import { shallowMount, flushPromises } from '@vue/test-utils'
import UiIcon from '@/components/ui-kit/icon.vue'
import logger from '@/utils/logger'

vi.spyOn(logger, 'warn')

function mountIcon(src) {
  return shallowMount(UiIcon, { props: { src } })
}

describe('UiIcon', () => {
  beforeEach(() => {
    vi.mocked(logger.warn).mockReset()
  })

  test('renders a component for a known eager icon', async () => {
    const wrapper = mountIcon('add')
    await flushPromises()
    expect(wrapper.find('[data-testid="ui-kit-icon"]').exists()).toBe(true)
  })

  test('logs a warning for a missing icon name', async () => {
    mountIcon('nonexistent-icon-xyz')
    await flushPromises()
    expect(logger.warn).toHaveBeenCalledWith('Missing icon: nonexistent-icon-xyz')
  })

  test('sets alt attribute to the src prop value', async () => {
    const wrapper = mountIcon('add')
    await flushPromises()
    expect(wrapper.find('[data-testid="ui-kit-icon"]').attributes('alt')).toBe('add')
  })
})
