export const SUPPORTED_THEMES: DeckTheme[] = [
  { light: 'green-500', dark: 'green-800' },
  { light: 'blue-500', dark: 'blue-650' },
  { light: 'purple-500', dark: 'purple-700' },
  { light: 'pink-500', dark: 'pink-700' },
  { light: 'red-500', dark: 'red-600' },
  { light: 'orange-700', dark: 'orange-700' },
  { light: 'yellow-500', dark: 'yellow-700' }
]

export const SUPPORTED_PATTERNS: DeckCoverPattern[] = [
  'diagonal-stripes',
  'wave',
  'bank-note',
  'aztec',
  'endless-clouds'
]

export const SUPPORTED_ICONS: string[] = [
  'card-deck',
  'book',
  'school-cap',
  'music-note',
  'moon-stars',
  'cable-car',
  'bell',
  'public',
  'id-card'
]

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

export function randomCoverConfig(): DeckCover {
  const theme = pick(SUPPORTED_THEMES)
  return {
    theme: theme.light,
    theme_dark: theme.dark,
    pattern: pick(SUPPORTED_PATTERNS),
    icon: pick(SUPPORTED_ICONS)
  }
}
