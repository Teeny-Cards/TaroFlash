<script setup lang="ts">
import UiImage from '@/components/ui-kit/image.vue'
import UiTooltip from '@/components/ui-kit/tooltip.vue'
import { emitHoverSfx } from '@/sfx/bus'
import { type PhoneApp } from '@/phone/system/types'

defineProps<{ app: PhoneApp }>()
</script>

<template>
  <ui-tooltip
    :text="app.title"
    position="bottom"
    :gap="-5"
    element="button"
    data-testid="phone-app"
    class="rounded-5.5 w-15 h-15 cursor-pointer hover:scale-110 focus:scale-110 transition-transform
      duration-50 flex items-center justify-center text-white group animation-safe:animate-bg-slide
      outline-none"
    :class="`theme-${app.launcher.theme}`"
    @mouseenter="emitHoverSfx('ui.pop_drip_mid')"
  >
    <ui-image
      :src="app.launcher.icon_src"
      :class="{ 'group-hover:hidden group-focus:hidden': app.launcher.hover_icon_src }"
    />
    <ui-image
      v-if="app.launcher.hover_icon_src"
      :src="app.launcher.hover_icon_src"
      class="hidden group-hover:block group-focus:block"
    />
  </ui-tooltip>
</template>

<style>
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
