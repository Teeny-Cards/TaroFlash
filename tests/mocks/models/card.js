import { build, sequence } from 'mimicry-js'
import { faker } from '@faker-js/faker'

export const review_builder = build({
  fields: {
    due: () => faker.date.future(),
    ease: () => faker.number.int({ min: 1, max: 5 }),
    interval: () => faker.number.int({ min: 1, max: 30 }),
    lapses: () => faker.number.int({ min: 0, max: 3 }),
    last_review: () => faker.date.past(),
    learning_steps: () => faker.number.int({ min: 0, max: 10 }),
    reps: () => faker.number.int({ min: 1, max: 10 }),
    scheduled_days: () => faker.number.int({ min: 1, max: 30 }),
    stability: () => faker.number.float({ min: 0.5, max: 2 }),
    state: () => faker.number.int({ min: 0, max: 2 })
  }
})

export const card_builder = build({
  fields: {
    id: () => faker.number.int({ min: 1, max: 100 }),
    front_text: () => faker.lorem.words(),
    back_text: () => faker.lorem.words(),
    deck_id: () => faker.number.int({ min: 1, max: 10 }),
    created_at: () => faker.date.past(),
    updated_at: () => faker.date.past(),
    order: sequence(),
    review: undefined
  },
  traits: {
    with_review: {
      overrides: {
        review: () => review_builder.one()
      }
    }
  }
})
