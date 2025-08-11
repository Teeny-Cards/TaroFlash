---
type: 'always_apply'
---

- Match the codebase’s testing style – Follow the existing test framework and conventions in naming, file placement, and helper usage.
- Prioritize clarity over cleverness – Readability is more important than brevity. Avoid overly dense test logic.
- Test behavior, not implementation – Focus on what the code should do, not how it’s internally structured, so refactors don’t break tests unnecessarily.
- Make tests self-contained – A reader should understand what’s being tested without opening the implementation file.
- Fail loud, fail fast – Assertions should make it immediately clear why a test failed.
- Avoid magic values – Use descriptive constants or variables to make test data self-explanatory.
- Integration and E2E tests live in separate, clearly named folders.
- Test blocks: Use descriptive, plain-English phrases about behavior, not internal methods.

```js
// Good
it("returns the correct total when discounts are applied", () => { ... })
// Bad
it("calls calculateTotal with discount param", () => { ... })
```

- Cover the “happy path” first, then add:

  - Edge cases (nulls, empty arrays, extreme numbers)
  - Error cases (invalid inputs, thrown errors)
  - Boundary conditions (limits, max values)

- Use the smallest viable test scope
- Mock only what you must – avoid over-mocking; prefer real dependencies unless they slow tests or make them flaky.
- Use factory functions or builders for repetitive data.
- Avoid long inline objects in multiple tests — extract shared test data.
- Prefer specific matchers over generic truthy checks (toEqual, toContain, toThrow over toBeTruthy)
- Keep tests under 200ms where possible.
- Avoid network or file system calls unless explicitly testing them.
