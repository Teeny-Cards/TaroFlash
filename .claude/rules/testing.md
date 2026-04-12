---
paths:
  - 'tests/**/*'
---

# Writing Tests

## Test type selection

| Priority | Type            | Environment        | When to use                                                           |
| -------- | --------------- | ------------------ | --------------------------------------------------------------------- |
| 1        | **Unit**        | jsdom (Node)       | Pure functions, utilities, composables with no rendering, store logic |
| 2        | **Integration** | Chromium (browser) | Vue components — anything that renders HTML                           |

- Unit tests → `tests/unit/`, integration tests → `tests/integration/`
- Target **100% coverage**; minimum **85%**
- For components, prefer `shallowMount` (stubs children) over `mount` unless child behaviour is directly under test

**Use browser mode (integration) when** the component depends on real browser APIs (layout, focus, clipboard, media queries) or jsdom would require so many mocks the test stops reflecting real behaviour. Otherwise prefer jsdom — browser tests are slower.

## Fixtures and test data

Use `mimicry-js` + `faker-js` factory builders for test data, in a separate `fixtures.js` file.

- **Single test file** → colocate `fixtures.js` in a subdirectory named after the subject (e.g. `tests/unit/use-theme/fixtures.js`)
- **Shared across tests** → add to `tests/fixtures/[subject].js`

## Composable singleton state

Some composables hold `ref`/`reactive` at **module scope** — these persist between tests. Reset in `beforeEach` via the composable's own setter:

```js
beforeEach(() => {
  useTheme().setMode('system') // resets module-level ref
})
```

If no setter exists, fall back to `vi.resetModules()`.

# Running Tests

```bash
vp test                                        # full suite
vp test tests/unit/use-theme.test.js           # single file
```

# Guidelines

- Prefer `vi.mock('@/composables/...')` over mocking browser APIs directly — module mocks are more isolated and avoid cache leaking between tests. Reset return values in `beforeEach` with `vi.mocked(...).mockReturnValue(...)`, then override per-test as needed.
- If source logic looks wrong, ask the user before writing the test. Once confirmed correct, add a comment explaining the non-obvious behaviour. If confirmed wrong, wait for the fix before writing.
- Only leave comments for assertions that are not immediately obvious. Otherwise test names should be descriptive enough.
- Don't find elements by class names, tag names, etc. always use a `data-testid` attribute. If one does not exist, add one.
- Never use class names to find elements in the DOM — always use `data-testid`.
- Never assert against Tailwind utility classes — they are implementation details that change freely. If a semantic/BEM class name is the most direct signal of component state, asserting it is acceptable.
- Don't assert audio names, only that audio was played.
- Tests should math the file structure of the source files. For example, if the source file is in `src/components/foo/bar.vue`, the test file should be in `tests/integration/components/foo/bar.test.js`.
