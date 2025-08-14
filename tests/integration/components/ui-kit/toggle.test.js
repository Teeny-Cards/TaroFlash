import { shallowMount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import Toggle from '@/components/ui-kit/toggle.vue'

test('renders the component with slot content', () => {
  const wrapper = shallowMount(Toggle, {
    slots: {
      default: 'Toggle me'
    }
  })
  expect(wrapper.exists()).toBe(true)
  expect(wrapper.text()).toBe('Toggle me')
})

test('toggles the checkbox on click and updates checked prop', async () => {
  let checkedValue = false
  const wrapper = shallowMount(Toggle, {
    props: {
      checked: checkedValue,
      'onUpdate:checked': (value) => {
        checkedValue = value
        wrapper.setProps({ checked: value })
      }
    }
  })

  expect(wrapper.find('[data-testid="ui-kit-toggle"]').classes()).not.toContain(
    'ui-kit-toggle--checked'
  )

  const input = wrapper.find('input')
  await input.setValue(true)
  await wrapper.vm.$nextTick()

  expect(checkedValue).toBe(true)
  expect(wrapper.find('[data-testid="ui-kit-toggle"]').classes()).toContain(
    'ui-kit-toggle--checked'
  )

  await wrapper.setProps({ checked: false })

  expect(wrapper.find('[data-testid="ui-kit-toggle"]').classes()).not.toContain(
    'ui-kit-toggle--checked'
  )
})
