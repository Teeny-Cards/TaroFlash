import { mount } from '@vue/test-utils'
import { expect, test, vi, beforeEach } from 'vite-plus/test'
import OverviewPanel from '@/views/deck/overview-panel.vue'
import { deck as deckBuilder } from '@tests/mocks/models/deck'

const mocks = vi.hoisted(() => ({
  openModal: vi.fn()
}))

vi.mock('@/composables/modal', () => ({
  useModal: () => ({
    open: mocks.openModal
  })
}))

beforeEach(() => {
  vi.clearAllMocks()
  mocks.openModal.mockReturnValue({ response: Promise.resolve(null) })
})

test('Renders overview panel', () => {
  const deck = deckBuilder.one()
  const wrapper = mount(OverviewPanel, { props: { deck } })

  expect(wrapper.exists()).toBe(true)
  expect(wrapper.find('[data-testid="overview-panel"]').exists()).toBe(true)
})

test('Renders deck description', () => {
  const deck = deckBuilder.one()
  const wrapper = mount(OverviewPanel, { props: { deck } })

  expect(wrapper.find('[data-testid="overview-panel__description"]').text()).toBe(deck.description)
})

test('Study button is disabled when deck has no cards', () => {
  const deck = deckBuilder.one()
  const wrapper = mount(OverviewPanel, { props: { deck } })

  expect(
    wrapper.find('[data-testid="overview-panel__study-button"]').attributes('disabled')
  ).toBeDefined()
})

test('Study button is enabled when deck has cards', () => {
  const deck = deckBuilder.one({ traits: 'with_cards' })
  const wrapper = mount(OverviewPanel, { props: { deck } })

  expect(
    wrapper.find('[data-testid="overview-panel__study-button"]').attributes('disabled')
  ).toBeUndefined()
})

test('Clicking study button opens a modal', async () => {
  const deck = deckBuilder.one({ traits: 'with_cards' })
  const wrapper = mount(OverviewPanel, { props: { deck } })

  await wrapper.find('[data-testid="overview-panel__study-button"]').trigger('click')

  expect(mocks.openModal).toHaveBeenCalled()
})
