export const MEMBER_PREFERENCES_DEFAULTS = {
  accessibility: {
    left_hand: false
  }
} as const

type DeepRequired<T> = { [K in keyof T]-?: T[K] extends object ? DeepRequired<T[K]> : T[K] }

export type ResolvedMemberPreferences = DeepRequired<typeof MEMBER_PREFERENCES_DEFAULTS>

/** Merge a partial preferences blob over defaults, filling any missing namespace/key. */
export function withMemberPreferencesDefaults(
  partial?: MemberPreferences | null
): ResolvedMemberPreferences {
  return {
    accessibility: {
      left_hand:
        partial?.accessibility?.left_hand ?? MEMBER_PREFERENCES_DEFAULTS.accessibility.left_hand
    }
  }
}
