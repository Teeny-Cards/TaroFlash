import { TeenyError } from '@/utils/TeenyError'

declare global {
  type Result<T> = { success: true; value: T } | { success: false; error: TeenyError }
}
