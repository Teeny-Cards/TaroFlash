// Single source of truth for the app's web font.
// The stylesheet `<link>` lives in `index.html` so the parser discovers it
// before main.ts runs. This module exports the same URL + family so
// `@/utils/billing/stripe-theme` can pass them to the Stripe Elements iframe.

export const FONT_URL = 'https://fonts.googleapis.com/css2?family=Tilt+Neon&display=swap'
export const FONT_FAMILY = 'Tilt Neon, sans-serif'
