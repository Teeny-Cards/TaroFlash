import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import RatingButtons from '@/components/study-modal/rating-buttons.vue'

describe('study-modal/rating-buttons', () => {
  it('renders correctly when showOptions is false', () => {
    const wrapper = mount(RatingButtons, {
      props: {
        options: undefined,
        showOptions: false,
        disabled: false
      },
      global: {
        stubs: {
          'ui-kit:tooltip': true
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('[data-testid="rating-buttons"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="rating-buttons__show"]').exists()).toBe(true)
  })

  it('renders correctly when showOptions is true and disabled is false', () => {
    const wrapper = mount(RatingButtons, {
      props: {
        options: {
          1: { grade: 1, card: { due: new Date() } },
          3: { grade: 3, card: { due: new Date() } }
        },
        showOptions: true,
        disabled: false
      },
      global: {
        stubs: {
          'ui-kit:tooltip': true
        }
      }
    })

    const goodButton = wrapper.find('[data-testid="rating-buttons__good"]')
    expect(goodButton.exists()).toBe(true)
    expect(goodButton.attributes('disabled')).toBeUndefined()

    const againButton = wrapper.find('[data-testid="rating-buttons__again"]')
    expect(againButton.exists()).toBe(true)
    expect(againButton.attributes('disabled')).toBeUndefined()
  })

  it('renders correctly when showOptions is true and disabled is true', () => {
    const wrapper = mount(RatingButtons, {
      props: {
        options: {
          1: { grade: 1, card: { due: new Date() } },
          3: { grade: 3, card: { due: new Date() } }
        },
        showOptions: true,
        disabled: true
      },
      global: {
        stubs: {
          'ui-kit:tooltip': true
        }
      }
    })

    const goodButton = wrapper.find('[data-testid="rating-buttons__good"]')
    expect(goodButton.exists()).toBe(true)
    expect(goodButton.attributes('disabled')).toBe('')

    const againButton = wrapper.find('[data-testid="rating-buttons__again"]')
    expect(againButton.exists()).toBe(true)
    expect(againButton.attributes('disabled')).toBe('')
  })

  it('emits "revealed" event when show button is clicked', async () => {
    const wrapper = mount(RatingButtons, {
      props: {
        options: undefined,
        showOptions: false,
        disabled: false
      },
      global: {
        stubs: {
          'ui-kit:tooltip': true
        }
      }
    })

    const showButton = wrapper.find('[data-testid="rating-buttons__show"]')
    await showButton.trigger('click')

    expect(wrapper.emitted('revealed')).toBeTruthy()
  })

  it('emits "reviewed" event with Rating.Good item when good button is clicked', async () => {
    const wrapper = mount(RatingButtons, {
      props: {
        options: {
          1: { grade: 1, card: { due: new Date() } },
          3: { grade: 3, card: { due: new Date() } }
        },
        showOptions: true,
        disabled: false
      },
      global: {
        stubs: {
          'ui-kit:tooltip': true
        }
      }
    })

    const goodButton = wrapper.find('[data-testid="rating-buttons__good"]')
    await goodButton.trigger('click')

    expect(wrapper.emitted('reviewed')).toBeTruthy()
    expect(wrapper.emitted('reviewed')[0][0]).toEqual({
      grade: 3,
      card: { due: expect.any(Date) }
    })
  })

  it('emits "reviewed" event with Rating.Again item when again button is clicked', async () => {
    const wrapper = mount(RatingButtons, {
      props: {
        options: {
          1: { grade: 1, card: { due: new Date() } },
          3: { grade: 3, card: { due: new Date() } }
        },
        showOptions: true,
        disabled: false
      },
      global: {
        stubs: {
          'ui-kit:tooltip': true
        }
      }
    })

    const againButton = wrapper.find('[data-testid="rating-buttons__again"]')
    await againButton.trigger('click')

    expect(wrapper.emitted('reviewed')).toBeTruthy()
    expect(wrapper.emitted('reviewed')[0][0]).toEqual({
      grade: 1,
      card: { due: expect.any(Date) }
    })
  })
})
