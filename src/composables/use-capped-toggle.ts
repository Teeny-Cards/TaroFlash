import { computed, ref, watch, type WritableComputedRef } from 'vue'

type Capped = number | null | undefined

export type UseCappedToggleResult = {
  /** Numeric value bound to a spinbox; updates when the model is non-null. */
  spin_value: WritableComputedRef<number>
  /** True when the model is `null` ("all" / unlimited). */
  is_all: WritableComputedRef<boolean>
  /** Drive the spinbox: clamps and flips to `null` once it reaches `max`. */
  onSpin: (n: number) => void
}

/**
 * Pair a numeric model with an "all" toggle, where `null` means unlimited.
 * Hitting `max` on the spinbox flips to `null`; toggling "all" off restores
 * the last numeric value (or `default_value`).
 *
 * @example
 * const { spin_value, is_all, onSpin } = useCappedToggle(model, 200, 50, () => deck.card_count)
 */
export function useCappedToggle(
  model: WritableComputedRef<Capped>,
  max: number,
  default_value: number,
  on_all_prefill?: () => number | undefined
): UseCappedToggleResult {
  const local = ref<number>(model.value ?? default_value)

  watch(model, (v) => {
    if (v != null) local.value = v
  })

  const is_all = computed({
    get: () => model.value === null,
    set: (on: boolean) => {
      if (on) {
        const prefill = on_all_prefill?.()
        if (prefill != null) local.value = prefill
        model.value = null
      } else {
        model.value = local.value
      }
    }
  })

  const spin_value = computed({
    get: () => local.value,
    set: (n: number) => onSpin(n)
  })

  function onSpin(n: number) {
    local.value = n
    model.value = n >= max ? null : n
  }

  return { spin_value, is_all, onSpin }
}
