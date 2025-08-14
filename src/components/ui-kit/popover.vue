<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { useFloating, shift, flip, autoUpdate, arrow, offset } from '@floating-ui/vue'
import { useAudio } from '@/composables/use-audio'

const ARROW_SIZE = 10

const triggerRef = useTemplateRef('triggerRef')
const popoverRef = useTemplateRef('popoverRef')
const arrowRef = useTemplateRef('arrowRef')
const audio = useAudio()

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

const side = computed(() => placement.value.split('-')[0])

function onMouseEnter() {
  audio.play('click_04')
}
</script>

<template>
  <div
    data-testid="ui-kit-popover-container"
    ref="triggerRef"
    class="ui-kit-popover-container group"
    @mouseenter="onMouseEnter"
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
        :class="`ui-kit-popover--${side}`"
        :style="floatingStyles"
      >
        <span data-testid="ui-kit-popover__bridge" class="ui-kit-popover__bridge"></span>
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

<style>
@reference '@/styles/main.css';

.ui-kit-popover-container {
  @apply absolute inset-0;
}

.ui-kit-popover {
  @apply shadow-popover rounded-7 pointer-events-auto relative z-10 hidden group-hover:block hover:block;
}

.ui-kit-popover__arrow {
  @apply bg-brown-300 rounded-1 shadow-popover -z-10 h-5 w-5 rotate-45;
}

.ui-kit-popover__bridge {
  @apply absolute inset-0;
}

.ui-kit-popover--top .ui-kit-popover__bridge {
  @apply top-full -bottom-6;
}

.ui-kit-popover--bottom .ui-kit-popover__bridge {
  @apply -top-6 bottom-full;
}

.ui-kit-popover--left .ui-kit-popover__bridge {
  @apply -right-6 left-full;
}

.ui-kit-popover--right .ui-kit-popover__bridge {
  @apply right-full -left-6;
}
</style>
