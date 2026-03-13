<script setup lang="ts">
import { ref } from 'vue'
import UiPopover from '@/components/ui-kit/popover.vue'
import UiIcon from '@/components/ui-kit/icon.vue'
import { type TextBlockType } from '@/utils/text-composer/toolbar'
import { type SfxOptions } from '@/sfx/directive'

const { selected_font_size = 'p' } = defineProps<{
  selected_font_size?: TextBlockType
  sfx?: SfxOptions
}>()

const emit = defineEmits<{
  (e: 'select', size: TextBlockType): void
}>()

defineOptions({ inheritAttrs: false })

const open = ref(false)

const font_size_map: { [key in TextBlockType]?: string } = {
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  p: 'Normal Text'
}
</script>

<template>
  <ui-popover
    position="top-start"
    :gap="4"
    :use_arrow="false"
    :open="open"
    :fallback_placements="['bottom']"
    @close="open = false"
    class="h-full"
  >
    <template #trigger>
      <button
        @pointerdown.prevent
        @click.prevent="open = !open"
        class="flex gap-1 items-center justify-between w-32"
        v-sfx="sfx"
        v-bind="$attrs"
      >
        {{ font_size_map[selected_font_size] }}
        <ui-icon src="carat-down" :class="{ 'rotate-180': open }" />
      </button>
    </template>

    <div
      data-testid="toolbar__font-size-selector"
      class="flex flex-col bg-(--theme-primary) rounded-2.5 p-1 w-32 shadow-xs"
    >
      <div
        v-for="(label, tag) in font_size_map"
        :key="tag"
        class="cursor-pointer rounded-2 text-(--theme-on-primary) p-2 hover:bg-(--theme-secondary)"
        :class="{ 'bg-(--theme-secondary)': tag === selected_font_size }"
        @pointerdown.prevent
        v-sfx="{ hover: 'ui.click_07', click: 'ui.toggle_on' }"
        @click.prevent="emit('select', tag)"
      >
        {{ label }}
      </div>
    </div>
  </ui-popover>
</template>
