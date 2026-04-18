// Shared Appearance config for the Stripe Payment Element — reused by the
// initial checkout flow and the add-credit-card modal so both share the same
// colors, typography, and control styles as the rest of the app.

import type { Appearance } from '@stripe/stripe-js'

export const STRIPE_APPEARANCE: Appearance = {
  theme: 'stripe',
  variables: {
    colorPrimary: '#6f9b80',
    colorBackground: '#f9f8f5',
    colorText: '#744e2a',
    colorDanger: '#dc2626',
    colorTextPlaceholder: '#b8b1a9',
    fontFamily: 'Tilt Neon, sans-serif',
    spacingUnit: '4px',
    borderRadius: '8px'
  },
  rules: {
    '.Input': {
      border: '1px solid #e7e0d5',
      boxShadow: 'none'
    },
    '.Input:focus': {
      border: '1px solid #6f9b80',
      boxShadow: '0 0 0 3px rgba(111, 155, 128, 0.25)'
    },
    '.Label': {
      color: '#744e2a',
      fontWeight: '500'
    },
    '.Tab': {
      border: '1px solid #e7e0d5',
      backgroundColor: '#f9f8f5'
    },
    '.Tab:hover': {
      backgroundColor: '#ede9df'
    },
    '.Tab--selected': {
      borderColor: '#6f9b80',
      backgroundColor: '#f3f1ea'
    }
  }
}

export const STRIPE_FONTS = [
  { cssSrc: 'https://fonts.googleapis.com/css2?family=Tilt+Neon&display=swap' }
]
