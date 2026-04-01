import { describe, test, expect, beforeEach } from 'vite-plus/test'
import { useToast } from '@/composables/toast'

describe('useToast', () => {
  beforeEach(() => {
    const { toasts } = useToast()
    toasts.value = []
  })

  test('success adds a success toast', () => {
    const { success, toasts } = useToast()
    success('it worked')
    expect(toasts.value).toHaveLength(1)
    expect(toasts.value[0].state).toBe('success')
    expect(toasts.value[0].message).toBe('it worked')
  })

  test('error adds an error toast', () => {
    const { error, toasts } = useToast()
    error('something broke')
    expect(toasts.value[0].state).toBe('error')
    expect(toasts.value[0].message).toBe('something broke')
  })

  test('warn adds a warn toast', () => {
    const { warn, toasts } = useToast()
    warn('careful')
    expect(toasts.value[0].state).toBe('warn')
  })

  test('info adds an info toast', () => {
    const { info, toasts } = useToast()
    info('heads up')
    expect(toasts.value[0].state).toBe('info')
  })

  test('each toast gets a unique id', () => {
    const { success, toasts } = useToast()
    success('first')
    success('second')
    const ids = toasts.value.map((t) => t.id)
    expect(new Set(ids).size).toBe(2)
  })

  test('toast includes options like subMessage and delay', () => {
    const { success, toasts } = useToast()
    success('done', { subMessage: 'details here', delay: 5000 })
    expect(toasts.value[0].subMessage).toBe('details here')
    expect(toasts.value[0].delay).toBe(5000)
  })

  test('removeToast removes the matching toast by id', () => {
    const { success, removeToast, toasts } = useToast()
    success('one')
    success('two')
    const first = toasts.value[0]
    removeToast(first)
    expect(toasts.value).toHaveLength(1)
    expect(toasts.value[0].message).toBe('two')
  })

  test('multiple toasts accumulate', () => {
    const { success, error, toasts } = useToast()
    success('a')
    success('b')
    error('c')
    expect(toasts.value).toHaveLength(3)
  })
})
