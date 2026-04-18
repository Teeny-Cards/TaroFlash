// Shared Appearance config for the Stripe Payment Element — reused by the
// initial checkout flow and the add-credit-card modal so both share the same
// colors, typography, and control styles as the rest of the app.
//
// Colors are resolved from Tailwind's :root CSS variables at call time so a
// palette tweak propagates everywhere without another hand-edit here.

import type { Appearance } from '@stripe/stripe-js'
import { FONT_FAMILY, FONT_URL } from '@/styles/fonts'

function token(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

/** Stripe doesn't parse `color-mix()` / alpha functions — build an 8-digit hex. */
function withAlpha(hex: string, percent: number): string {
  const clean = hex.replace('#', '')
  const alpha = Math.round((percent / 100) * 255)
    .toString(16)
    .padStart(2, '0')
  return `#${clean}${alpha}`
}

export function getStripeAppearance(): Appearance {
  const green600 = token('--color-green-600')
  const brown50 = token('--color-brown-50')
  const brown100 = token('--color-brown-100')
  const brown200 = token('--color-brown-200')
  const brown300 = token('--color-brown-300')
  const brown500 = token('--color-brown-500')
  const brown700 = token('--color-brown-700')
  const red600 = token('--color-red-600')

  return {
    theme: 'stripe',
    variables: {
      colorPrimary: green600,
      colorBackground: brown50,
      colorText: brown700,
      colorDanger: red600,
      colorTextPlaceholder: brown500,
      fontFamily: FONT_FAMILY,
      spacingUnit: '4px',
      borderRadius: '8px'
    },
    rules: {
      '.Input': {
        border: `1px solid ${brown300}`,
        boxShadow: 'none'
      },
      '.Input:focus': {
        border: `1px solid ${green600}`,
        boxShadow: `0 0 0 3px ${withAlpha(green600, 25)}`
      },
      '.Label': {
        color: brown700,
        fontWeight: '500'
      },
      '.Tab': {
        border: `1px solid ${brown300}`,
        backgroundColor: brown50
      },
      '.Tab:hover': {
        backgroundColor: brown200
      },
      '.Tab--selected': {
        borderColor: green600,
        backgroundColor: brown100
      }
    }
  }
}

export const STRIPE_FONTS = [{ cssSrc: FONT_URL }]
