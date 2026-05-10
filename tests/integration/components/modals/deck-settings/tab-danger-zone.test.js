import { describe, test, expect } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { defineComponent, h, reactive, ref, useAttrs } from 'vue'
import TabDangerZone from '@/components/modals/deck-settings/tab-danger-zone/index.vue'
import { deckEditorKey } from '@/composables/deck-editor'

const ButtonStub = defineComponent({
  name: 'UiButton',
  props: { loading: { type: Boolean, default: false } },
  emits: ['click'],
  inheritAttrs: false,
  setup(props, { slots, emit }) {
    const attrs = useAttrs()
    return () =>
      h(
        'button',
        {
          type: 'button',
          ...attrs,
          'data-loading': String(!!props.loading),
          disabled: props.loading,
          onClick: (e) => emit('click', e)
        },
        slots.default?.()
      )
  }
})

function makeTab({ deleting = false, resetting_reviews = false } = {}) {
  const deletingRef = ref(deleting)
  const resettingReviewsRef = ref(resetting_reviews)
  const editor = {
    deck: { id: 1 },
    settings: reactive({}),
    config: reactive({}),
    cover: reactive({}),
    card_attributes: reactive({ front: {}, back: {} }),
    cover_image_preview: ref(undefined),
    cover_image_loading: ref(false),
    active_side: ref('cover'),
    deleting: deletingRef,
    resetting_reviews: resettingReviewsRef,
    saveDeck: async () => true,
    deleteDeck: async () => true,
    resetReviews: async () => true,
    uploadImage: () => {},
    removeImage: () => {},
    setCoverImage: async () => {},
    removeCoverImage: () => {},
    setActiveSide: () => {}
  }
  const wrapper = mount(TabDangerZone, {
    global: {
      provide: { [deckEditorKey]: editor },
      stubs: { UiButton: ButtonStub },
      mocks: { $t: (k) => k }
    }
  })
  return { wrapper, deletingRef, resettingReviewsRef }
}

describe('TabDangerZone', () => {
  test('renders the danger-zone container with the delete button', () => {
    const { wrapper } = makeTab()
    expect(wrapper.find('[data-testid="tab-danger-zone"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="tab-danger-zone__delete-button"]').exists()).toBe(true)
  })

  test('emits "delete" when the delete button is clicked', async () => {
    const { wrapper } = makeTab()
    await wrapper.find('[data-testid="tab-danger-zone__delete-button"]').trigger('click')
    expect(wrapper.emitted('delete')).toHaveLength(1)
  })

  test('reflects the editor.deleting ref on the button (loading state)', async () => {
    const { wrapper, deletingRef } = makeTab({ deleting: false })
    const btn = wrapper.find('[data-testid="tab-danger-zone__delete-button"]')

    expect(btn.attributes('data-loading')).toBe('false')

    deletingRef.value = true
    await wrapper.vm.$nextTick()

    expect(btn.attributes('data-loading')).toBe('true')
  })

  test('starts in the loading state when editor.deleting is true on mount', () => {
    const { wrapper } = makeTab({ deleting: true })
    const btn = wrapper.find('[data-testid="tab-danger-zone__delete-button"]')
    expect(btn.attributes('data-loading')).toBe('true')
  })

  test('does not emit "delete" while loading (button disabled)', async () => {
    const { wrapper } = makeTab({ deleting: true })
    await wrapper.find('[data-testid="tab-danger-zone__delete-button"]').trigger('click')
    expect(wrapper.emitted('delete')).toBeUndefined()
  })

  test('renders the reset-reviews button', () => {
    const { wrapper } = makeTab()
    expect(wrapper.find('[data-testid="tab-danger-zone__reset-reviews-button"]').exists()).toBe(
      true
    )
  })

  test('emits "reset-reviews" when the reset button is clicked', async () => {
    const { wrapper } = makeTab()
    await wrapper.find('[data-testid="tab-danger-zone__reset-reviews-button"]').trigger('click')
    expect(wrapper.emitted('reset-reviews')).toHaveLength(1)
  })

  test('reflects the editor.resetting_reviews ref on the reset button (loading state)', async () => {
    const { wrapper, resettingReviewsRef } = makeTab({ resetting_reviews: false })
    const btn = wrapper.find('[data-testid="tab-danger-zone__reset-reviews-button"]')

    expect(btn.attributes('data-loading')).toBe('false')

    resettingReviewsRef.value = true
    await wrapper.vm.$nextTick()

    expect(btn.attributes('data-loading')).toBe('true')
  })

  test('does not emit "reset-reviews" while resetting (button disabled)', async () => {
    const { wrapper } = makeTab({ resetting_reviews: true })
    await wrapper.find('[data-testid="tab-danger-zone__reset-reviews-button"]').trigger('click')
    expect(wrapper.emitted('reset-reviews')).toBeUndefined()
  })
})
