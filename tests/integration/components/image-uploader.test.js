import { describe, test, expect, beforeEach, vi } from 'vite-plus/test'
import { mount, flushPromises } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import ImageUploader from '@/components/image-uploader.vue'

// ── FileReader mock ───────────────────────────────────────────────────────────

const FAKE_PREVIEW = 'data:image/png;base64,fakepreview'

vi.stubGlobal(
  'FileReader',
  class {
    onerror = null
    onload = null
    readAsDataURL(_file) {
      Promise.resolve().then(() => {
        this.onload?.({ target: { result: FAKE_PREVIEW } })
      })
    }
  }
)

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Mounts ImageUploader with a scoped slot that exposes dragging via data-dragging.
 * Use wrapper.find('[data-testid="slot"]').attributes('data-dragging') to assert.
 */
function mountWithSlot() {
  return mount(ImageUploader, {
    slots: {
      default: ({ dragging }) =>
        h('div', { 'data-testid': 'slot', 'data-dragging': String(dragging) })
    }
  })
}

function makeImageFile(name = 'photo.png') {
  return new File(['content'], name, { type: 'image/png' })
}

function makeTextFile(name = 'doc.txt') {
  return new File(['content'], name, { type: 'text/plain' })
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('ImageUploader', () => {
  describe('dragging slot prop', () => {
    test('is false initially', () => {
      const wrapper = mountWithSlot()

      expect(wrapper.find('[data-testid="slot"]').attributes('data-dragging')).toBe('false')
    })

    test('becomes true on dragenter', async () => {
      const wrapper = mountWithSlot()

      await wrapper.trigger('dragenter')

      expect(wrapper.find('[data-testid="slot"]').attributes('data-dragging')).toBe('true')
    })

    test('returns to false after a matching dragleave', async () => {
      const wrapper = mountWithSlot()

      await wrapper.trigger('dragenter')
      await wrapper.trigger('dragleave')

      expect(wrapper.find('[data-testid="slot"]').attributes('data-dragging')).toBe('false')
    })

    test('stays true when there are more dragenter events than dragleave events', async () => {
      const wrapper = mountWithSlot()

      // Simulate entering two nested children — two dragenter before any dragleave
      await wrapper.trigger('dragenter')
      await wrapper.trigger('dragenter')
      await wrapper.trigger('dragleave')

      expect(wrapper.find('[data-testid="slot"]').attributes('data-dragging')).toBe('true')
    })

    test('resets to false on drop', async () => {
      const wrapper = mountWithSlot()

      await wrapper.trigger('dragenter')
      await wrapper.trigger('drop')

      expect(wrapper.find('[data-testid="slot"]').attributes('data-dragging')).toBe('false')
    })
  })

  describe('file processing via input', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    test('emits image-uploaded with preview and file when an image is selected', async () => {
      const wrapper = mount(ImageUploader)
      const file = makeImageFile()

      const input = wrapper.find('input[type="file"]')
      Object.defineProperty(input.element, 'files', { value: [file], configurable: true })
      await input.trigger('change')
      await flushPromises()

      expect(wrapper.emitted('image-uploaded')).toHaveLength(1)
      const [payload] = wrapper.emitted('image-uploaded')[0]
      expect(payload.preview).toBe(FAKE_PREVIEW)
      expect(payload.file).toBe(file)
    })

    test('does not emit image-uploaded for non-image files', async () => {
      const wrapper = mount(ImageUploader)
      const file = makeTextFile()

      const input = wrapper.find('input[type="file"]')
      Object.defineProperty(input.element, 'files', { value: [file], configurable: true })
      await input.trigger('change')
      await flushPromises()

      expect(wrapper.emitted('image-uploaded')).toBeFalsy()
    })

    test('does not emit when no file is selected', async () => {
      const wrapper = mount(ImageUploader)

      const input = wrapper.find('input[type="file"]')
      Object.defineProperty(input.element, 'files', { value: [], configurable: true })
      await input.trigger('change')
      await flushPromises()

      expect(wrapper.emitted('image-uploaded')).toBeFalsy()
    })
  })

  describe('loading slot prop', () => {
    test('is false initially', () => {
      const wrapper = mount(ImageUploader, {
        slots: {
          default: ({ loading }) => h('div', { 'data-testid': 'slot', 'data-loading': String(loading) })
        }
      })

      expect(wrapper.find('[data-testid="slot"]').attributes('data-loading')).toBe('false')
    })
  })
})
