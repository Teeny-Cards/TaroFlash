/**
 * Default values for member-editor staging + the settings UI. Both the
 * profile tab and the member-card preview pull initial values from here when
 * the underlying member record is missing a field.
 */

export const MEMBER_SETTINGS_DEFAULTS = {
  display_name: '',
  description: ''
} as const

export const MEMBER_CARD_PREVIEW_DEFAULTS = {
  theme: 'green-600' as Theme
} as const
