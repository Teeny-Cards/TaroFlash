---
lastUpdated: 2026-05-03T00:00:00Z
paths:
  - 'src/**/*.{ts,vue,css}'
---

# Safari Gotchas

WebKit quirks Chrome doesn't share. Chrome's mobile-mode uses Blink, so these won't surface there — only on real Safari.

## Don't bind `:class` reactively on a scrolling container

Vue's class patch calls `setAttribute('class', …)` on every re-render, even when the resulting string is identical. iOS Safari treats those writes during a touch gesture as scroll-disrupting mutations and kills momentum scroll inside the element.

```vue
<!-- Bad — reactive class on the element you scroll inside -->
<div class="overflow-y-auto" :class="modeConfig.containerClass(isMobile.value)">

<!-- Good — static class on Vue side, drive responsive layout via CSS keyed off
     a data attribute that's set once when the element mounts -->
<div class="overflow-y-auto" :data-mobile-below-width="threshold">
```

Then in CSS: `@media (...) { [data-mobile-below-width="md"] { … } }`. Browser handles activation; Vue does zero work on viewport changes.

Memoizing the class function to return the same string reference does **not** help — Vue still patches class on every re-render the moment any tracked dep (matchMedia, etc.) fires. The fix is to remove the reactive binding entirely from the scrolling element, not to make it cheaper.
