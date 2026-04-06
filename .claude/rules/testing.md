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

## Mocking

Prefer `vi.mock('@/composables/...')` over mocking browser APIs directly — module mocks are more isolated and avoid cache leaking between tests. Reset return values in `beforeEach` with `vi.mocked(...).mockReturnValue(...)`, then override per-test as needed.

## Suspect source logic

If source logic looks wrong, ask the user before writing the test. Once confirmed correct, add a comment explaining the non-obvious behaviour. If confirmed wrong, wait for the fix before writing.

# Running Tests

```bash
vp test                                        # full suite
vp test tests/unit/use-theme.test.js           # single file
```
