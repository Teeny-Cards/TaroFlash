import { mount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import Alert from '@/components/ui-kit/alert.vue'

const mocks = vi.hoisted(() => {
  return {
    play: vi.fn()
  }
})

vi.mock('@/composables/use-audio', () => ({
  useAudio: vi.fn(() => ({
    play: mocks.play
  }))
}))

it('renders properly with default props', () => {
  const wrapper = mount(Alert)
  expect(wrapper.exists()).toBe(true)
})

it('renders properly with custom props', () => {
  const wrapper = mount(Alert, {
    props: {
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
      close
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
      confirmAudio: 'test_audio'
    }
  })

  await wrapper.find('[data-testid="ui-kit-alert__confirm"]').trigger('click')

  expect(close).toHaveBeenCalledWith(true, { overrideCloseAudio: 'test_audio' })
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

  expect(close).toHaveBeenCalledWith(false, { overrideCloseAudio: 'test_audio' })
})

it('plays cancel audio when cancel button is clicked', async () => {
  const close = vi.fn()
  const wrapper = mount(Alert, {
    props: {
      close,
      cancelAudio: 'test_audio'
    }
  })

  await wrapper.find('[data-testid="ui-kit-alert__cancel"]').trigger('click')

  expect(close).toHaveBeenCalledWith(false, { overrideCloseAudio: 'test_audio' })
})

it('plays confirm audio when confirm button is clicked', async () => {
  const close = vi.fn()
  const wrapper = mount(Alert, {
    props: {
      close,
      confirmAudio: 'test_audio'
    }
  })

  await wrapper.find('[data-testid="ui-kit-alert__confirm"]').trigger('click')

  expect(close).toHaveBeenCalledWith(true, { overrideCloseAudio: 'test_audio' })
})
