import { build, sequence } from 'mimicry-js'
import { faker } from '@faker-js/faker'
import { CardBuilder } from './card'

export const DeckBuilder = () => {
  return build({
    fields: {
      id: sequence(),
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
          cards: () => CardBuilder().many(faker.number.int({ min: 1, max: 10 }))
        }
      },
      with_due_cards: {
        overrides: {
          due_cards: () => CardBuilder().many(faker.number.int({ min: 1, max: 10 }))
        }
      }
    }
  })
}
