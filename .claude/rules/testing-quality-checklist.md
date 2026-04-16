---
lastUpdated: 2026-04-13T12:01:02-07:00
---

---
title: Test Quality Checklist
paths:
  - 'tests/**/*'
---

# Test Quality Checklist

**Check for potential flakiness:**

- Tests that depend on timing or animation without a concrete trigger
- Tests that assert on elements that may not be in the DOM yet (missing `await` before queries)
- Tests that share mutable state between `test()` blocks (missing resets in `beforeEach`/`afterEach`)
- Hard-coded values that could vary by environment or locale
- Tests that depend on dates or times — check for month/year boundaries that could cause failures
- Silent early returns (e.g. `if (!data) return`) that skip all assertions — the test passes vacuously

**Check for bad practices:**

- Asserting on implementation details (internal state, private methods) rather than observable behaviour
- Overly broad assertions (e.g., `expect(element).toBeDefined()` instead of asserting actual content)
- Duplicate tests that cover exactly the same code path
- Tests that never actually exercise the changed lines
- Assertions on external libraries or dependencies (e.g., third-party component internals)
- Finding elements by auto-generated stub tag names (`ui-icon-stub`) instead of `findComponent`

**Browser mode (integration tests):**

- Stubs using `template: '...'` strings instead of render functions (`h()`) — silently render nothing in Chromium
- GSAP mocks that don't call `onComplete` — causes `transition-group` JS hooks to hang
- Using `global.__something` — `global` is not defined in browser context
- Missing required props on mounted components — Vue warns in jsdom but may error in a real browser
