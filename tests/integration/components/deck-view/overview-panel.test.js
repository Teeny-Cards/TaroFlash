import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import OverviewPanel from '@/components/deck-view/overview-panel.vue'
import { deck_builder } from '@tests/mocks/models/deck'

test('Renders deck title and description', () => {
  const deck = deck_builder.one()
  const wrapper = mount(OverviewPanel, { props: { deck } })

  expect(wrapper.exists()).toBe(true)
  expect(wrapper.find('[data-testid="overview-panel"]').exists()).toBe(true)
  expect(wrapper.find('[data-testid="overview-panel__title"]').text()).toBe(deck.title)
  expect(wrapper.find('[data-testid="overview-panel__description"]').text()).toBe(deck.description)
})

test('Emits study-clicked event when study button is clicked', () => {
  const deck = deck_builder.one()
  const wrapper = mount(OverviewPanel, { props: { deck } })

  wrapper.find('[data-testid="overview-panel__study-button"]').trigger('click')

  expect(wrapper.emitted('study-clicked')).toBeTruthy()
})

test('Emits settings-clicked event when settings button is clicked', () => {
  const deck = deck_builder.one()
  const wrapper = mount(OverviewPanel, { props: { deck } })

  wrapper.find('[data-testid="overview-panel__settings-button"]').trigger('click')

  expect(wrapper.emitted('settings-clicked')).toBeTruthy()
})
