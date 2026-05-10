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
  wrap?: boolean
}

const {
  min = -Infinity,
  max = Infinity,
  step = 1,
  size = 'base',
  label,
  suffix,
  wrap = false
} = defineProps<SpinboxProps>()

const value = defineModel<number>('value', { required: true })

const can_decrement = computed(() => value.value > min || (wrap && Number.isFinite(max)))
const can_increment = computed(() => value.value < max || (wrap && Number.isFinite(min)))

const size_classes = computed(() => {
  const map: Record<SpinboxSize, { row: string; btn: string; icon: string; val: string }> = {
    sm: {
      row: 'rounded-3_5 p-0.5 gap-0.5',
      btn: 'h-6 rounded-2_5',
      icon: 'w-4 h-4',
      val: 'text-base px-1.5 w-10'
    },
    base: {
      row: 'rounded-4 p-1 gap-0.5',
      btn: 'h-8 rounded-3',
      icon: 'w-5 h-5',
      val: 'text-base px-2 w-12'
    },
    lg: {
      row: 'rounded-5_5 p-1.5 gap-1',
      btn: 'h-10 rounded-4',
      icon: 'w-6 h-6',
      val: 'text-base px-3 w-14'
    }
  }
  return map[size]
})

function clamp(n: number) {
  return Math.min(max, Math.max(min, n))
}

function decrement() {
  if (value.value <= min) {
    if (wrap && Number.isFinite(max)) value.value = max
    return
  }
  value.value = clamp(value.value - step)
}

function increment() {
  if (value.value >= max) {
    if (wrap && Number.isFinite(min)) value.value = min
    return
  }
  value.value = clamp(value.value + step)
}

function onInput(e: Event) {
  const raw = (e.target as HTMLInputElement).value
  if (raw === '') return
  const n = Number(raw)
  if (!Number.isFinite(n)) return
  value.value = clamp(n)
}

function onBeforeInput(e: InputEvent) {
  if (e.data == null) return
  const allow_minus = min < 0
  for (const ch of e.data) {
    if (ch >= '0' && ch <= '9') continue
    if (ch === '-' && allow_minus) continue
    e.preventDefault()
    return
  }
}

function onFocus(e: FocusEvent) {
  ;(e.target as HTMLInputElement).select()
}

function onBlur(e: Event) {
  const el = e.target as HTMLInputElement
  const n = Number(el.value)
  if (!Number.isFinite(n) || el.value === '') {
    el.value = String(value.value)
    return
  }
  const clamped = clamp(n)
  value.value = clamped
  el.value = String(clamped)
}
</script>

<template>
  <div data-testid="ui-kit-spinbox-container" class="flex flex-col gap-1.5 w-max">
    <label
      v-if="label"
      data-testid="ui-kit-spinbox__label"
      class="text-brown-700 dark:text-brown-100"
    >
      {{ label }}
    </label>
    <div
      data-testid="ui-kit-spinbox"
      class="inline-flex items-center bg-brown-100 dark:bg-grey-700"
      :class="size_classes.row"
    >
      <button
        type="button"
        data-testid="ui-kit-spinbox__decrement"
        class="inline-flex items-center justify-center aspect-square text-brown-700 dark:text-brown-100 cursor-pointer transition-[background-color,color,transform] duration-100 hover:bg-(--theme-primary) hover:text-(--theme-on-primary) active:scale-95 disabled:opacity-[0.35] disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-brown-700 dark:disabled:hover:text-brown-100"
        :class="size_classes.btn"
        :disabled="!can_decrement"
        v-sfx="{ hover: 'ui.click_07', click: 'ui.select' }"
        @click="decrement"
      >
        <ui-icon src="horizontal-rule" :class="size_classes.icon" />
      </button>

      <div data-testid="ui-kit-spinbox__value" class="inline-flex items-baseline justify-center">
        <input
          type="text"
          inputmode="numeric"
          data-testid="ui-kit-spinbox__input"
          class="text-center tabular-nums text-brown-700 dark:text-brown-100 bg-transparent outline-none"
          :class="size_classes.val"
          :value="value"
          :step="step"
          @beforeinput="onBeforeInput"
          @focus="onFocus"
          @input="onInput"
          @blur="onBlur"
        />
        <span
          v-if="suffix"
          data-testid="ui-kit-spinbox__suffix"
          class="ml-0.5 text-brown-500 dark:text-brown-300"
        >
          {{ suffix }}
        </span>
      </div>

      <button
        type="button"
        data-testid="ui-kit-spinbox__increment"
        class="inline-flex items-center justify-center aspect-square text-brown-700 dark:text-brown-100 cursor-pointer transition-[background-color,color,transform] duration-100 hover:bg-(--theme-primary) hover:text-(--theme-on-primary) active:scale-95 disabled:opacity-[0.35] disabled:hover:bg-transparent disabled:hover:text-brown-700 dark:disabled:hover:text-brown-100"
        :class="size_classes.btn"
        :disabled="!can_increment"
        v-sfx="{ hover: 'ui.click_07', click: 'ui.select' }"
        @click="increment"
      >
        <ui-icon src="add" :class="size_classes.icon" />
      </button>
    </div>
  </div>
</template>
