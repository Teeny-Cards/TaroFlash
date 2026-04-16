import { useMemberStore } from '@/stores/member'
import { PLANS } from '@/config/plans'

/**
 * Capability checks for the current member.
 *
 * Name capabilities by the feature, not by the role that currently has access.
 *
 *   Bad:  `can.administrate()`  — implies "because they're an admin"
 *   Good: `can.manageUsers()`   — implies "because they need to manage users"
 *
 * When a policy changes (e.g. paid users should now export analytics), edit
 * the single line in this file — every call site picks up the new behavior
 * automatically. Call sites should never ask "is this user an admin?"; they
 * should ask "is this user allowed to do X?" and let `useCan` answer.
 *
 * Rule of thumb: if renaming a capability would feel wrong when the policy
 * changes, the name is wrong.
 *
 * @example
 * const can = useCan()
 * if (can.useProFeature()) { ... }
 */
export function useCan() {
  const member = useMemberStore()

  const isPaid = () => member.plan === 'paid'
  const _isModerator = () => member.role === 'moderator' || member.role === 'admin'
  const _isAdmin = () => member.role === 'admin'

  return {
    useProFeature: isPaid, // this is an example
    createDeck: (currentDeckCount: number) => {
      const limit = PLANS[member.plan ?? 'free'].deckLimit
      return limit === null || currentDeckCount < limit
    }
  }
}
