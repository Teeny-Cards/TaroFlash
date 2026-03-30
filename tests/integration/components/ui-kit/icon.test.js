import { shallowMount } from '@vue/test-utils'
import { expect, it } from 'vite-plus/test'
import Icon from '@/components/ui-kit/icon.vue'

it('renders properly with required props', () => {
  const wrapper = shallowMount(Icon, {
    props: {
      src: 'add'
    }
  })
  expect(wrapper.exists()).toBe(true)
})
