<script setup lang="ts">
import { ref } from 'vue'
import UiPopover from '@/components/ui-kit/popover.vue'
import UiButton from '@/components/ui-kit/button.vue'

type CoverColorPickerProps = {
  label: string
  icon?: string
}

defineProps<CoverColorPickerProps>()

const emit = defineEmits<{
  (e: 'select', theme: MemberTheme | undefined): void
}>()

const slots = defineSlots<{
  default(): any
  extra?(): any
}>()

const open = ref(false)
</script>

<template>
  <ui-popover
    data-testid="cover-designer-popover-container"
    position="right"
    :gap="12"
    :open="open"
    :fallback_placements="['bottom', 'top']"
    shadow
    @close="open = false"
  >
    <template #trigger>
      <div class="flex flex-col gap-1">
        <ui-button
          data-testid="cover-designer-popover__trigger"
          v-sfx="{ hover: 'ui.click_07', click: 'ui.select' }"
          @click="open = !open"
          :icon-left="icon"
          icon-only
          theme="brown-100"
          size="lg"
          :mobile-tooltip="false"
        >
          {{ label }}
        </ui-button>
      </div>
    </template>

    <template #arrow>
      <div class="size-full rotate-45 rounded-br-1 bg-brown-100" />
    </template>

    <div
      data-testid="cover-designer-popover__content"
      class="rounded-6 bg-brown-100 p-4 flex flex-col gap-4 w-80"
    >
      <h3 class="text-brown-700 text-xl text-center">{{ label }}</h3>
      <div
        data-testid="cover-designer-popover__grid"
        class="grid grid-cols-[1fr_1fr_1fr_1fr] gap-1"
      >
        <slot></slot>
      </div>
      <slot name="extra"></slot>
    </div>
  </ui-popover>
</template>
