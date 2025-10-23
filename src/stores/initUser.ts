import { useSessionStore } from '@/stores/session'
import { useMemberStore } from '@/stores/member'
import { useLogger } from '@/composables/use-logger'

export async function initUser(): Promise<boolean> {
  const session = useSessionStore()
  const memberStore = useMemberStore()
  const logger = useLogger()

  session.startLoading()

  try {
    if (!session.authenticated) {
      await session.restoreSession()
    }

    if (session.user_id && !memberStore.has_member) {
      await memberStore.fetchMember(session.user_id)
    }

    return session.authenticated
  } catch (e: any) {
    logger.error(`Error initializing user: ${e.message}`)
    return false
  } finally {
    session.stopLoading()
  }
}
