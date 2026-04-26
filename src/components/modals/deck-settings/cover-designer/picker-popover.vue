<script setup lang="ts">
import { computed, ref } from 'vue'
import UiPopover from '@/components/ui-kit/popover.vue'
import UiButton from '@/components/ui-kit/button.vue'

type PickerPopoverProps = {
  label: string
  icon?: string
  size?: 'lg' | 'base'
}

const { label, icon, size = 'base' } = defineProps<PickerPopoverProps>()

const slots = defineSlots<{
  default(props: { close: () => void }): any
  extra?(): any
}>()

const open = ref(false)

const grid_cols = computed(() => (size === 'lg' ? 'grid-cols-4' : 'grid-cols-6'))
</script>

<template>
  <ui-popover
    data-testid="picker-popover"
    position="bottom"
    :gap="12"
    :open="open"
    :fallback_placements="['top']"
    shadow
    @close="open = false"
  >
    <template #trigger>
      <div class="flex flex-col gap-1">
        <ui-button
          data-testid="picker-popover__trigger"
          v-sfx="{ hover: 'ui.click_07', click: 'ui.select' }"
          @click="open = !open"
          :icon-left="icon"
          icon-only
          data-theme="brown-100"
          data-theme-dark="blue-800"
          size="lg"
          :mobile-tooltip="false"
        >
          {{ label }}
        </ui-button>
      </div>
    </template>

    <template #arrow>
      <div class="size-full rotate-45 rounded-1 bg-brown-100"></div>
    </template>

    <div
      data-testid="picker-popover__content"
      class="rounded-8 bg-brown-100 p-4 flex flex-col gap-4 w-80"
    >
      <div data-testid="picker-popover__grid" class="grid gap-2" :class="grid_cols">
        <slot :close="() => (open = false)"></slot>
      </div>
      <slot name="extra"></slot>
    </div>
  </ui-popover>
</template>
