<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { useFloating, shift, flip, autoUpdate, arrow, offset } from '@floating-ui/vue'

const ARROW_SIZE = 10

const triggerRef = useTemplateRef('triggerRef')
const popoverRef = useTemplateRef('popoverRef')
const arrowRef = useTemplateRef('arrowRef')

const { placement, middlewareData, floatingStyles } = useFloating(triggerRef, popoverRef, {
  placement: 'top',
  strategy: 'fixed',
  whileElementsMounted: autoUpdate,
  middleware: [
    offset(() => ARROW_SIZE + 14),
    shift({ padding: 24 }),
    flip({
      fallbackPlacements: ['right-end', 'left-end']
    }),
    arrow({ element: arrowRef })
  ]
})

const isSide = (side: string) => placement.value.startsWith(side)

const arrowLeft = computed(() => {
  if (isSide('left')) return `calc(100% - ${ARROW_SIZE}px)` // arrow on right edge
  if (isSide('right')) return `-${ARROW_SIZE}px` // arrow on left edge

  const x = middlewareData.value.arrow?.x
  return x ? `${x}px` : ''
})

const arrowTop = computed(() => {
  if (isSide('top')) return `calc(100% - ${ARROW_SIZE}px)` // arrow on bottom edge
  if (isSide('bottom')) return `-${ARROW_SIZE}px` // arrow on top edge

  const y = middlewareData.value.arrow?.y
  return y ? `${y}px` : ''
})
</script>

<template>
  <div
    data-testid="ui-kit-popover-container"
    ref="triggerRef"
    class="ui-kit-popover-container group"
  >
    <Transition
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      enter-active-class="transition-opacity duration-100 ease-in-out"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      leave-active-class="transition-opacity duration-100 ease-in-out"
    >
      <div
        ref="popoverRef"
        data-testid="ui-kit-popover"
        class="ui-kit-popover"
        :style="floatingStyles"
      >
        <slot></slot>

        <div
          ref="arrowRef"
          data-testid="ui-kit-popover__arrow"
          class="ui-kit-popover__arrow"
          :style="{
            position: 'absolute',
            left: arrowLeft,
            top: arrowTop
          }"
        />
      </div>
    </Transition>
  </div>
</template>
