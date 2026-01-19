<script setup lang="ts">
import UiImage from '@/components/ui-kit/image.vue'
import UiTooltip from '@/components/ui-kit/tooltip.vue'
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
    class="phone-app rounded-5.5 w-15 h-15 cursor-pointer hover:scale-110 focus:scale-110
      transition-transform duration-50 flex items-center justify-center text-white group
      outline-none bg-(--app-theme) dark:bg-(--app-theme-dark) hover:bgx-diagonal-stripes
      animation-safe:hover:bgx-slide focus:bgx-diagonal-stripes"
    :class="`theme-${app.launcher.theme}`"
  >
    <ui-image
      :src="app.launcher.icon_src"
      class="pointer-events-none"
      :class="{ 'group-hover:hidden group-focus:hidden': app.launcher.hover_icon_src }"
    />
    <ui-image
      v-if="app.launcher.hover_icon_src"
      :src="app.launcher.hover_icon_src"
      class="hidden group-hover:block group-focus:block pointer-events-none"
    />
  </ui-tooltip>
</template>

<style>
.theme-blue {
  --app-theme: var(--color-blue-500);
  --app-theme-dark: var(--color-blue-400);
}
.theme-purple {
  --app-theme: var(--color-purple-500);
  --app-theme-dark: var(--color-purple-500);
}
.theme-orange {
  --app-theme: var(--color-orange-500);
  --app-theme-dark: var(--color-orange-500);
}
.theme-green {
  --app-theme: var(--color-green-400);
  --app-theme-dark: var(--color-green-500);
}
.theme-pink {
  --app-theme: var(--color-pink-400);
  --app-theme-dark: var(--color-pink-500);
}
.theme-red {
  --app-theme: var(--color-red-400);
  --app-theme-dark: var(--color-red-500);
}
.theme-brown {
  --app-theme: var(--color-brown-100);
  --app-theme-dark: var(--color-brown-800);
}
</style>
