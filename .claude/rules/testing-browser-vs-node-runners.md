---
lastUpdated: 2026-04-13T21:03:32-07:00
---

---

title: Browser Mode vs jsdom
paths:

- 'tests/\*_/_'
- 'vite.config.ts'

---

# Browser Mode vs jsdom

Integration tests run in real Chromium via Vitest browser mode (`@vitest/browser-playwright`). Unit tests run in jsdom. The split is configured as two Vitest projects in `vite.config.ts`.

## Project configuration

```
tests/
├── setup.js              # Unit setup — i18n + matchMedia mock
├── setup-browser.js      # Integration setup — i18n only (real browser has matchMedia)
├── unit/                 # jsdom (Node)
└── integration/          # Chromium (browser)
```

The Integration project needs `optimizeDeps.exclude: ['vite-plus/test']` so that the test API module isn't pre-bundled by Vite — without this, vitest's browser runner can't intercept it and `describe`/`test` fail at collection time.

## When to use which

| jsdom (unit)                  | Chromium (integration)                  |
| ----------------------------- | --------------------------------------- |
| Pure functions, utilities     | Vue components that render HTML         |
| Composables with no rendering | Components using real browser APIs      |
| Pinia store logic             | Layout, focus, clipboard, media queries |
| Fast — no browser startup     | Slower — real browser overhead          |

**Default to jsdom** for anything that doesn't render. **Default to Chromium** for anything that does.

## What browser mode gives you

- Real `matchMedia`, `getBoundingClientRect`, `getComputedStyle`
- Real CSS rendering (transitions, computed styles, media queries)
- Real event propagation (pointer events, focus/blur, transitionend)
- No need to mock `window.matchMedia`, `ResizeObserver`, etc.

## What browser mode costs

- ~15-20s startup for the Chromium process
- No runtime template compiler — test stubs must use render functions (see `testing.md`)
- GSAP mocks must call `onComplete` for transition-group JS hooks to complete
- `global` is not defined — browser setup files cannot use `global.__matchMedia` or similar Node globals

## Running tests

```bash
vp test                                           # full suite (both projects)
vp test --project Unit                            # unit tests only
vp test --project Integration                     # integration tests only
vp test tests/integration/components/deck.test.js # single file
```
