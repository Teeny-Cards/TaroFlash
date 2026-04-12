<script setup lang="ts">
import { computed } from 'vue'
import { bgxClasses, type BgxConfig } from '@/utils/bgx'
import UiButton from '@/components/ui-kit/button.vue'

type MobileSheetProps = {
  theme?: MemberTheme
  bgx?: BgxConfig
  title?: string
}

const { theme = 'green-400', bgx } = defineProps<MobileSheetProps>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const headerBgxClass = computed(() => bgxClasses(bgx))
</script>

<template>
  <div
    data-testid="mobile-sheet"
    :data-theme="theme"
    class="bg-brown-300 shadow-lg flex flex-col gap-8 overflow-hidden rounded-t-8 sm:rounded-b-8 w-full sm:w-120 shrink-0 max-sm:mt-auto"
  >
    <slot name="header">
      <div
        data-testid="mobile-sheet__header"
        class="w-full grid grid-cols-[40px_1fr_40px] grid-rows-[auto_auto] items-center place-items-center p-5 pb-20 gap-6 wave-bottom-[50px] bg-(--theme-primary) text-(--theme-on-primary)"
        :class="headerBgxClass"
      >
        <slot name="header-content">
          <slot name="header-left">
            <ui-button icon-left="close" icon-only :theme="theme" inverted @click="emit('close')" />
          </slot>

          <h1 class="text-5xl text-white">{{ title }}</h1>
        </slot>
        <div class="row-start-2 col-span-3">
          <slot name="after-header"> </slot>
        </div>
      </div>
    </slot>

    <div data-testid="mobile-sheet__body" class="h-full px-4">
      <slot name="body"></slot>
    </div>

    <div data-testid="mobile-sheet__footer" class="shrink-0 px-4 pb-4">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
