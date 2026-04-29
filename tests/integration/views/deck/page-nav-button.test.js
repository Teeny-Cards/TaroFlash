import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'
import { shallowMount } from '@vue/test-utils'
import { ref } from 'vue'
import { defineComponent, h } from 'vue'

import PageNavButton from '@/views/deck/page-nav-button.vue'

const UiButtonStub = defineComponent({
  name: 'UiButton',
  inheritAttrs: false,
  props: ['iconOnly', 'iconLeft'],
  setup(props, { slots, attrs }) {
    return () =>
      h(
        'button',
        {
          ...attrs,
          'data-testid': attrs['data-testid'],
          'data-icon-left': props.iconLeft
        },
        slots.default?.()
      )
  }
})

function makeEditor({ mode = 'view', prevPage = vi.fn(), nextPage = vi.fn() } = {}) {
  return {
    mode: ref(mode),
    carousel: { prevPage, nextPage }
  }
}

function mount({ direction = 'prev', editor = makeEditor(), slot = 'click me' } = {}) {
  return shallowMount(PageNavButton, {
    props: { direction },
    slots: { default: slot },
    global: {
      provide: { 'card-editor': editor },
      stubs: { UiButton: UiButtonStub }
    }
  })
}

describe('PageNavButton', () => {
  let editor
  beforeEach(() => {
    editor = makeEditor()
  })

  describe('direction="prev"', () => {
    test('uses the previous-page testid', () => {
      const wrapper = mount({ direction: 'prev', editor })
      expect(wrapper.find('[data-testid="deck-view__previous-page-button"]').exists()).toBe(true)
    })

    test('uses arrow-left as the icon', () => {
      const wrapper = mount({ direction: 'prev', editor })
      expect(wrapper.findComponent({ name: 'UiButton' }).props('iconLeft')).toBe('arrow-left')
    })

    test('click invokes carousel.prevPage', async () => {
      const wrapper = mount({ direction: 'prev', editor })
      await wrapper.find('[data-testid="deck-view__previous-page-button"]').trigger('click')
      expect(editor.carousel.prevPage).toHaveBeenCalledOnce()
      expect(editor.carousel.nextPage).not.toHaveBeenCalled()
    })
  })

  describe('direction="next"', () => {
    test('uses the next-page testid', () => {
      const wrapper = mount({ direction: 'next', editor })
      expect(wrapper.find('[data-testid="deck-view__next-page-button"]').exists()).toBe(true)
    })

    test('uses arrow-right as the icon', () => {
      const wrapper = mount({ direction: 'next', editor })
      expect(wrapper.findComponent({ name: 'UiButton' }).props('iconLeft')).toBe('arrow-right')
    })

    test('click invokes carousel.nextPage', async () => {
      const wrapper = mount({ direction: 'next', editor })
      await wrapper.find('[data-testid="deck-view__next-page-button"]').trigger('click')
      expect(editor.carousel.nextPage).toHaveBeenCalledOnce()
      expect(editor.carousel.prevPage).not.toHaveBeenCalled()
    })
  })

  test('renders default slot content', () => {
    const wrapper = mount({ slot: 'Page 3' })
    expect(wrapper.text()).toContain('Page 3')
  })

  // The button is hidden via opacity classes when mode !== 'view'. Class
  // assertion is unavoidable here — there is no other state signal exposed
  // on the rendered DOM (called out in quality notes).
  test('applies hidden classes when editor.mode is not view', () => {
    editor = makeEditor({ mode: 'edit' })
    const wrapper = mount({ direction: 'prev', editor })
    const cls = wrapper.find('[data-testid="deck-view__previous-page-button"]').classes()
    expect(cls).toContain('opacity-0')
    expect(cls).toContain('pointer-events-none')
  })

  test('does not apply hidden classes in view mode', () => {
    editor = makeEditor({ mode: 'view' })
    const wrapper = mount({ direction: 'prev', editor })
    const cls = wrapper.find('[data-testid="deck-view__previous-page-button"]').classes()
    expect(cls).not.toContain('opacity-0')
  })

  test('applies sm:col-start-1 for prev direction', () => {
    const wrapper = mount({ direction: 'prev' })
    const cls = wrapper.find('[data-testid="deck-view__previous-page-button"]').classes()
    expect(cls).toContain('sm:col-start-1')
  })

  test('applies sm:col-start-3 for next direction', () => {
    const wrapper = mount({ direction: 'next' })
    const cls = wrapper.find('[data-testid="deck-view__next-page-button"]').classes()
    expect(cls).toContain('sm:col-start-3')
  })
})
