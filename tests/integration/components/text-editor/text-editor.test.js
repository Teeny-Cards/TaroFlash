import { describe, test, expect } from 'vite-plus/test'
import { shallowMount } from '@vue/test-utils'
import TextEditor from '@/components/text-editor/text-editor.vue'

// ── Helpers ────────────────────────────────────────────────────────────────────

function makeEditor(props = {}) {
  return shallowMount(TextEditor, { props })
}

function getEditorEl(wrapper) {
  return wrapper.find('[data-testid="text-editor"]')
}

function getPlaceholder(wrapper) {
  return wrapper.find('[data-testid="text-editor__placeholder"]')
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

  // ── contenteditable wiring ─────────────────────────────────────────────────

  test('enables plaintext-only contenteditable when not disabled', () => {
    const wrapper = makeEditor()
    expect(getEditorEl(wrapper).attributes('contenteditable')).toBe('plaintext-only')
  })

  test('disables contenteditable when disabled', () => {
    const wrapper = makeEditor({ disabled: true })
    expect(getEditorEl(wrapper).attributes('contenteditable')).toBe('false')
  })

  test('seeds initial textContent from content prop', () => {
    const wrapper = makeEditor({ content: 'hello' })
    expect(getEditorEl(wrapper).element.textContent).toBe('hello')
  })

  test('emits update with current textContent on input', async () => {
    const wrapper = makeEditor()
    const el = getEditorEl(wrapper)
    el.element.textContent = 'typed'
    await el.trigger('input')
    expect(wrapper.emitted('update')).toEqual([['typed']])
  })

  test('emits focus and blur on native focus events', async () => {
    const wrapper = makeEditor()
    const el = getEditorEl(wrapper)
    await el.trigger('focus')
    await el.trigger('blur')
    expect(wrapper.emitted('focus')).toHaveLength(1)
    expect(wrapper.emitted('blur')).toHaveLength(1)
  })

  // ── Placeholder ────────────────────────────────────────────────────────────

  test('shows placeholder when no content and not disabled', () => {
    const wrapper = makeEditor({ placeholder: 'Type here...' })
    const placeholder = getPlaceholder(wrapper)
    expect(placeholder.exists()).toBe(true)
    expect(placeholder.text()).toBe('Type here...')
  })

  test('hides placeholder when content prop is set', () => {
    const wrapper = makeEditor({ placeholder: 'Type here...', content: 'hi' })
    expect(getPlaceholder(wrapper).exists()).toBe(false)
  })

  test('hides placeholder after typing', async () => {
    const wrapper = makeEditor({ placeholder: 'Type here...' })
    const el = getEditorEl(wrapper)
    el.element.textContent = 'typed'
    await el.trigger('input')
    expect(getPlaceholder(wrapper).exists()).toBe(false)
  })

  test('hides placeholder when disabled', () => {
    const wrapper = makeEditor({ placeholder: 'Type here...', disabled: true })
    expect(getPlaceholder(wrapper).exists()).toBe(false)
  })
})
