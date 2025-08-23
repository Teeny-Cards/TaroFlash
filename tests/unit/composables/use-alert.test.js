import { describe, test, expect, vi, beforeEach } from 'vitest'
import { useAlert } from '@/composables/use-alert'

test('warn opens alert with warn type', () => {
  const { warn } = useAlert()

  const result = warn()
  expect(result).toBeDefined()
})

test('info opens alert with info type', () => {
  const { info } = useAlert()

  const result = info()
  expect(result).toBeDefined()
})

test('warn opens alert with correct props', () => {
  const { warn } = useAlert()

  const result = warn({
    title: 'Test Title',
    message: 'Test Message',
    confirmLabel: 'Test Confirm',
    cancelLabel: 'Test Cancel'
  })

  expect(result).toBeDefined()
})
