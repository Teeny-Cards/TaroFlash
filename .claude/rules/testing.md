---
lastUpdated: 2026-04-25T00:00:00-07:00
paths:
  - 'tests/**/*'
  - 'vite.config.ts'
---

# Writing tests

## Failing test? Verify the source first

A failing test is a signal — assume the code regressed before assuming the test is wrong. Read the assertion and the code under test, run the test in isolation, confirm whether the failure is meaningful.

If there's any chance the test is catching a real bug, **stop**. Name the test, the assertion, and the suspected bug, and wait for confirmation. Only edit the test once the source is verified correct or the user confirms.

## Test type selection

| Type                      | Env                   | Use for                                                                                                                                                                                                       |
| ------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Unit**                  | jsdom (Node)          | Pure functions, utilities, non-rendering composables, store logic                                                                                                                                             |
| **Integration**           | Chromium (browser)    | Vue components — anything that renders HTML or uses real browser APIs                                                                                                                                         |
| **Contract**              | Node + local Supabase | `src/api/<domain>/db/*` — anything that talks to PostgREST / GoTrue / Storage. Catches schema-cache drift, broken FK embeds, RLS regressions. Files live under `tests/contract/api/`. Needs `supabase start`. |
| **Deno (edge functions)** | Deno                  | `supabase/functions/<name>/` — colocated `index.test.ts`. Inject a fake supabase via `_shared/test-utils.ts`; never hit real network. Run via `deno test` from `supabase/functions/`.                         |

- Files mirror source: `src/components/foo/bar.vue` → `tests/integration/components/foo/bar.test.js`; `src/api/decks/db/*` → `tests/contract/api/decks.test.js`
- Default to jsdom unless rendering or real-browser APIs (matchMedia, layout, focus, clipboard, transitions) are needed
- Prefer `shallowMount` over `mount` unless a child's behaviour is under test
- Coverage target 100 %, minimum 85 %

Run: `vp test`, `vp test --project Unit|Integration|Contract`, `vp test <file>`, or `deno test` (from `supabase/functions/`) for edge functions.

## Async updates

- `await trigger()` / `await setValue()` — return `nextTick` internally
- `await nextTick()` after programmatic state mutations (`wrapper.vm.x = 1`)
- `await flushPromises()` after API calls or timer ticks; chain twice for chained async
- Don't stack `nextTick` to wait on promises — use `flushPromises`

## Blackbox approach

- Drive components via user interactions; assert on rendered output and emitted events
- Don't read `wrapper.vm.*` or call internal methods
- Query only by `data-testid` — never tag, class, or generated stub names (`ui-icon-stub`)
- Don't assert Tailwind utility classes; semantic/BEM names OK when they are the most direct state signal
- Find child components with `findAllComponents(ImportedRef)` (or `{ name }` if `defineOptions({ name })` is set)
- Don't assert audio names — assert audio was played

## Browser mode constraints

Vite ships runtime-only Vue. Stubs need render functions:

```js
// Bad — template string silently renders nothing in Chromium
const Stub = { template: '<div data-testid="stub"><slot /></div>' }

// Good
const Stub = defineComponent({
  setup(_p, { slots }) {
    return () => h('div', { 'data-testid': 'stub' }, slots.default?.())
  }
})
```

Forward `$attrs` with `useAttrs()` + `inheritAttrs: false`. Stubs hide slot content unless you explicitly render `slots.default?.()`.

GSAP mocks must call `onComplete` — `<transition-group :css="false">` threads `done` through it; if it never fires, transitions hang and content stays hidden:

```js
vi.mock('gsap', () => ({
  gsap: {
    fromTo: vi.fn((_el, _from, to) => to?.onComplete?.()),
    to: vi.fn((_el, opts) => opts?.onComplete?.())
  }
}))
```

`global` is undefined in browser context — don't reach for `global.__matchMedia` in `setup-browser.js`.

Teleport works natively in browser mode. In jsdom unit tests, either stub with `{ Teleport: true }` to keep content in the wrapper tree, or pass `attachTo: document.body` and query via `document.querySelector`.

## Fixtures

`mimicry-js` + `faker-js` builders in `fixtures.js`.

- Single-file scope → colocate: `tests/unit/stores/theme/fixtures.js`
- Shared → `tests/fixtures/<subject>.js`

## Composable singletons

Module-scope `ref`/`reactive` persists across tests. Reset in `beforeEach` via the composable's setter; fall back to `vi.resetModules()` if none exists:

```js
beforeEach(() => useToast().clear())
```

For Pinia, see [testing-pinia.md](./testing-pinia.md).

## Mocking

Prefer `vi.mock('@/composables/...')` over mocking browser APIs directly — module mocks isolate cleanly. Reset return values in `beforeEach`, override per-test.

If source logic looks wrong, ask before writing. Once confirmed correct, leave a comment explaining the non-obvious behaviour. Otherwise rely on the test name.

## Flakiness audit

Reject tests that:

- Wait on timers/animations without a concrete trigger
- Skip `await` before async-rendered queries
- Share mutable state across tests (missing `beforeEach`/`afterEach` reset)
- Hard-code locale or date values that drift across environments or month/year boundaries
- Have silent early returns (`if (!data) return`) that pass vacuously
- Use overly broad assertions (`toBeDefined()` where the value matters)
- Don't actually exercise the changed lines
