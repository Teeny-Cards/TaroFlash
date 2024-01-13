import { TeenyError } from '@/utils/TeenyError'

declare global {
  type TeenyResponse<T> = Promise<
    { success: true; value: T } | { success: false; error: TeenyError }
  >
}
