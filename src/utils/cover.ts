export type CoverBindings = {
  'data-theme': MemberTheme | undefined
  class: string[]
  style: Record<string, string>
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
    if (config.pattern_size) classes.push(`bgx-size-[${config.pattern_size}px]`)
    if (config.pattern_opacity !== undefined) {
      classes.push(`bgx-opacity-${Math.round(config.pattern_opacity * 100)}`)
    }
    if (config.pattern_color) {
      classes.push(`bgx-color-[var(--color-${config.pattern_color})]`)
    }
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
