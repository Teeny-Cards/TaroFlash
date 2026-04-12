# Animation Sequencing

Never use `setTimeout(resolve, N)` to wait for an animation to finish. Instead, emit an event from the animation's completion callback and resolve the promise from that handler.

```ts
// Bad
await new Promise(resolve => setTimeout(resolve, 400))

// Good
await new Promise(resolve => {
  gsap.to(el, { duration: 0.4, opacity: 0, onComplete: resolve })
})

// Or with a Vue emit
gsap.to(el, {
  duration: 0.4,
  onComplete: () => emit('animation-complete')
})
```

If a duration must be referenced in more than one place, extract it as a named constant rather than repeating the magic number.

**Why:** Hardcoded durations drift out of sync when animations change. Event-driven callbacks are inherently correct regardless of timing.
