export type ResolvedMemberPreferences = {
  accessibility: {
    left_hand: boolean
  }
}

export const MEMBER_PREFERENCES_DEFAULTS: ResolvedMemberPreferences = {
  accessibility: {
    left_hand: false
  }
}

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
