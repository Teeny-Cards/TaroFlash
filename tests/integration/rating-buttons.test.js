import { describe, test, expect, beforeEach } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { Rating } from 'ts-fsrs'
import RatingButtons from '@/components/modals/study-session/rating-buttons.vue'

// UiTooltip renders <component :is="element"> and spreads $attrs, so it passes
// data-testid, disabled, and click listeners through to the rendered element.
// No stub needed — let it render for real.

// ── Helpers ───────────────────────────────────────────────────────────────────

function mountRatingButtons(props) {
  return mount(RatingButtons, { props })
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('RatingButtons', () => {
  // ── showOptions: false ─────────────────────────────────────────────────────

  describe('when showOptions is false', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mountRatingButtons({ showOptions: false, disabled: false })
    })

    test('shows the flip button', () => {
      expect(wrapper.find('[data-testid="rating-buttons__show"]').exists()).toBe(true)
    })

    test('does not show the Again button', () => {
      expect(wrapper.find('[data-testid="rating-buttons__again"]').exists()).toBe(false)
    })

    test('does not show the Good button', () => {
      expect(wrapper.find('[data-testid="rating-buttons__good"]').exists()).toBe(false)
    })

    test('clicking the flip button emits "revealed"', async () => {
      await wrapper.find('[data-testid="rating-buttons__show"]').trigger('click')

      expect(wrapper.emitted('revealed')).toHaveLength(1)
    })
  })

  // ── showOptions: true ──────────────────────────────────────────────────────

  describe('when showOptions is true', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mountRatingButtons({ showOptions: true, disabled: false })
    })

    test('shows the Again button', () => {
      expect(wrapper.find('[data-testid="rating-buttons__again"]').exists()).toBe(true)
    })

    test('shows the Good button', () => {
      expect(wrapper.find('[data-testid="rating-buttons__good"]').exists()).toBe(true)
    })

    test('does not show the flip button', () => {
      expect(wrapper.find('[data-testid="rating-buttons__show"]').exists()).toBe(false)
    })

    test('clicking Again emits "rated" with Rating.Again', async () => {
      await wrapper.find('[data-testid="rating-buttons__again"]').trigger('click')

      expect(wrapper.emitted('rated')).toHaveLength(1)
      expect(wrapper.emitted('rated')[0]).toEqual([Rating.Again])
    })

    test('clicking Good emits "rated" with Rating.Good', async () => {
      await wrapper.find('[data-testid="rating-buttons__good"]').trigger('click')

      expect(wrapper.emitted('rated')).toHaveLength(1)
      expect(wrapper.emitted('rated')[0]).toEqual([Rating.Good])
    })
  })

  // ── disabled ───────────────────────────────────────────────────────────────

  describe('when disabled is true', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mountRatingButtons({ showOptions: true, disabled: true })
    })

    test('Again button has the opacity-50 class', () => {
      expect(wrapper.find('[data-testid="rating-buttons__again"]').classes()).toContain(
        'opacity-50'
      )
    })

    test('Good button has the opacity-50 class', () => {
      expect(wrapper.find('[data-testid="rating-buttons__good"]').classes()).toContain('opacity-50')
    })

    test('clicking Again does not emit "rated"', async () => {
      await wrapper.find('[data-testid="rating-buttons__again"]').trigger('click')

      expect(wrapper.emitted('rated')).toBeFalsy()
    })

    test('clicking Good does not emit "rated"', async () => {
      await wrapper.find('[data-testid="rating-buttons__good"]').trigger('click')

      expect(wrapper.emitted('rated')).toBeFalsy()
    })
  })

  // ── options prop ───────────────────────────────────────────────────────────

  test('renders without errors when options is undefined', () => {
    const wrapper = mountRatingButtons({ showOptions: true, disabled: false, options: undefined })

    expect(wrapper.find('[data-testid="rating-buttons__again"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="rating-buttons__good"]').exists()).toBe(true)
  })
})
