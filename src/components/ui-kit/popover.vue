<script setup lang="ts">
import { computed, useTemplateRef, onMounted, onUnmounted } from 'vue'
import {
  useFloating,
  shift,
  flip,
  autoUpdate,
  arrow,
  offset,
  hide,
  type Placement,
  type Strategy,
  type Padding
} from '@floating-ui/vue'

type PopoverProps = {
  mode?: 'click' | 'hover'
  open?: boolean
  position?: Placement
  gap?: number
  strategy?: Strategy
  transition_duration?: number
  clip_margin?: Padding
  padding?: Padding
}

const {
  mode = 'click',
  open = false,
  position = 'top',
  gap = 14,
  strategy = 'fixed',
  transition_duration = 100,
  clip_margin = 90,
  padding = 24
} = defineProps<PopoverProps>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const ARROW_SIZE = 10

const triggerRef = useTemplateRef('triggerRef')
const popoverRef = useTemplateRef('popoverRef')
const arrowRef = useTemplateRef('arrowRef')

const { placement, middlewareData, floatingStyles } = useFloating(triggerRef, popoverRef, {
  placement: position,
  strategy: strategy,
  whileElementsMounted: autoUpdate,
  middleware: [
    offset(() => ARROW_SIZE + gap),
    shift({ padding }),
    flip({
      fallbackPlacements: ['right-end', 'left-end']
    }),
    arrow({ element: arrowRef }),
    hide({
      padding: clip_margin
    })
  ]
})

onMounted(() => {
  if (mode === 'click') {
    document.addEventListener('click', onPageClick)
  }
})

onUnmounted(() => {
  if (mode === 'click') {
    document.removeEventListener('click', onPageClick)
  }
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

function onPageClick(e: Event): void {
  const target = e.target as HTMLElement

  if (!target.hasAttribute('data-testid="ui-kit-popover"')) {
    emit('close')
    document.removeEventListener('click', onPageClick)
  }
}
</script>

<template>
  <div
    data-testid="ui-kit-popover-container"
    ref="triggerRef"
    class="ui-kit-popover-container group"
    :class="[`ui-kit-popover-container--${mode}`, { 'ui-kit-popover-container--open': open }]"
  >
    <slot name="trigger"></slot>

    <Transition
      :duration="transition_duration"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      enter-active-class="transition-opacity duration-100 ease-in-out"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      leave-active-class="transition-opacity duration-100 ease-in-out"
    >
      <div
        v-if="open || mode === 'hover'"
        v-show="!middlewareData.hide?.referenceHidden"
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
.ui-kit-popover {
  display: none;
  position: relative;
  z-index: 10;
  border-radius: var(--radius-7);
  pointer-events: auto;
}

.ui-kit-popover-container--click.ui-kit-popover-container--open .ui-kit-popover,
.ui-kit-popover-container--hover:hover .ui-kit-popover,
.ui-kit-popover-container--hover .ui-kit-popover:hover {
  display: block;
}

.ui-kit-popover__arrow {
  background-color: var(--color-brown-300);
  border-radius: var(--radius-1);
  z-index: -10;

  width: 20px;
  height: 20px;
  rotate: 45deg;
}

.ui-kit-popover__bridge {
  position: absolute;
  inset: 0;
}

.ui-kit-popover--top .ui-kit-popover__bridge {
  top: 100%;
  bottom: -24px;
}

.ui-kit-popover--bottom .ui-kit-popover__bridge {
  top: -24px;
  bottom: 100%;
}

.ui-kit-popover--left .ui-kit-popover__bridge {
  right: -24px;
  left: 100%;
}

.ui-kit-popover--right .ui-kit-popover__bridge {
  right: 100%;
  left: -24px;
}
</style>
