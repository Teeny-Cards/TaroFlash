<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useFloating, flip, autoUpdate, offset, type Placement } from '@floating-ui/vue'

const {
  text,
  position = 'top',
  gap = 0,
  fallback_placements = ['right', 'left', 'top', 'bottom'],
  element = 'div',
  theme = 'brown',
  static_on_mobile = false
} = defineProps<{
  text: string
  position?: Placement
  gap?: number
  fallback_placements?: Placement[]
  element?: 'div' | 'span' | 'button'
  visible?: boolean
  disabled?: boolean
  theme?: MemberTheme
  static_on_mobile?: boolean
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
    v-if="!disabled"
    ref="ui-tooltip"
    :style="floatingStyles"
    class="ui-tooltip"
    :class="[
      { 'ui-tooltip--visible': visible },
      `ui-tooltip--${theme} ui-tooltip--${static_on_mobile ? 'static' : 'dynamic'}`
    ]"
  >
    {{ text }}
  </div>
</template>

<style>
.ui-tooltip {
  display: none;

  --tooltip-bg: var(--color-brown-100);
  --tooltip-color: var(--color-brown-700);

  background-color: var(--tooltip-bg);
  border-radius: var(--radius-full);
  padding: 6px 8px;

  font-size: var(--text-sm);
  line-height: var(--text-sm--line-height);
  color: var(--tooltip-color);

  pointer-events: none;
  z-index: 10;
  user-select: none;
}

@media (pointer: fine) {
  .ui-tooltip-trigger:hover + .ui-tooltip,
  .ui-tooltip-trigger:focus + .ui-tooltip,
  .ui-tooltip--visible {
    display: block;
  }
}

@media (pointer: coarse) {
  .ui-tooltip--static {
    display: block;
  }
}

.ui-tooltip--brown {
  --tooltip-bg: var(--color-brown-100);
  --tooltip-color: var(--color-brown-700);
}
.ui-tooltip--white {
  --tooltip-bg: var(--color-white);
  --tooltip-color: var(--color-brown-700);
}
</style>
