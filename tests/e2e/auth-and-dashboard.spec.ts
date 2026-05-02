import { test, expect, seedDeck } from './_fixtures'
import { loginAs } from './_helpers'

test('authenticated user lands on the dashboard with their decks visible', async ({
  page,
  user
}) => {
  const deck = await seedDeck(user, 'E2E Smoke Deck')

  await loginAs(page, user)

  await expect(page.getByTestId('dashboard')).toContainText(deck.title)
})
