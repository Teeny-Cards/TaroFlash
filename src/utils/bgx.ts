// Static maps ensure Tailwind's scanner includes every bgx-* class name as a
// literal so they survive the build. Dynamic class construction (e.g.
// `bgx-${pattern}`) would be stripped.

export const BGX_PATTERN_CLASS: Record<DeckCoverPattern, string> = {
  'diagonal-stripes': 'bgx-diagonal-stripes',
  saw: 'bgx-saw',
  wave: 'bgx-wave',
  'bank-note': 'bgx-bank-note',
  aztec: 'bgx-aztec',
  'endless-clouds': 'bgx-endless-clouds',
  stars: 'bgx-stars',
  leaf: 'bgx-leaf',
  'dot-grid': 'bgx-dot-grid'
}

export const BGX_SIZE_CLASS: Record<number, string> = {
  10: 'bgx-size-10',
  12: 'bgx-size-12',
  15: 'bgx-size-15',
  20: 'bgx-size-20',
  25: 'bgx-size-25',
  30: 'bgx-size-30'
}

export type BgxConfig = {
  pattern?: DeckCoverPattern
  size?: number
}

export function bgxClasses(config?: BgxConfig): string[] {
  if (!config) return []
  const classes: string[] = []
  if (config.pattern) classes.push(BGX_PATTERN_CLASS[config.pattern])
  if (config.size) {
    const cls = BGX_SIZE_CLASS[config.size]
    if (cls) classes.push(cls)
  }
  return classes
}
