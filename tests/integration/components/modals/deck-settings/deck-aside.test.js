import { describe, test, expect } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import DeckAside from '@/components/modals/deck-settings/deck-aside.vue'

const LOCALE = 'en-us'

function formatExpected(iso) {
  return new Intl.DateTimeFormat(LOCALE, { month: 'short', year: 'numeric' }).format(new Date(iso))
}

function makeWrapper(deck) {
  return mount(DeckAside, { props: { deck } })
}

describe('DeckAside — title', () => {
  test('renders the deck title when present', () => {
    const wrapper = makeWrapper({ id: 1, title: 'Hiragana Basics' })
    expect(wrapper.find('[data-testid="deck-aside__title"]').text()).toBe('Hiragana Basics')
  })

  test('falls back to the deck.title-placeholder string when title is missing', () => {
    const wrapper = makeWrapper({ id: 1 })
    expect(wrapper.find('[data-testid="deck-aside__title"]').text()).toBe('Deck Name')
  })

  test('falls back to the placeholder when title is an empty string', () => {
    const wrapper = makeWrapper({ id: 1, title: '' })
    expect(wrapper.find('[data-testid="deck-aside__title"]').text()).toBe('Deck Name')
  })

  test('falls back to the placeholder when no deck prop is supplied', () => {
    const wrapper = mount(DeckAside, { props: {} })
    expect(wrapper.find('[data-testid="deck-aside__title"]').text()).toBe('Deck Name')
  })
})

describe('DeckAside — owner', () => {
  test('renders the member_display_name when present', () => {
    const wrapper = makeWrapper({ id: 1, member_display_name: 'Chris' })
    expect(wrapper.find('[data-testid="deck-aside__owner"]').text()).toBe('Chris')
  })

  test('falls back to the owner-fallback string when display name is missing', () => {
    const wrapper = makeWrapper({ id: 1 })
    expect(wrapper.find('[data-testid="deck-aside__owner"]').text()).toBe('Unknown')
  })
})

describe('DeckAside — created_at', () => {
  test('renders a month + year formatted date when created_at is a valid ISO string', () => {
    const iso = '2024-04-15T00:00:00Z'
    const wrapper = makeWrapper({ id: 1, created_at: iso })
    expect(wrapper.find('[data-testid="deck-aside__created-at"]').text()).toBe(formatExpected(iso))
  })

  test('falls back to the date-fallback string when created_at is missing', () => {
    const wrapper = makeWrapper({ id: 1 })
    expect(wrapper.find('[data-testid="deck-aside__created-at"]').text()).toBe('—')
  })

  test('falls back to the date-fallback string when created_at is unparseable', () => {
    const wrapper = makeWrapper({ id: 1, created_at: 'not-a-date' })
    expect(wrapper.find('[data-testid="deck-aside__created-at"]').text()).toBe('—')
  })
})
