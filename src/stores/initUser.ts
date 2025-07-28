import { useSessionStore } from '@/stores/session'
import { useMemberStore } from '@/stores/member'
import { useLogger } from '@/composables/use-logger'

export async function initUser(): Promise<boolean> {
  const session = useSessionStore()
  const memberStore = useMemberStore()
  const logger = useLogger()

  if (session.authenticated && memberStore.id) return true

  try {
    session.startLoading()
    await session.restoreSession()

    if (session.authenticated && session.user?.id) {
      await memberStore.fetchMember(session.user.id)
    }
  } catch (e: any) {
    logger.error(`Error initializing user: ${e.message}`)
    return false
  } finally {
    session.stopLoading()
  }

  return session.authenticated
}
