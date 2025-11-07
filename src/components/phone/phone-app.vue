<script setup lang="ts">
import UiIcon from '@/components/ui-kit/icon.vue'

export type App = {
  name: string
  icon: string
  theme: AppTheme
  shape?: AppShape
  col_span?: number
  row_span?: number
  click_action?: () => void
}

export type AppTheme = 'blue' | 'purple' | 'orange' | 'green' | 'pink' | 'red' | 'brown'
export type AppShape = 'circle' | 'square' | 'wavy'

defineProps<{
  name: string
  icon: string
  theme: AppTheme
  shape?: AppShape
  col_span?: number
  row_span?: number
}>()
</script>

<template>
  <button
    data-testid="phone-app"
    class="w-16 h-16 cursor-pointer hover:scale-110 relative transition-transform duration-50 flex items-center
      justify-center text-white group"
    :class="`theme-${theme} shape-${shape ?? 'square'} col-span-${col_span ?? 1} row-span-${row_span ?? 1}`"
  >
    <ui-icon :src="icon" size="large" />
  </button>
</template>

<style>
.col-span-2 {
  width: 100%;
  grid-column: span 2;
}
.col-span-3 {
  width: 100%;
  grid-column: span 3;
}
.row-span-2 {
  height: 100%;
  grid-row: span 2;
}
.row-span-3 {
  height: 100%;
  grid-row: span 3;
}

.shape-square {
  border-radius: 22px;
}
.shape-circle {
  border-radius: 999px;
}
.shape-wavy {
  --s: 64px;

  width: var(--s);
  aspect-ratio: 1;
  --g: /calc(var(--s) * 0.261) calc(var(--s) * 0.261) radial-gradient(50% 50%, #000 99%, #0000 101%)
    no-repeat;
  mask:
    calc(50% + var(--s) * 0.332) calc(50% + var(--s) * 0.077) var(--g),
    calc(50% + var(--s) * 0.18) calc(50% + var(--s) * 0.289) var(--g),
    calc(50% + var(--s) * -0.077) calc(50% + var(--s) * 0.332) var(--g),
    calc(50% + var(--s) * -0.289) calc(50% + var(--s) * 0.18) var(--g),
    calc(50% + var(--s) * -0.332) calc(50% + var(--s) * -0.077) var(--g),
    calc(50% + var(--s) * -0.18) calc(50% + var(--s) * -0.289) var(--g),
    calc(50% + var(--s) * 0.077) calc(50% + var(--s) * -0.332) var(--g),
    calc(50% + var(--s) * 0.289) calc(50% + var(--s) * -0.18) var(--g),
    radial-gradient(calc(var(--s) * 0.433), #000 99%, #0000 101%) subtract,
    calc(50% + var(--s) * 0.44) calc(50% + var(--s) * 0.315) var(--g),
    calc(50% + var(--s) * 0.089) calc(50% + var(--s) * 0.534) var(--g),
    calc(50% + var(--s) * -0.315) calc(50% + var(--s) * 0.44) var(--g),
    calc(50% + var(--s) * -0.534) calc(50% + var(--s) * 0.089) var(--g),
    calc(50% + var(--s) * -0.44) calc(50% + var(--s) * -0.315) var(--g),
    calc(50% + var(--s) * -0.089) calc(50% + var(--s) * -0.534) var(--g),
    calc(50% + var(--s) * 0.315) calc(50% + var(--s) * -0.44) var(--g),
    calc(50% + var(--s) * 0.534) calc(50% + var(--s) * -0.089) var(--g);
}

.theme-blue {
  background-color: var(--color-blue-500);
  outline-color: var(--color-blue-500);
}
.theme-purple {
  background-color: var(--color-purple-400);
  outline-color: var(--color-purple-400);
}
.theme-orange {
  background-color: var(--color-orange-500);
  outline-color: var(--color-orange-500);
}
.theme-green {
  background-color: var(--color-green-400);
  outline-color: var(--color-green-400);
}
.theme-pink {
  background-color: var(--color-pink-400);
  outline-color: var(--color-pink-400);
}
.theme-red {
  background-color: var(--color-red-400);
  outline-color: var(--color-red-400);
}
.theme-brown {
  background-color: var(--color-brown-500);
  outline-color: var(--color-brown-500);
}
</style>
