<script setup lang="ts">
import { computed } from 'vue'
import { coverBindings } from '@/utils/cover'
import UiButton from '@/components/ui-kit/button.vue'

type MobileSheetProps = {
  theme?: MemberTheme
  cover_config?: DeckCover
  title?: string
}

const { theme = 'green-400', cover_config, title } = defineProps<MobileSheetProps>()

const slots = defineSlots<{
  header(): any
  'header-content'(): any
  body(): any
  footer(): any
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const headerBindings = computed(() =>
  coverBindings(
    {
      bg_color: cover_config?.bg_color,
      bg_image: cover_config?.bg_image,
      pattern: cover_config?.pattern,
      pattern_size: 50,
      pattern_opacity: 0.2
    },
    { fallbackTheme: theme, border: false }
  )
)
const applied_theme = computed(() => headerBindings.value['data-theme'])

const showHeader = computed(() => {
  return slots.header || slots['header-content'] || title
})
</script>

<template>
  <div
    data-testid="mobile-sheet"
    :data-theme="applied_theme"
    class="flex flex-col gap-8 overflow-hidden w-full shrink-0 max-sm:mt-auto bg-brown-300 dark:bg-grey-800 rounded-t-8 sm:rounded-b-8 shadow-lg"
  >
    <slot v-if="showHeader" name="header">
      <div
        data-testid="mobile-sheet__header"
        v-bind="headerBindings"
        class="w-full flex justify-center items-center place-items-center px-13 pt-11.5 pb-14 gap-6 wave-bottom-[50px] bg-(--theme-primary) text-(--theme-on-primary) bgx-color-[var(--theme-neutral)] relative"
      >
        <div class="absolute top-0 left-0 p-4">
          <ui-button
            icon-left="close"
            icon-only
            :theme="applied_theme"
            inverted
            @click="emit('close')"
          />
        </div>

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
