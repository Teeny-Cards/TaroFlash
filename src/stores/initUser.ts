import { useSessionStore } from '@/stores/session'
import { useMemberStore } from '@/stores/member'
import Logger from '@/utils/logger'

export async function initUser(): Promise<boolean> {
  const session = useSessionStore()
  const memberStore = useMemberStore()

  if (session.authenticated && memberStore.id) return true

  try {
    session.startLoading()
    await session.restoreSession()

    if (session.authenticated && session.user?.id) {
      await memberStore.fetchMember(session.user.id)
    }
  } catch (e: any) {
    Logger.error(`Error initializing user: ${e.message}`)
    return false
  } finally {
    session.stopLoading()
  }

  return session.authenticated
}
