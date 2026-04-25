---
lastUpdated: 2026-04-25T19:03:21Z
paths:
  - 'src/**/*.{ts,vue}'
---

# Animation Sequencing

Prefer animation-completion hooks over wall-clock waits. Emit from the hook's `onComplete` so timing stays in sync if the animation changes.

```ts
await new Promise((resolve) => {
  gsap.to(el, { duration: 0.4, opacity: 0, onComplete: resolve })
})
```

If a duration is referenced in more than one place, extract it as a named constant rather than repeating the magic number.

# File Structure

All animation functions should be in `src/utils/animations/` and named after the element or effect they animate (`modal.ts`, `phone.ts`, `blur.ts`).
