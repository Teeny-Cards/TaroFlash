import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import OverviewPanel from '@/components/views/deck-view/overview-panel.vue'
import { DeckBuilder } from '@tests/mocks/models/deck'

test('Renders deck title and description', () => {
  const deck = DeckBuilder().one()
  const wrapper = mount(OverviewPanel, { props: { deck } })

  expect(wrapper.exists()).toBe(true)
  expect(wrapper.find('[data-testid="overview-panel"]').exists()).toBe(true)
  expect(wrapper.find('[data-testid="overview-panel__title"]').text()).toBe(deck.title)
  expect(wrapper.find('[data-testid="overview-panel__description"]').text()).toBe(deck.description)
})

test('Emits study-clicked event when study button is clicked and deck has cards', () => {
  const deck = DeckBuilder().one({ traits: 'with_cards' })
  const wrapper = mount(OverviewPanel, { props: { deck } })

  wrapper.find('[data-testid="overview-panel__study-button"]').trigger('click')

  expect(wrapper.emitted('study-clicked')).toBeTruthy()
})

test('Does not emit study-clicked event when study button is clicked and deck has no cards', () => {
  const deck = DeckBuilder().one()
  const wrapper = mount(OverviewPanel, { props: { deck } })

  wrapper.find('[data-testid="overview-panel__study-button"]').trigger('click')

  expect(wrapper.emitted('study-clicked')).toBeFalsy()
})
