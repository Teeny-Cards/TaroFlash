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

If the data is specific to a single test file, colocate a new `fixtures.js` file next to the test file. Wrap the new fixtures file and test file in a subdirectory named for the component/composable/etc being tested.

If the data is general and can be used across multiple tests, add it to `tests/fixtures/[subject].js`.

# Running Tests

Use the command `vp test` to run the test suite. If you want to run a specific test file, you can pass the path to the file as an argument.

```bash
vp test [path/to/test/file]
```

For example:

```bash
vp test tests/integration/components/ui-kit/toggle.test.js
```
