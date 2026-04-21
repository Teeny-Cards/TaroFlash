import { describe, test, expect, vi } from 'vite-plus/test'
import { shallowMount } from '@vue/test-utils'
import Card from '@/components/card/index.vue'

// Stub GSAP so transition hooks don't error in jsdom
vi.mock('gsap', () => ({ gsap: { fromTo: vi.fn(), to: vi.fn() } }))

function mountCard(props = {}) {
  return shallowMount(Card, { props: { side: 'front', ...props } })
}

describe('Card (cover side)', () => {
  // ── Cover rendering ──────────────────────────────��────────────────────────────

  test('renders card-cover-stub when side is cover', () => {
    const wrapper = mountCard({ side: 'cover' })
    expect(wrapper.findComponent({ name: 'CardCover' }).exists()).toBe(true)
  })

  test('does not render card-cover-stub when side is front', () => {
    const wrapper = mountCard({ side: 'front' })
    expect(wrapper.findComponent({ name: 'CardCover' }).exists()).toBe(false)
  })

  test('does not render card-cover-stub when side is back', () => {
    const wrapper = mountCard({ side: 'back' })
    expect(wrapper.findComponent({ name: 'CardCover' }).exists()).toBe(false)
  })

  // ── cover_config forwarding ──────────────────────────────��────────────────────

  test('passes cover_config to card-cover', () => {
    const cover_config = { bg_color: 'blue-500', pattern: 'stars' }
    const wrapper = mountCard({ side: 'cover', cover_config })
    const coverStub = wrapper.findComponent({ name: 'CardCover' })
    expect(coverStub.props('cover')).toEqual(cover_config)
  })

  test('passes undefined cover_config when not provided', () => {
    const wrapper = mountCard({ side: 'cover' })
    const coverStub = wrapper.findComponent({ name: 'CardCover' })
    expect(coverStub.props('cover')).toBeUndefined()
  })

  // ── error prop → data-error attribute (drives red outline in CSS) ────────────

  test('does not set data-error on the root when error is false', () => {
    const wrapper = mountCard({ error: false })
    expect(wrapper.find('[data-testid="card"]').attributes('data-error')).toBeUndefined()
  })

  test('does not set data-error on the root when error is omitted (defaults to false)', () => {
    const wrapper = mountCard()
    expect(wrapper.find('[data-testid="card"]').attributes('data-error')).toBeUndefined()
  })

  test('sets data-error on the root when error is true', () => {
    const wrapper = mountCard({ error: true })
    // Binding uses `error || undefined` so the attribute is absent when false
    // and present when true; we don't assert a specific value string.
    expect(wrapper.find('[data-testid="card"]').attributes('data-error')).toBeDefined()
  })
})
