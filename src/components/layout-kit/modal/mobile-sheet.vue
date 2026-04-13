<script setup lang="ts">
import { computed } from 'vue'
import { bgxClasses, type BgxConfig } from '@/utils/bgx'
import UiButton from '@/components/ui-kit/button.vue'

type MobileSheetProps = {
  theme?: MemberTheme
  bgx?: BgxConfig
  title?: string
}

const { theme = 'green-400', bgx, title } = defineProps<MobileSheetProps>()

const slots = defineSlots<{
  header(): any
  'header-content'(): any
  'header-left'(): any
  'after-header'(): any
  body(): any
  footer(): any
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const headerBgxClass = computed(() => bgxClasses(bgx))

const showHeader = computed(() => {
  return slots.header || slots['header-content'] || slots['header-left'] || title
})
</script>

<template>
  <div
    data-testid="mobile-sheet"
    :data-theme="theme"
    class="flex flex-col gap-8 overflow-hidden w-full sm:w-120 shrink-0 max-sm:mt-auto"
  >
    <slot v-if="showHeader" name="header">
      <div
        data-testid="mobile-sheet__header"
        class="w-full flex justify-center items-center place-items-center px-13 pt-11.5 pb-14 gap-6 wave-bottom-[50px] bg-(--theme-primary) text-(--theme-on-primary) relative"
        :class="headerBgxClass"
      >
        <slot name="header-left">
          <div class="absolute top-0 left-0 p-4">
            <ui-button icon-left="close" icon-only :theme="theme" inverted @click="emit('close')" />
          </div>
        </slot>

        <slot name="header-content">
          <h1 class="text-5xl text-white">{{ title }}</h1>
        </slot>
      </div>
    </slot>

    <div data-testid="mobile-sheet__body" class="h-full">
      <slot name="body"></slot>
    </div>

    <div data-testid="mobile-sheet__footer" class="shrink-0">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
