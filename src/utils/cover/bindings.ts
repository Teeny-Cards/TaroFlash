import { BORDER_SIZE_PX, PATTERN_TOKENS } from './tokens'

export type CoverBindingsOptions = {
  fallbackTheme?: Theme
  pattern?: boolean
  border?: boolean
  /** Flat opacity override. Falls back to `PATTERN_TOKENS[pattern].opacity`. */
  patternOpacity?: string
  /** Flat tile-size override (any CSS length). Falls back to `PATTERN_TOKENS[pattern].size`. */
  patternSize?: string
}

export type CoverBindings = {
  'data-theme': Theme | undefined
  'data-theme-dark': Theme | undefined
  class: string[]
  style: Record<string, string>
}

export function coverBindings(
  config?: DeckCover,
  options: CoverBindingsOptions = {}
): CoverBindings {
  const { fallbackTheme, pattern = true, border = true } = options

  return {
    'data-theme': config?.theme ?? fallbackTheme,
    'data-theme-dark': config?.theme_dark,
    class: pattern && config?.pattern ? [`bgx-${config.pattern}`] : [],
    style: {
      ...(pattern && config?.pattern ? buildPatternStyle(config.pattern, options) : {}),
      ...(border && config ? buildBorderStyle() : {})
    }
  }
}

function buildPatternStyle(
  pattern: DeckCoverPattern,
  options: CoverBindingsOptions
): Record<string, string> {
  const token = PATTERN_TOKENS[pattern]

  return {
    '--bgx-fill': 'var(--theme-neutral)',
    '--bgx-opacity': options.patternOpacity ?? token.opacity,
    '--bgx-size': options.patternSize ?? token.size
  }
}

function buildBorderStyle(): Record<string, string> {
  return {
    border: `${BORDER_SIZE_PX}px solid var(--theme-primary)`
  }
}
