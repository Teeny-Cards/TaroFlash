import { MEMBER_SETTINGS_DEFAULTS } from './defaults'

export type MemberEditorState = {
  settings: { display_name?: string; description?: string }
}

export type MemberPayload = {
  display_name: string
  description: string
}

/**
 * Build the persisted shape of a member profile from live editor state.
 * Single source of truth for "what counts as editable profile content" —
 * consumed by save (network payload) and the dirty-state check.
 */
export function buildMemberPayload(state: MemberEditorState): MemberPayload {
  return {
    display_name: state.settings.display_name ?? MEMBER_SETTINGS_DEFAULTS.display_name,
    description: state.settings.description ?? MEMBER_SETTINGS_DEFAULTS.description
  }
}

/** True when the current payload differs from a previously captured snapshot. */
export function hasMemberChanges(state: MemberEditorState, snapshot: MemberPayload): boolean {
  return JSON.stringify(buildMemberPayload(state)) !== JSON.stringify(snapshot)
}
