---
paths:
  - 'tests/**/*'
---

# Writing Tests

Use **vue-testing-best-practices@vue-skills** to guide you in writing the tests.

Choose the **lowest-cost test type** that can meaningfully cover the file. Use the following priority order:

| Priority | Type            | When to use                                                                                                 |
| -------- | --------------- | ----------------------------------------------------------------------------------------------------------- |
| 1        | **Unit**        | Pure functions, utilities, composables with no rendering, store logic that can be called directly           |
| 2        | **Integration** | Vue components — anything that renders HTML or interacts with stores/composables via `shallowMount`/`mount` |

Default to integration tests for components. Use `shallowMount` for isolated component tests (stub child components) and `mount` only when child component behaviour is directly under test.

If possible attempt to reach 100% coverage, but if that is not possible, aim for at least 85% coverage.

Integration tests should be added under `tests/integration` and unit tests should be added under `tests/unit`.

Always attempt to use factory builders for mocking test data using `mimicry-js` and `faker-js` in a separate fixtures file.

## Composable singleton state

Some composables hold `ref`/`reactive` values at **module scope** (outside the function body). These persist across `useXxx()` calls and between tests — they need an explicit reset in `beforeEach` using the composable's own setters:

```js
beforeEach(() => {
  useTheme().setMode('system') // resets module-level mode ref via its own setter
})
```

If no setter exists and the ref is not exported, use `vi.resetModules()` to fully re-import the module fresh — but prefer the setter approach when available since it's faster and doesn't break mock registrations.

## Mocking composable dependencies

Prefer mocking a composable dependency via `vi.mock('@/composables/...')` over mocking browser APIs directly (e.g. `window.matchMedia`). Module mocks are more isolated and avoid cache/side-effect state leaking between tests.

Use `vi.mocked(...).mockReturnValue(...)` in `beforeEach` to reset the mock's return value for each test, then override in individual tests that need a different value.

- If the data is specific to a single test file, colocate a new `fixtures.js` file next to the test file. Wrap the new fixtures file and test file in a subdirectory named for the component/composable/etc being tested.
- If the data is general and can be used across multiple tests, add it to `tests/fixtures/[subject].js`.

If the source file has logic that appears wrong or you are unsure if it is correct, ask the user for confirmation before writing the test:

- If the user confirms that the logic is correct, write the test. Clarify in comments of tests for future reference in case of confusion.
- If the user confirms that the logic is incorrect, wait for the user to fix the logic before writing the test. potentially offer a suggestion on how to fix the logic.
- Provide the user with two options:
  1. The user can fix the logic themselves and then confirm.
  2. The user can ask for help to fix the logic.
- Call out in the summary

# Running Tests

Use the command `vp test` to run the test suite. If you want to run a specific test file, you can pass the path to the file as an argument.

```bash
vp test [path/to/test/file]
```

For example:

```bash
vp test tests/integration/components/ui-kit/toggle.test.js
```
