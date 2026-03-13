import { build, sequence } from 'mimicry-js'
import { vi } from 'vite-plus/test'

export const ModalEntryBuilder = (component) => {
  return build({
    fields: {
      id: sequence(),
      backdrop: true,
      global_close: true,
      component,
      componentProps: () => ({}),
      resolve: () => vi.fn(),
      close: () => vi.fn()
    }
  })
}
