// Single source of truth for the app's web font.
// Referenced by `main.ts` (to inject the stylesheet link into index.html)
// and by `@/utils/billing/stripe-theme` (to pass the same stylesheet to the
// Stripe Elements iframe via its `fonts` option).

export const FONT_URL = 'https://fonts.googleapis.com/css2?family=Tilt+Neon&display=swap'
export const FONT_FAMILY = 'Tilt Neon, sans-serif'

export function loadFont() {
  if (typeof document === 'undefined') return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = FONT_URL
  document.head.appendChild(link)
}
