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
}>()

const open = ref(false)
</script>

<template>
  <ui-popover
    data-testid="cover-designer-popover-container"
    position="top"
    :gap="12"
    :open="open"
    :fallback_placements="['top']"
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

    <slot></slot>
  </ui-popover>
</template>
