<script setup lang="ts">
import { ref, computed, useTemplateRef } from 'vue'
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
  <!-- Trigger -->
  <div data-testid="popover-trigger" ref="triggerRef" class="group absolute inset-0 z-10">
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
        data-testid="popover"
        class="shadow-popover rounded-7 pointer-events-auto relative z-10 hidden group-hover:block hover:block"
        :style="floatingStyles"
      >
        <slot></slot>

        <div
          ref="arrowRef"
          data-testid="popover-arrow"
          class="bg-brown-300 rounded-1 -z-10 h-5 w-5 rotate-45"
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
