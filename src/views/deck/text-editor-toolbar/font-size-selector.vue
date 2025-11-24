<script setup lang="ts">
import { ref } from 'vue'
import UiPopover from '@/components/ui-kit/popover.vue'
import UiIcon from '@/components/ui-kit/icon.vue'

const { selected_font_size = '14px' } = defineProps<{
  selected_font_size: string
}>()

const emit = defineEmits<{
  (e: 'select', size: number): void
}>()

const open = ref(false)

const font_size_map: { [key: string]: number } = {
  '24px': 24,
  '18px': 18,
  '16px': 16,
  '14px': 14,
  '12px': 12
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
        @click="open = !open"
        class="flex gap-1 items-center px-3 py-1 h-full rounded-4 bg-brown-100 cursor-pointer transition-colors
          duration-75"
        :class="{ 'rounded-t-1 bg-purple-500 text-brown-100': open, 'text-brown-900': !open }"
      >
        {{ selected_font_size }}
        <ui-icon src="carat-down" />
      </button>
    </template>

    <div
      data-testid="toolbar__font-size-selector"
      class="flex flex-col gap-3 bg-purple-500 rounded-6 rounded-bl-1 p-3 w-25"
    >
      <div
        v-for="(size, name) in font_size_map"
        :key="name"
        class="cursor-pointer rounded-full text-brown-100 flex flex-col items-center"
        @click="emit('select', size)"
      >
        {{ name }}
      </div>
    </div>
  </ui-popover>
</template>
