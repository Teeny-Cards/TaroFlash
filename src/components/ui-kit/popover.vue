<script lang="ts" setup>
import { useTemplateRef, computed, ref } from 'vue'
import { useFloating, shift, flip, autoUpdate, arrow, offset } from '@floating-ui/vue'

const open = ref(false)
const hovering = ref(false)
const timeout = ref<number>()

const popover_trigger = useTemplateRef('ui-kit-popover__trigger')
const popover = useTemplateRef('ui-kit-popover')
const popover_arrow = useTemplateRef('ui-kit-popover__arrow')

const { floatingStyles, middlewareData, placement } = useFloating(popover_trigger, popover, {
  placement: 'right-end',
  whileElementsMounted: autoUpdate,
  middleware: [offset(24), shift({ padding: 24 }), flip(), arrow({ element: popover_arrow })]
})

const arrow_left = computed(() => {
  if (
    placement.value === 'left' ||
    placement.value === 'left-start' ||
    placement.value === 'left-end'
  ) {
    return 'calc(100% - 10px)'
  } else if (
    placement.value === 'right' ||
    placement.value === 'right-start' ||
    placement.value === 'right-end'
  ) {
    return '-10px'
  }

  return middlewareData.value.arrow?.x != null ? `${middlewareData.value.arrow.x}px` : ''
})

const arrow_top = computed(() => {
  if (
    placement.value === 'top' ||
    placement.value === 'top-start' ||
    placement.value === 'top-end'
  ) {
    return 'calc(100% - 10px)'
  } else if (
    placement.value === 'bottom' ||
    placement.value === 'bottom-start' ||
    placement.value === 'bottom-end'
  ) {
    return '-10px'
  }

  return middlewareData.value.arrow?.y != null ? `${middlewareData.value.arrow.y}px` : ''
})

function schedulePopoverClose() {
  timeout.value = window.setTimeout(() => {
    if (!hovering.value) {
      open.value = false
    }
  }, 0)
}

function handleMouseLeavePopover() {
  hovering.value = false
  schedulePopoverClose()
}

function handleMouseEnterTrigger() {
  window.clearTimeout(timeout.value)
  open.value = true
}
</script>

<template>
  <div
    data-testid="ui-kit-popover__trigger"
    ref="ui-kit-popover__trigger"
    class="absolute inset-0 z-10"
    @mouseenter="handleMouseEnterTrigger"
    @mouseleave="schedulePopoverClose"
  ></div>

  <teleport to="[popover-container]">
    <Transition
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      enter-active-class="transition-[opacity] ease-in-out duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      leave-active-class="transition-[opacity] ease-in-out duration-100"
    >
      <div
        v-if="open"
        data-testid="ui-kit-popover"
        ref="ui-kit-popover"
        class="shadow-popover rounded-7 pointer-events-auto"
        :style="floatingStyles"
        @mouseenter="hovering = true"
        @mouseleave="handleMouseLeavePopover"
      >
        <slot></slot>

        <div data-testid="ui-kit-popover__arrow" ref="ui-kit-popover__arrow">
          <slot name="arrow" :positions="{ left: arrow_left, top: arrow_top }">
            <div
              class="brown-300 rounded-1 -z-10 h-5 w-5 rotate-45"
              :style="{
                position: 'absolute',
                left: arrow_left,
                top: arrow_top
              }"
            ></div>
          </slot>
        </div>
      </div>
    </Transition>
  </teleport>
</template>
