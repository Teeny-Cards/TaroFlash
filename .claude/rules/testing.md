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

## Browser mode constraints

Integration tests run in real Chromium via `@vitest/browser-playwright`. This surfaces real browser behaviour but introduces constraints that don't apply to jsdom:

### No runtime template compiler

Vite ships the runtime-only Vue build. `defineComponent({ template: '<div />' })` silently renders nothing. **Always use render functions for test stubs:**

```js
// Bad — template string requires runtime compiler
const Stub = { template: '<div data-testid="stub"><slot /></div>' }

// Good — render function works everywhere
const Stub = defineComponent({
  setup(_props, { slots }) {
    return () => h('div', { 'data-testid': 'stub' }, slots.default?.())
  }
})
```

For stubs that forward `$attrs`, use `useAttrs()` with `inheritAttrs: false`:

```js
const CardStub = defineComponent({
  inheritAttrs: false,
  setup(_props, { slots }) {
    const attrs = useAttrs()
    return () => h('div', attrs, slots.default?.())
  }
})
```

### GSAP mocks must call `onComplete`

Vue's `<transition-group :css="false">` JS hooks pass a `done` callback. The modal animations thread it through `gsap`'s `onComplete`. If the mock doesn't call it, the transition never finishes and child content stays hidden:

```js
// Bad — done() never fires, transition-group hangs
vi.mock('gsap', () => ({ gsap: { fromTo: vi.fn(), to: vi.fn() } }))

// Good — onComplete fires synchronously
vi.mock('gsap', () => ({
  gsap: {
    fromTo: vi.fn((_el, _from, to) => to?.onComplete?.()),
    to: vi.fn((_el, opts) => opts?.onComplete?.())
  }
}))
```

### Don't find elements by stub tag names

`shallowMount` generates tag names like `ui-icon-stub`. These are internal to `@vue/test-utils` and may change. Use `findComponent` instead:

```js
// Bad
wrapper.find('ui-icon-stub[src="check"]')

// Good
wrapper.findAllComponents({ name: 'UiIcon' }).some(c => c.props('src') === 'check')
```

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
