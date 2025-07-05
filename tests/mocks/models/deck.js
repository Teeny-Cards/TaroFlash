import { build } from 'mimicry-js'
import { faker } from '@faker-js/faker'
import { card_builder } from './card'

export const deck_builder = build({
  fields: {
    id: () => faker.number.int({ min: 1, max: 100 }),
    created_at: () => faker.date.past(),
    updated_at: () => faker.date.past(),
    description: () => faker.word.words({ count: { min: 1, max: 10 } }),
    is_public: () => faker.datatype.boolean(),
    title: () => faker.word.words({ count: { min: 1, max: 3 } }),
    member_id: () => faker.number.int({ min: 1, max: 10 }),
    member: () => ({
      display_name: faker.person.firstName()
    }),
    cards: () => [],
    tags: () => [],
    image_path: () => faker.image.url(),
    due_cards: () => []
  },
  traits: {
    with_cards: {
      overrides: {
        cards: () => card_builder.many(faker.number.int({ min: 1, max: 10 }))
      }
    },
    with_due_cards: {
      overrides: {
        due_cards: () => card_builder.many(faker.number.int({ min: 1, max: 10 }))
      }
    }
  }
})
