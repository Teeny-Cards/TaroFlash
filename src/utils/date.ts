export function isoNow(): string {
  return new Date().toISOString()
}

type DateInput = string | number | Date

function toDate(input: DateInput): Date {
  return input instanceof Date ? input : new Date(input)
}

const MEDIUM_OPTIONS: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
}

export function formatShortDate(input: DateInput, locale?: string): string {
  return new Intl.DateTimeFormat(locale, MEDIUM_OPTIONS).format(toDate(input))
}

type RelativeStyle = 'long' | 'short' | 'narrow'

type RelativeOptions = {
  style?: RelativeStyle
  locale?: string
}

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 31_536_000],
  ['month', 2_592_000],
  ['week', 604_800],
  ['day', 86_400],
  ['hour', 3_600],
  ['minute', 60],
  ['second', 1]
]

export function toRelative(input: DateInput, options: RelativeOptions = {}): string {
  const { style = 'long', locale } = options
  const diffSeconds = (toDate(input).getTime() - Date.now()) / 1000
  const absSeconds = Math.abs(diffSeconds)
  const formatter = new Intl.RelativeTimeFormat(locale, { style })

  for (const [unit, perUnit] of RELATIVE_UNITS) {
    if (absSeconds >= perUnit) {
      return formatter.format(Math.round(diffSeconds / perUnit), unit)
    }
  }

  return formatter.format(0, 'second')
}
