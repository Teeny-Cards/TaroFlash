import { describe, test, expect, vi } from 'vite-plus/test'
import { shallowMount } from '@vue/test-utils'
import Deck from '@/components/deck/deck-thumbnail.vue'

// Stub GSAP — pulled in transitively via Card
vi.mock('gsap', () => ({ gsap: { fromTo: vi.fn(), to: vi.fn() } }))

function makeDeck(deck = {}, extraProps = {}) {
  return shallowMount(Deck, {
    props: { deck: { title: 'Test Deck', ...deck }, ...extraProps }
  })
}

describe('Deck', () => {
  // ── Root element ──────────────────────────────────────────────────────────────

  test('renders the deck element', () => {
    const wrapper = makeDeck()
    expect(wrapper.find('[data-testid="deck-thumbnail"]').exists()).toBe(true)
  })

  // ── Card component with cover side ────────────────────────────────────────────

  test('renders a Card component with side=cover', () => {
    const wrapper = makeDeck()
    const card = wrapper.findComponent({ name: 'Card' })
    expect(card.exists()).toBe(true)
    expect(card.props('side')).toBe('cover')
  })

  test('passes deck.cover_config to the Card component', () => {
    const cover_config = { bg_color: 'blue-500', pattern: 'stars' }
    const wrapper = makeDeck({ cover_config })
    expect(wrapper.findComponent({ name: 'Card' }).props('cover_config')).toEqual(cover_config)
  })

  test('passes undefined cover_config when deck has none', () => {
    const wrapper = makeDeck({})
    expect(wrapper.findComponent({ name: 'Card' }).props('cover_config')).toBeUndefined()
  })

  // ── Size prop ─────────────────────────────────────────────────────────────────

  test('defaults to base size', () => {
    const wrapper = makeDeck()
    expect(wrapper.findComponent({ name: 'Card' }).props('size')).toBe('base')
  })

  test('forwards size prop to Card', () => {
    const wrapper = makeDeck({}, { size: 'xl' })
    expect(wrapper.findComponent({ name: 'Card' }).props('size')).toBe('xl')
  })

  // ── Title ─────────────────────────────────────────────────────────────────────

  test('shows deck title by default', () => {
    const wrapper = makeDeck({ title: 'My Deck' })
    expect(wrapper.text()).toContain('My Deck')
  })

  test('hides title when hide_title is true', () => {
    const wrapper = makeDeck({ title: 'My Deck' }, { hide_title: true })
    expect(wrapper.text()).not.toContain('My Deck')
  })

  // ── Optional deck prop ────────────────────────────────────────────────────────

  test('renders without crashing when deck prop is not provided', () => {
    const wrapper = shallowMount(Deck, { props: {} })
    expect(wrapper.find('[data-testid="deck-thumbnail"]').exists()).toBe(true)
  })

  test('passes undefined cover_config to Card when deck is not provided', () => {
    const wrapper = shallowMount(Deck, { props: {} })
    expect(wrapper.findComponent({ name: 'Card' }).props('cover_config')).toBeUndefined()
  })

  test('shows empty title when deck is not provided', () => {
    const wrapper = shallowMount(Deck, { props: {} })
    expect(wrapper.text()).toBe('')
  })
})
