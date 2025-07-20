import { build, sequence } from 'mimicry-js'
import { faker } from '@faker-js/faker'
import { vi } from 'vitest'

export const ModalEntryBuilder = (component) => {
  return build({
    fields: {
      id: sequence(),
      backdrop: () => faker.datatype.boolean(),
      closeOnBackdropClick: () => faker.datatype.boolean(),
      component,
      componentProps: () => ({}),
      resolve: () => vi.fn()
    }
  })
}
