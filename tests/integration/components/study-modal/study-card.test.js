import { mount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import StudyCard from '@/components/study-modal/study-card.vue'

it('renders both Card components with correct text bindings', async () => {
  vi.useFakeTimers()

  const card = {
    front_text: 'Front',
    back_text: 'Back'
  }

  const wrapper = mount(StudyCard, {
    props: {
      card,
      revealed: true,
      previewing: false
    }
  })

  vi.runAllTimers()
  await wrapper.vm.$nextTick()

  const frontCard = wrapper.find('[data-testid="study-card__front"]')
  expect(frontCard.exists()).toBe(true)
  expect(frontCard.text()).toBe('Front')

  const backCard = wrapper.find('[data-testid="study-card__back"]')
  expect(backCard.exists()).toBe(true)
  expect(backCard.text()).toBe('Back')
})

it('initializes with frontRevealed as true and backRevealed as revealed || previewing', async () => {
  vi.useFakeTimers()

  const wrapper = mount(StudyCard, {
    props: {
      card: {
        front_text: 'Front',
        back_text: 'Back'
      },
      revealed: false,
      previewing: false
    }
  })

  vi.runAllTimers()
  await wrapper.vm.$nextTick()

  const frontRevealed = wrapper.vm.frontRevealed
  expect(frontRevealed).toBe(true)

  const backRevealed = wrapper.vm.backRevealed
  expect(backRevealed).toBe(false)

  await wrapper.setProps({ revealed: true })
  vi.runAllTimers()

  expect(wrapper.vm.backRevealed).toBe(true)

  await wrapper.setProps({ previewing: true, revealed: false })
  vi.runAllTimers()

  expect(wrapper.vm.backRevealed).toBe(true)
})

it('animates front and back cards on mount', async () => {
  vi.useFakeTimers()

  const wrapper = mount(StudyCard, {
    props: {
      card: {
        front_text: 'Front',
        back_text: 'Back'
      },
      revealed: false,
      previewing: false
    }
  })

  expect(wrapper.vm.frontRevealed).toBe(false)
  expect(wrapper.vm.backRevealed).toBe(false)

  vi.runAllTimers()
  await wrapper.vm.$nextTick()

  expect(wrapper.vm.frontRevealed).toBe(true)
  expect(wrapper.vm.backRevealed).toBe(false)
})

it('animates front card when card prop changes', async () => {
  vi.useFakeTimers()

  const wrapper = mount(StudyCard, {
    props: {
      card: {
        front_text: 'Front',
        back_text: 'Back'
      },
      revealed: false,
      previewing: false
    }
  })

  vi.runAllTimers()
  await wrapper.vm.$nextTick()

  expect(wrapper.vm.frontRevealed).toBe(true)

  await wrapper.setProps({
    card: {
      front_text: 'New Front',
      back_text: 'New Back'
    }
  })

  expect(wrapper.vm.frontRevealed).toBe(false)

  vi.runAllTimers()
  await wrapper.vm.$nextTick()

  expect(wrapper.vm.frontRevealed).toBe(true)
})

it('animates back card when revealed prop changes', async () => {
  vi.useFakeTimers()

  const wrapper = mount(StudyCard, {
    props: {
      card: {
        front_text: 'Front',
        back_text: 'Back'
      },
      revealed: false,
      previewing: false
    }
  })

  vi.runAllTimers()
  await wrapper.vm.$nextTick()

  expect(wrapper.vm.backRevealed).toBe(false)

  await wrapper.setProps({ revealed: true })

  expect(wrapper.vm.backRevealed).toBe(false)

  vi.runAllTimers()
  await wrapper.vm.$nextTick()

  expect(wrapper.vm.backRevealed).toBe(true)
})

it('animates back card when previewing prop changes', async () => {
  vi.useFakeTimers()

  const wrapper = mount(StudyCard, {
    props: {
      card: {
        front_text: 'Front',
        back_text: 'Back'
      },
      revealed: false,
      previewing: false
    }
  })

  vi.runAllTimers()
  await wrapper.vm.$nextTick()

  expect(wrapper.vm.backRevealed).toBe(false)

  await wrapper.setProps({ previewing: true })

  expect(wrapper.vm.backRevealed).toBe(false)

  vi.runAllTimers()
  await wrapper.vm.$nextTick()

  expect(wrapper.vm.backRevealed).toBe(true)
})
