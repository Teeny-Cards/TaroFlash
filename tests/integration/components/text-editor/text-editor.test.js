import { describe, test, expect, vi } from 'vite-plus/test'
import { shallowMount } from '@vue/test-utils'
import TextEditor from '@/components/text-editor/text-editor.vue'

// ── Hoisted mocks ──────────────────────────────────────────────────────────────

// Shared ref created lazily on first useTextComposer call.
// Tests set `mockHasContent` before mounting to control placeholder visibility.
let mockHasContent

vi.mock('@/composables/use-text-composer', async () => {
  const { ref: vueRef } = await import('vue')
  return {
    useTextComposer: () => {
      mockHasContent = vueRef(false)
      return { has_content: mockHasContent, focus: vi.fn() }
    }
  }
})

// ── Helpers ────────────────────────────────────────────────────────────────────

function makeEditor(props = {}) {
  return shallowMount(TextEditor, { props })
}

function getEditorEl(wrapper) {
  return wrapper.find('[data-testid="text-editor"]')
}

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('TextEditor', () => {
  // ── Structure ──────────────────────────────────────────────────────────────

  test('renders the editor container', () => {
    const wrapper = makeEditor()
    expect(wrapper.find('[data-testid="text-editor-container"]').exists()).toBe(true)
  })

  test('renders the editor element', () => {
    const wrapper = makeEditor()
    expect(getEditorEl(wrapper).exists()).toBe(true)
  })

  // ── Default classes ────────────────────────────────────────────────────────

  test('applies default size class when no attributes provided', () => {
    const wrapper = makeEditor()
    expect(getEditorEl(wrapper).classes()).toContain('text-editor--size-large')
  })

  test('applies default horizontal alignment class when no attributes provided', () => {
    const wrapper = makeEditor()
    expect(getEditorEl(wrapper).classes()).toContain('text-editor--h-center')
  })

  test('applies default vertical alignment class when no attributes provided', () => {
    const wrapper = makeEditor()
    expect(getEditorEl(wrapper).classes()).toContain('text-editor--v-center')
  })

  // ── Size classes ───────────────────────────────────────────────────────────

  test('applies text-editor--size-small for small text size', () => {
    const wrapper = makeEditor({ attributes: { text_size: 'small' } })
    expect(getEditorEl(wrapper).classes()).toContain('text-editor--size-small')
  })

  test('applies text-editor--size-ginormous for ginormous text size', () => {
    const wrapper = makeEditor({ attributes: { text_size: 'ginormous' } })
    expect(getEditorEl(wrapper).classes()).toContain('text-editor--size-ginormous')
  })

  test('applies text-editor--size-x-large for x-large text size', () => {
    const wrapper = makeEditor({ attributes: { text_size: 'x-large' } })
    expect(getEditorEl(wrapper).classes()).toContain('text-editor--size-x-large')
  })

  // ── Alignment classes ──────────────────────────────────────────────────────

  test('applies text-editor--h-left for left horizontal alignment', () => {
    const wrapper = makeEditor({ attributes: { horizontal_alignment: 'left' } })
    expect(getEditorEl(wrapper).classes()).toContain('text-editor--h-left')
  })

  test('applies text-editor--h-right for right horizontal alignment', () => {
    const wrapper = makeEditor({ attributes: { horizontal_alignment: 'right' } })
    expect(getEditorEl(wrapper).classes()).toContain('text-editor--h-right')
  })

  test('applies text-editor--v-top for top vertical alignment', () => {
    const wrapper = makeEditor({ attributes: { vertical_alignment: 'top' } })
    expect(getEditorEl(wrapper).classes()).toContain('text-editor--v-top')
  })

  test('applies text-editor--v-bottom for bottom vertical alignment', () => {
    const wrapper = makeEditor({ attributes: { vertical_alignment: 'bottom' } })
    expect(getEditorEl(wrapper).classes()).toContain('text-editor--v-bottom')
  })

  // ── Combined attributes ────────────────────────────────────────────────────

  test('applies all three attribute classes together', () => {
    const wrapper = makeEditor({
      attributes: {
        text_size: 'huge',
        horizontal_alignment: 'right',
        vertical_alignment: 'bottom'
      }
    })
    const classes = getEditorEl(wrapper).classes()
    expect(classes).toContain('text-editor--size-huge')
    expect(classes).toContain('text-editor--h-right')
    expect(classes).toContain('text-editor--v-bottom')
  })

  // ── Partial attributes ─────────────────────────────────────────────────────

  test('falls back to defaults for missing attribute fields', () => {
    const wrapper = makeEditor({ attributes: { text_size: 'medium' } })
    const classes = getEditorEl(wrapper).classes()
    expect(classes).toContain('text-editor--size-medium')
    expect(classes).toContain('text-editor--h-center')
    expect(classes).toContain('text-editor--v-center')
  })

  // ── Placeholder ────────────────────────────────────────────────────────────

  test('shows placeholder when no content and not disabled', () => {
    const wrapper = makeEditor({ placeholder: 'Type here...' })
    // mockHasContent defaults to false on each mount
    const placeholder = wrapper.find('.text-editor__placeholder')
    expect(placeholder.exists()).toBe(true)
    expect(placeholder.text()).toBe('Type here...')
  })

  test('hides placeholder when has content', async () => {
    const wrapper = makeEditor({ placeholder: 'Type here...' })
    mockHasContent.value = true
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.text-editor__placeholder').exists()).toBe(false)
  })

  test('hides placeholder when disabled', () => {
    const wrapper = makeEditor({ placeholder: 'Type here...', disabled: true })
    expect(wrapper.find('.text-editor__placeholder').exists()).toBe(false)
  })
})
