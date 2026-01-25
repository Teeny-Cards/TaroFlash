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
    :data-theme="app.launcher.theme"
    :gap="-5"
    element="button"
    data-testid="phone-app"
    class="phone-app rounded-5.5 w-15 h-15 cursor-pointer hover:scale-110 focus:scale-110
      transition-transform duration-50 flex items-center justify-center text-white group
      outline-none bg-(--theme-primary) hover:bgx-diagonal-stripes animation-safe:hover:bgx-slide
      focus:bgx-diagonal-stripes"
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
