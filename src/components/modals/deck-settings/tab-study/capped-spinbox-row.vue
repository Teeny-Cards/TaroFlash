<script setup lang="ts">
import { computed } from 'vue'
import UiSpinbox from '@/components/ui-kit/spinbox.vue'
import UiToggle from '@/components/ui-kit/toggle.vue'
import { useCappedToggle } from '@/composables/use-capped-toggle'

type CappedSpinboxRowProps = {
  label: string
  all_label: string
  min: number
  max: number
  step: number
  default_value: number
  prefill_when_all?: number
}

const { max, default_value, prefill_when_all } = defineProps<CappedSpinboxRowProps>()

const model = defineModel<number | null | undefined>('value')

const writable = computed({
  get: () => model.value,
  set: (v: number | null | undefined) => (model.value = v)
})

const { spin_value, is_all, onSpin } = useCappedToggle(
  writable,
  max,
  default_value,
  () => prefill_when_all
)
</script>

<template>
  <div data-testid="capped-spinbox-row" class="flex flex-col gap-2">
    <span
      data-testid="capped-spinbox-row__label"
      class="text-sm font-medium text-(--theme-on-neutral)"
    >
      {{ label }}
    </span>
    <div data-testid="capped-spinbox-row__row" class="flex items-center gap-4">
      <ui-spinbox
        data-testid="capped-spinbox-row__spinbox"
        :value="spin_value"
        :min="min"
        :max="max"
        :step="step"
        wrap
        @update:value="onSpin"
      />
      <ui-toggle data-testid="capped-spinbox-row__all-toggle" v-model:checked="is_all">
        {{ all_label }}
      </ui-toggle>
    </div>
  </div>
</template>
