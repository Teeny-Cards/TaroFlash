import { test, expect, seedDeck } from './_fixtures'

test('authenticated user lands on the dashboard with their decks visible', async ({
  page,
  user
}) => {
  const deck = await seedDeck(user, 'E2E Smoke Deck')

  await page.goto('/')
  await page.getByRole('button', { name: /log in/i }).click()
  await page.locator('input[name="email"]').fill(user.email)
  await page.locator('input[name="password"]').fill(user.password)
  await page.getByRole('button', { name: /let'?s go/i }).click()

  const dashboard = page.getByTestId('dashboard')
  await expect(dashboard).toBeVisible()
  await expect(dashboard).toContainText(deck.title)
})
