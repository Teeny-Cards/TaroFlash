<script setup lang="ts">
import { computed, ref, useTemplateRef, watch, onBeforeUnmount } from 'vue'
import { useFloating, flip, autoUpdate, offset, type Placement } from '@floating-ui/vue'
import { useMediaQuery } from '@/composables/use-media-query'

const {
  text,
  position = 'top',
  gap = 0,
  fallback_placements = ['right', 'left', 'top', 'bottom'],
  element = 'div',
  visible = false,
  suppress = false,
  static_on_mobile = false
} = defineProps<{
  text?: string
  position?: Placement
  gap?: number
  fallback_placements?: Placement[]
  element?: 'div' | 'span' | 'button' | 'label'
  visible?: boolean
  suppress?: boolean
  static_on_mobile?: boolean
}>()

const triggerRef = useTemplateRef<HTMLElement>('ui-tooltip-trigger')
const popoverRef = useTemplateRef<HTMLElement>('ui-tooltip')

const is_active = ref(false)
const is_coarse_pointer = useMediaQuery('coarse')

// gates both DOM mount (v-if) and autoUpdate — keeps unused tooltips out of
// the DOM entirely so switching modes doesn't pay the cost of mounting N
// teleported popovers up front
const should_show = computed(
  () => !suppress && (visible || is_active.value || (static_on_mobile && is_coarse_pointer.value))
)

const { floatingStyles, update } = useFloating(triggerRef, popoverRef, {
  placement: position,
  strategy: 'fixed',
  middleware: [
    offset(() => gap),
    flip({
      fallbackPlacements: fallback_placements
    })
  ]
})

let stop_auto_update: (() => void) | null = null

watch(
  () => ({
    show: should_show.value,
    trigger: triggerRef.value,
    popover: popoverRef.value
  }),
  ({ show, trigger, popover }) => {
    stop_auto_update?.()
    stop_auto_update = null
    if (show && trigger && popover) {
      stop_auto_update = autoUpdate(trigger, popover, update)
    }
  },
  { flush: 'post' }
)

onBeforeUnmount(() => stop_auto_update?.())
</script>

<template>
  <component
    :is="element"
    ref="ui-tooltip-trigger"
    class="ui-tooltip-trigger"
    @mouseenter="is_active = true"
    @mouseleave="is_active = false"
    @focusin="is_active = true"
    @focusout="is_active = false"
  >
    <slot></slot>
    <Teleport v-if="should_show" to="body">
      <div
        ref="ui-tooltip"
        data-theme="white"
        data-theme-dark="brown-100"
        :style="floatingStyles"
        class="ui-tooltip ui-tooltip--visible bg-(--theme-primary) text-(--theme-on-primary) rounded-full py-1.5 px-2 text-sm pointer-events-none z-100 select-none"
      >
        <slot name="tooltip">{{ text }}</slot>
      </div>
    </Teleport>
  </component>
</template>

<style>
.ui-tooltip {
  display: none;
}

.ui-tooltip--visible {
  display: block;
}

@media (pointer: coarse) {
  .ui-tooltip--static {
    display: block;
  }
}
</style>
