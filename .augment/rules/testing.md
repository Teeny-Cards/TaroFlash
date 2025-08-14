---
type: 'always_apply'
---

- Use the command: `pnpm test` to run the test suite.
- For all tests, use `vitest` as the test runner.
- For all tests, use `@vue/test-utils` as the testing library.
- Avoid making changes to production code just to make tests work, unless there is an obivious error or bug in the code.
- Use factory builders at `/tests/mocks` for repetitive data.
- Always aim for 100% file coverage

- Avoid long inline objects in multiple tests — extract shared test data or create/update builders as needed.
- Mock only what you must – avoid over-mocking; prefer real dependencies unless they slow tests or make them flaky.
- Use the smallest viable test scope
- Keep tests under 200ms where possible.
- Avoid network or file system calls unless explicitly testing them.
- Match the codebase’s testing style – Follow the existing test framework and conventions in naming, file placement, and helper usage.
- Test behavior, not implementation – Focus on what the code should do, not how it’s internally structured, so refactors don’t break tests unnecessarily.
- Make tests self-contained – A reader should understand what’s being tested without opening the implementation file.
- Fail loud, fail fast – Assertions should make it immediately clear why a test failed.
- Avoid magic values – Use descriptive constants or variables to make test data self-explanatory.
- Integration and E2E tests live in separate, clearly named folders.
- Use descriptive, plain-English phrases about behavior, not internal methods for test names:

```js
// Good
it("returns the correct total when discounts are applied", () => { ... })
// Bad
it("calls calculateTotal with discount param", () => { ... })
```
