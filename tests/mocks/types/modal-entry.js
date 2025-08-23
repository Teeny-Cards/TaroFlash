import { build, sequence } from 'mimicry-js'
import { vi } from 'vitest'

export const ModalEntryBuilder = (component) => {
  return build({
    fields: {
      id: sequence(),
      backdrop: true,
      closeOnBackdropClick: true,
      component,
      componentProps: () => ({}),
      resolve: () => vi.fn(),
      close: () => vi.fn()
    }
  })
}
