export type CoverBindings = {
  'data-theme': Theme | undefined
  'data-theme-dark': Theme | undefined
  class: string[]
  style: Record<string, string>
}

export const PATTERN_SIZE_PX = 60
export const BORDER_SIZE_PX = 16

export const PATTERN_SIZE_SCALE: Record<DeckCoverPattern, number> = {
  'diagonal-stripes': 1.15,
  saw: 1,
  wave: 2,
  'bank-note': 2.3,
  aztec: 1,
  'endless-clouds': 2
}

export function patternSize(pattern: DeckCoverPattern, multiplier = 1): string {
  return `${PATTERN_SIZE_PX * PATTERN_SIZE_SCALE[pattern] * multiplier}px`
}

export const PATTERN_OPACITY_SCALE: Record<DeckCoverPattern, number> = {
  'diagonal-stripes': 1,
  saw: 1,
  wave: 3.5,
  'bank-note': 1.2,
  aztec: 1,
  'endless-clouds': 3
}

export function patternOpacity(pattern: DeckCoverPattern, baseline: number): string {
  return String(baseline * PATTERN_OPACITY_SCALE[pattern])
}

export type CoverBindingsOptions = {
  fallbackTheme?: Theme
  pattern?: boolean
  border?: boolean
  patternOpacity?: string
}

export function coverBindings(
  config?: DeckCover,
  options: CoverBindingsOptions = {}
): CoverBindings {
  const { fallbackTheme, pattern = true, border = true } = options

  const classes: string[] = []
  const style: Record<string, string> = {}

  if (pattern && config?.pattern) {
    classes.push(`bgx-${config.pattern}`)
    style['--bgx-fill'] = 'var(--theme-neutral)'
    style['--bgx-opacity'] = options.patternOpacity ?? patternOpacity(config.pattern, 0.2)
    style['--bgx-size'] = patternSize(config.pattern)
  }

  if (border && config) {
    style.border = `${BORDER_SIZE_PX}px solid var(--theme-primary)`
  }

  return {
    'data-theme': config?.theme ?? fallbackTheme,
    'data-theme-dark': config?.theme_dark,
    class: classes,
    style
  }
}
