import { faker } from '@faker-js/faker'

export function createDeck({
  id = faker.datatype.uuid(),
  title = faker.lorem.sentence(),
  description = faker.lorem.sentences(2),
  isPublic = faker.datatype.boolean(),
  count = faker.datatype.number({ min: 1, max: 10 }),
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
  return Array.from({ length: count }, () => createDeck())
}
