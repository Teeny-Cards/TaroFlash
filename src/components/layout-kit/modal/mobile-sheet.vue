<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { coverBindings } from '@/utils/cover'
import { mobileSheetOverlayKey } from './mobile-sheet-overlay'
import UiButton from '@/components/ui-kit/button.vue'

export type MobileSheetProps = {
  cover_config?: DeckCover
  title?: string
  show_close_button?: boolean
}

const { cover_config, title, show_close_button = true } = defineProps<MobileSheetProps>()

const slots = defineSlots<{
  sidebar(): any
  overlay(): any
  header(): any
  'header-content'(): any
  default(): any
  footer(): any
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const header_bindings = computed(() =>
  coverBindings(
    {
      bg_color: cover_config?.bg_color,
      bg_image: cover_config?.bg_image,
      pattern: cover_config?.pattern,
      pattern_size: 60
    },
    { border: false }
  )
)

const showHeader = computed(() => {
  return slots.header || slots['header-content'] || title
})

const overlay_root = ref<HTMLElement>()
provide(mobileSheetOverlayKey, overlay_root)
</script>

<template>
  <div data-testid="mobile-sheet-root" class="relative w-full shrink-0 mobile-modal:mt-auto">
    <div
      ref="overlay_root"
      data-testid="mobile-sheet__overlay"
      class="absolute inset-0 pointer-events-none z-10"
    >
      <slot name="overlay"></slot>
    </div>

    <div
      data-testid="mobile-sheet-container"
      class="flex overflow-hidden w-full h-full rounded-t-8 rounded-b-8 mobile-modal:rounded-b-none shadow-lg"
    >
      <slot name="sidebar"></slot>

      <div
        data-testid="mobile-sheet"
        class="flex w-full h-full flex-col gap-8 bg-brown-300 dark:bg-grey-800"
      >
        <slot v-if="showHeader" name="header">
          <div
            data-testid="mobile-sheet__header"
            v-bind="header_bindings"
            class="w-full flex justify-center items-center place-items-center px-13 pt-11.5 pb-14 gap-6 wave-bottom-[50px] bg-(--theme-primary) text-(--theme-on-primary) relative"
          >
            <div v-if="show_close_button" class="absolute top-0 left-0 p-4">
              <ui-button icon-left="close" icon-only inverted @click="emit('close')" />
            </div>

            <slot name="header-content">
              <h1 class="text-5xl text-white">{{ title }}</h1>
            </slot>
          </div>
        </slot>

        <div data-testid="mobile-sheet__body" class="h-full">
          <slot></slot>
        </div>

        <div data-testid="mobile-sheet__footer" class="shrink-0">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
