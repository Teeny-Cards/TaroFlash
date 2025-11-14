// ---- Key typing helpers ----
type Modifier = 'ctrl' | 'alt' | 'shift' | 'meta'
type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
type Letter =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z'

type FunctionKey =
  | 'f1'
  | 'f2'
  | 'f3'
  | 'f4'
  | 'f5'
  | 'f6'
  | 'f7'
  | 'f8'
  | 'f9'
  | 'f10'
  | 'f11'
  | 'f12'

type NavigationKey =
  | 'arrowup'
  | 'arrowdown'
  | 'arrowleft'
  | 'arrowright'
  | 'home'
  | 'end'
  | 'pageup'
  | 'pagedown'

type EditingKey = 'tab' | 'enter' | 'space' | 'backspace' | 'delete' | 'insert' | 'escape' | 'esc'

type PunctuationKey = '-' | '=' | '[' | ']' | ';' | "'" | ',' | '.' | '/'

declare type BaseKey = Letter | Digit | FunctionKey | NavigationKey | EditingKey | PunctuationKey

// Canonical normalized format: lowercase, '+'-joined, modifiers first (alpha-sorted).
// Examples: "esc", "tab", "shift+tab", "meta+enter"
declare type KeyCombo = BaseKey | `${Modifier}+${BaseKey}`
