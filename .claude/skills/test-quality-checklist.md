**Check for potential flakiness:**

- Tests that depend on timing or animation without a concrete trigger
- Tests that assert on elements that may not be in the DOM yet (missing `await` before queries)
- Tests that share mutable state between `test()` blocks (missing resets in `beforeEach`/`afterEach`)
- Hard-coded values that could vary by environment or locale
- Tests that depend on dates or times — check for month/year boundaries that could cause failures

**Check for bad practices:**

- Asserting on implementation details (internal state, private methods) rather than observable behaviour
- Overly broad assertions (e.g., `expect(element).toBeDefined()` instead of asserting actual content)
- Duplicate tests that cover exactly the same code path
- Tests that never actually exercise the changed lines
- Assertions on external libraries or dependencies (e.g., third-party component internals)
