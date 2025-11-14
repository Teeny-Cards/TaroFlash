<script setup lang="ts">
import UiImage from '@/components/ui-kit/image.vue'
import { useAudio } from '@/composables/audio'
import UiTooltip from '@/components/ui-kit/tooltip.vue'

export type App = {
  name: string
  icon: string
  hover_icon?: string
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
  hover_icon?: string
  theme: AppTheme
  shape?: AppShape
  col_span?: number
  row_span?: number
  click_action?: () => void
}>()

const audio = useAudio()
</script>

<template>
  <ui-tooltip
    :text="name"
    position="bottom"
    :gap="-5"
    element="button"
    data-testid="phone-app"
    class="phone-app w-15 h-15 cursor-pointer hover:scale-110 focus:scale-110 transition-transform duration-50
      flex items-center justify-center text-white group animation-safe:animate-bg-slide outline-none"
    :class="`theme-${theme} shape-${shape ?? 'square'} col-span-${col_span ?? 1} row-span-${row_span ?? 1}`"
    @mouseenter="audio.play('pop_drip_mid')"
    @click="click_action?.()"
  >
    <ui-image :src="icon" :class="{ 'group-hover:hidden group-focus:hidden': hover_icon }" />
    <ui-image
      v-if="hover_icon"
      :src="hover_icon"
      class="hidden group-hover:block group-focus:block"
    />
  </ui-tooltip>
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
}
.theme-purple {
  background-color: var(--color-purple-500);
}
.theme-orange {
  background-color: var(--color-orange-500);
}
.theme-green {
  background-color: var(--color-green-400);
}
.theme-pink {
  background-color: var(--color-pink-400);
}
.theme-red {
  background-color: var(--color-red-400);
}
.theme-brown {
  background-color: var(--color-brown-100);
}

.phone-app:hover,
.phone-app:focus {
  background-image: var(--diagonal-stripes);
}
</style>
