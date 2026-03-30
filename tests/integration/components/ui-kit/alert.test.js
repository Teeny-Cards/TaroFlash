import { mount } from '@vue/test-utils'
import { expect, it, vi } from 'vite-plus/test'
import Alert from '@/components/ui-kit/alert.vue'

it('renders properly with default props', () => {
  const wrapper = mount(Alert, {
    props: {
      close: vi.fn()
    }
  })
  expect(wrapper.exists()).toBe(true)
})

it('renders properly with custom props', () => {
  const wrapper = mount(Alert, {
    props: {
      close: vi.fn(),
      title: 'Test Title',
      message: 'Test Message',
      confirmLabel: 'Test Confirm',
      cancelLabel: 'Test Cancel'
    }
  })

  expect(wrapper.exists()).toBe(true)
  expect(wrapper.find('[data-testid="ui-kit-alert__body"]').text()).toContain('Test Title')
  expect(wrapper.find('[data-testid="ui-kit-alert__body"]').text()).toContain('Test Message')
  expect(wrapper.find('[data-testid="ui-kit-alert__confirm"]').text()).toContain('Test Confirm')
  expect(wrapper.find('[data-testid="ui-kit-alert__cancel"]').text()).toContain('Test Cancel')
})

it('calls close function when confirm button is clicked', async () => {
  const close = vi.fn()
  const wrapper = mount(Alert, {
    props: {
      close,
      confirmLabel: 'Confirm'
    }
  })

  await wrapper.find('[data-testid="ui-kit-alert__confirm"]').trigger('click')

  expect(close).toHaveBeenCalled()
})

it('calls close function when cancel button is clicked', async () => {
  const close = vi.fn()
  const wrapper = mount(Alert, {
    props: {
      close
    }
  })

  await wrapper.find('[data-testid="ui-kit-alert__cancel"]').trigger('click')

  expect(close).toHaveBeenCalled()
})

it('calls close function with correct value when confirm button is clicked', async () => {
  const close = vi.fn()
  const wrapper = mount(Alert, {
    props: {
      close,
      confirmLabel: 'Confirm',
      confirmAudio: 'test_audio'
    }
  })

  await wrapper.find('[data-testid="ui-kit-alert__confirm"]').trigger('click')

  expect(close).toHaveBeenCalledWith(true, { override_close_audio: 'test_audio' })
})

it('calls close function with correct value when cancel button is clicked', async () => {
  const close = vi.fn()
  const wrapper = mount(Alert, {
    props: {
      close,
      cancelAudio: 'test_audio'
    }
  })

  await wrapper.find('[data-testid="ui-kit-alert__cancel"]').trigger('click')

  expect(close).toHaveBeenCalledWith(false, { override_close_audio: 'test_audio' })
})
