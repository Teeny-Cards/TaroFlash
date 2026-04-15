export type CoverBindings = {
  'data-theme': MemberTheme | undefined
  class: string[]
  style: Record<string, string>
}

export const PATTERN_SIZE_SCALE: Record<DeckCoverPattern, number> = {
  'diagonal-stripes': 1.15,
  saw: 1,
  wave: 2,
  'bank-note': 2.3,
  aztec: 1,
  'endless-clouds': 2
}

export function patternSize(pattern: DeckCoverPattern, size: number): string {
  return `${size * PATTERN_SIZE_SCALE[pattern]}px`
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
  fallbackTheme?: MemberTheme
  pattern?: boolean
  border?: boolean
  bgImage?: boolean
}

export function coverBindings(
  config?: DeckCover,
  options: CoverBindingsOptions = {}
): CoverBindings {
  const { fallbackTheme, pattern = true, border = true, bgImage = true } = options

  const classes: string[] = []
  const style: Record<string, string> = {}

  if (pattern && config?.pattern) {
    classes.push(`bgx-${config.pattern}`)
    style['--bgx-fill'] = 'var(--theme-neutral)'
    style['--bgx-opacity'] = patternOpacity(config.pattern, 0.2)
    if (config.pattern_size) style['--bgx-size'] = patternSize(config.pattern, config.pattern_size)
  }

  if (border && config?.border_size) {
    style.border = `${config.border_size}px solid var(--theme-primary)`
  }

  if (bgImage && config?.bg_image) {
    style.backgroundImage = `url('${config.bg_image}')`
    style.backgroundSize = 'cover'
    style.backgroundPosition = 'center'
  }

  return {
    'data-theme': config?.bg_color ?? fallbackTheme,
    class: classes,
    style
  }
}
