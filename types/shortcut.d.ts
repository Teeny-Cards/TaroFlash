// Allowed modifier names (lowercase)
declare type Modifier = 'ctrl' | 'meta' | 'alt' | 'shift'

// Single modifier format: "ctrl+"
type ModString<M extends Modifier> = `${M}+`

// One or more modifiers in canonical order:
declare type ModPrefix =
  | ''
  | `${ModString<'ctrl'>}`
  | `${ModString<'ctrl'>}${ModString<'meta'>}`
  | `${ModString<'ctrl'>}${ModString<'meta'>}${ModString<'alt'>}`
  | `${ModString<'ctrl'>}${ModString<'meta'>}${ModString<'alt'>}${ModString<'shift'>}`
  | `${ModString<'ctrl'>}${ModString<'alt'>}`
  | `${ModString<'ctrl'>}${ModString<'alt'>}${ModString<'shift'>}`
  | `${ModString<'ctrl'>}${ModString<'shift'>}`
  | `${ModString<'meta'>}`
  | `${ModString<'meta'>}${ModString<'alt'>}`
  | `${ModString<'meta'>}${ModString<'alt'>}${ModString<'shift'>}`
  | `${ModString<'meta'>}${ModString<'shift'>}`
  | `${ModString<'alt'>}`
  | `${ModString<'alt'>}${ModString<'shift'>}`
  | `${ModString<'shift'>}`
// (This is still manageable and keeps perfect autocomplete.)

// Allowed final keys:
// You can expand or customize this to match your app behavior.
declare type KeyBase =
  | 'esc'
  | 'tab'
  | 'space'
  | 'enter'
  | 'backspace'
  | 'delete'
  | 'arrowup'
  | 'arrowdown'
  | 'arrowleft'
  | 'arrowright'

// Final strongly typed KeyCombo:
declare type KeyCombo = `${ModPrefix}${KeyBase}`
