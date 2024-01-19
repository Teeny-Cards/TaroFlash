import { faker } from '@faker-js/faker'

export function createDeck({
  id = faker.string.uuid(),
  title = faker.lorem.text(),
  description = faker.lorem.sentences(2),
  isPublic = faker.datatype.boolean(),
  count = faker.number.int({ min: 1, max: 10 }),
  image = {}
} = {}) {
  return {
    id,
    title,
    description,
    isPublic,
    count,
    image
  }
}

export function createDecks(count = 2) {
  return Array.from({ length: count }, (_el, index) => createDeck({ count: index }))
}
