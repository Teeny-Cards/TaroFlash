---
lastUpdated: 2026-05-06T00:00:00Z
paths:
  - 'src/**/*.vue'
---

# CSS in Vue files

**Default to Tailwind utility classes in the template.** Don't open a `<style>` block unless one of these conditions clearly applies:

- **Extremely large class blocks** — the inline list is so long it hurts readability and structure.
- **Duplicated classes across multiple elements** — the same set repeats on siblings or across the file.
- **Complex state management** — selectors like `:hover`/`:focus`/`:disabled` chains, sibling/descendant selectors, pseudo-elements, or animations that don't map cleanly to utility variants.

When you do reach for a `<style>` block:

- Write plain CSS with `var(--theme-*)` / `var(--color-*)` tokens — never `@apply` (see `no-apply` rule).
- Keep the rule scoped to the component; don't leak global selectors.

If none of the conditions apply, keep it inline — even when the class list looks long, utilities beat a one-off style block.
