<script setup lang="ts">
import { ref } from 'vue'
import UiPopover from '@/components/ui-kit/popover.vue'
import UiIcon from '@/components/ui-kit/icon.vue'
import { type TextBlockType } from '@/utils/text-composer/toolbar'

const { selected_font_size = 'p' } = defineProps<{
  selected_font_size?: TextBlockType
}>()

const emit = defineEmits<{
  (e: 'select', size: TextBlockType): void
}>()

const open = ref(false)

const font_size_map: { [key in TextBlockType]?: string } = {
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  p: 'Paragraph'
}
</script>

<template>
  <ui-popover
    position="top-start"
    :gap="2"
    :use_arrow="false"
    :open="open"
    @close="open = false"
    class="h-full"
  >
    <template #trigger>
      <button
        @pointerdown.prevent
        @click.prevent="open = !open"
        class="flex gap-1 items-center px-3 py-2 h-full rounded-2.5 bg-brown-100 cursor-pointer
          transition-colors duration-75"
        :class="{ 'rounded-t-1 bg-purple-500 text-brown-100': open, 'text-brown-800': !open }"
      >
        {{ font_size_map[selected_font_size] }}
        <ui-icon src="carat-down" />
      </button>
    </template>

    <div
      data-testid="toolbar__font-size-selector"
      class="flex flex-col gap-3 bg-purple-500 rounded-6 rounded-bl-1 p-3 w-25"
    >
      <div
        v-for="(label, tag) in font_size_map"
        :key="tag"
        class="cursor-pointer rounded-full text-brown-100 flex flex-col items-center"
        @pointerdown.prevent
        @click.prevent="emit('select', tag)"
      >
        {{ label }}
      </div>
    </div>
  </ui-popover>
</template>
