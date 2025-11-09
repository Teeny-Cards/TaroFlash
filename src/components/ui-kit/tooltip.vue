<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useFloating, flip, autoUpdate, offset, type Placement } from '@floating-ui/vue'

const {
  text,
  position = 'top',
  gap = 0,
  fallback_placements = ['right', 'left', 'top', 'bottom'],
  element = 'div'
} = defineProps<{
  text: string
  position?: Placement
  gap?: number
  fallback_placements?: Placement[]
  element?: 'div' | 'span' | 'button'
}>()

const triggerRef = useTemplateRef<HTMLElement>('ui-tooltip-trigger')
const popoverRef = useTemplateRef<HTMLElement>('ui-tooltip')

const { floatingStyles } = useFloating(triggerRef, popoverRef, {
  placement: position,
  strategy: 'fixed',
  whileElementsMounted: autoUpdate,
  middleware: [
    offset(() => gap),
    flip({
      fallbackPlacements: fallback_placements
    })
  ]
})
</script>

<template>
  <component :is="element" ref="ui-tooltip-trigger" class="ui-tooltip-trigger" v-bind="$attrs"
    ><slot
  /></component>

  <div ref="ui-tooltip" :style="floatingStyles" class="ui-tooltip">
    {{ text }}
  </div>
</template>

<style>
.ui-tooltip {
  display: none;

  background-color: var(--color-brown-100);
  border-radius: var(--radius-full);
  padding: 6px 8px;

  font-size: var(--text-sm);
  line-height: var(--text-sm--line-height);
  color: var(--color-brown-700);

  pointer-events: none;
  z-index: 10;
}

.ui-tooltip-trigger:hover + .ui-tooltip {
  display: block;
}
</style>
