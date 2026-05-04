<script setup lang="ts">
import { computed } from 'vue'
import UiIcon from '@/components/ui-kit/icon.vue'

type SpinboxSize = 'sm' | 'base' | 'lg'

type SpinboxProps = {
  min?: number
  max?: number
  step?: number
  size?: SpinboxSize
  label?: string
  suffix?: string
}

const {
  min = -Infinity,
  max = Infinity,
  step = 1,
  size = 'base',
  label,
  suffix
} = defineProps<SpinboxProps>()

const value = defineModel<number>('value', { required: true })

const can_decrement = computed(() => value.value > min)
const can_increment = computed(() => value.value < max)

const size_classes = computed(() => {
  const map: Record<SpinboxSize, { row: string; btn: string; icon: string; val: string }> = {
    sm: {
      row: 'rounded-3_5 p-0.5 gap-0.5',
      btn: 'h-6 rounded-2_5',
      icon: 'w-4 h-4',
      val: 'text-sm px-1.5'
    },
    base: {
      row: 'rounded-4 p-1 gap-0.5',
      btn: 'h-8 rounded-3',
      icon: 'w-5 h-5',
      val: 'text-base px-2'
    },
    lg: {
      row: 'rounded-5_5 p-1.5 gap-1',
      btn: 'h-10 rounded-4',
      icon: 'w-6 h-6',
      val: 'text-lg px-3'
    }
  }
  return map[size]
})

function clamp(n: number) {
  return Math.min(max, Math.max(min, n))
}

function decrement() {
  if (!can_decrement.value) return
  value.value = clamp(value.value - step)
}

function increment() {
  if (!can_increment.value) return
  value.value = clamp(value.value + step)
}
</script>

<template>
  <label data-testid="ui-kit-spinbox-container" class="flex flex-col gap-1.5 w-max">
    <span v-if="label" data-testid="ui-kit-spinbox__label" class="text-brown-700">
      {{ label }}
    </span>
    <div
      data-testid="ui-kit-spinbox"
      class="inline-flex items-center bg-brown-100"
      :class="size_classes.row"
    >
      <button
        type="button"
        data-testid="ui-kit-spinbox__decrement"
        class="inline-flex items-center justify-center aspect-square text-brown-700 cursor-pointer transition-[background-color,color,transform] duration-100 hover:bg-(--theme-primary) hover:text-(--theme-on-primary) active:scale-95 disabled:opacity-[0.35] disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-brown-700"
        :class="size_classes.btn"
        :disabled="!can_decrement"
        v-sfx="{ hover: 'ui.click_07', click: 'ui.select' }"
        @click="decrement"
      >
        <ui-icon src="horizontal-rule" :class="size_classes.icon" />
      </button>

      <div
        data-testid="ui-kit-spinbox__value"
        class="min-w-[3ch] text-center tabular-nums text-brown-700 select-none"
        :class="size_classes.val"
      >
        {{ value }}<span v-if="suffix" class="ml-0.5 text-brown-500">{{ suffix }}</span>
      </div>

      <button
        type="button"
        data-testid="ui-kit-spinbox__increment"
        class="inline-flex items-center justify-center aspect-square text-brown-700 cursor-pointer transition-[background-color,color,transform] duration-100 hover:bg-(--theme-primary) hover:text-(--theme-on-primary) active:scale-95 disabled:opacity-[0.35] disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-brown-700"
        :class="size_classes.btn"
        :disabled="!can_increment"
        v-sfx="{ hover: 'ui.click_07', click: 'ui.select' }"
        @click="increment"
      >
        <ui-icon src="add" :class="size_classes.icon" />
      </button>
    </div>
  </label>
</template>
