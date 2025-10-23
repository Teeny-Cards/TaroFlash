import { build, sequence } from 'mimicry-js'
import { faker } from '@faker-js/faker'
import { card } from './card'

export const deck = build({
  fields: {
    id: sequence(),
    created_at: () => faker.date.past().toISOString(),
    updated_at: () => faker.date.past().toISOString(),
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
    due_cards: () => [],
    config: () => ({
      study_all_cards: false,
      retry_failed_cards: true
    })
  },
  traits: {
    with_cards: {
      overrides: {
        cards: () => card.many(faker.number.int({ min: 3, max: 10 }))
      }
    },
    with_some_due_cards: {
      overrides: {
        cards: () => [
          ...card.many(faker.number.int({ min: 1, max: 10 }), {
            traits: 'with_due_review'
          }),
          ...card.many(faker.number.int({ min: 1, max: 10 }), {
            traits: 'with_not_due_review'
          })
        ]
      }
    }
  }
})
