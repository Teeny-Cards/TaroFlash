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
  visible?: boolean
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
  <component :is="element" ref="ui-tooltip-trigger" class="ui-tooltip-trigger" v-bind="$attrs">
    <slot></slot>
  </component>

  <div
    ref="ui-tooltip"
    :style="floatingStyles"
    class="ui-tooltip"
    :class="{ 'ui-tooltip--visible': visible }"
  >
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
  user-select: none;
}
.ui-tooltip--visible {
  display: block;
}

.ui-tooltip-trigger:hover + .ui-tooltip,
.ui-tooltip-trigger:focus + .ui-tooltip {
  display: block;
}
</style>
