<script setup lang="ts">
import { ref } from 'vue'
import UiPopover from '@/components/ui-kit/popover.vue'
import UiIcon from '@/components/ui-kit/icon.vue'
import { type SfxOptions } from '@/sfx/directive'

const { sfx = {} } = defineProps<{
  sfx?: SfxOptions
  triggerIcon?: string
  theme?: string
}>()

defineOptions({ inheritAttrs: false })

const open = ref(false)
</script>

<template>
  <ui-popover
    position="top"
    :gap="4"
    :use_arrow="false"
    :open="open"
    :fallback_placements="['bottom']"
    @close="open = false"
    class="h-full"
  >
    <template #trigger>
      <div v-bind="$attrs" @mousedown.prevent v-sfx="sfx" @click="open = !open">
        <ui-icon v-if="triggerIcon" :src="triggerIcon" />
      </div>
    </template>

    <div data-testid="align-selector__options" class="flex gap-1 *:shadow-xs">
      <slot></slot>
    </div>
  </ui-popover>
</template>
