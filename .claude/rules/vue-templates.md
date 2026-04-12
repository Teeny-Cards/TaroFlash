# Vue Template Conventions

## data-testid attributes

Add `data-testid` to every meaningful structural element in new component markup. Use `component-name__section` naming (e.g. `mobile-sheet__body`, `deck-settings__actions`).

```html
<div data-testid="deck-card">
  <header data-testid="deck-card__header">...</header>
  <div data-testid="deck-card__body">...</div>
  <footer data-testid="deck-card__footer">...</footer>
</div>
```

Purely decorative or `aria-hidden` elements (spacers, etc.) don't need one. Every `div`, `section`, `header`, `footer`, `nav`, and `aside` that represents a distinct part of the component does.

**Why:** Tests assert on `data-*` attributes, never class names. These attributes also serve as a scannable map of a component's structure.

## No HTML comments in templates

Do not add comments inside `<template>` markup. If a block needs explanation, improve its naming instead — better `data-testid` values, slot names, or component names make structure self-documenting.

```html
<!-- Bad -->
<!-- wrapper needed for transition group -->
<div>...</div>

<!-- OK: a genuine browser-compat or non-obvious workaround -->
<!-- empty text node prevents Safari focus bug -->
<span></span>
```

Script-block comments (`// ...`) are fine.
