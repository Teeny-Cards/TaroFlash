<script setup lang="ts">
import { computed, useTemplateRef, onMounted } from 'vue'
import { useFloating, shift, flip, autoUpdate, offset, type Placement } from '@floating-ui/vue'

const { text, placement: placement_prop = 'top' } = defineProps<{
  text: string
  placement?: Placement
}>()

onMounted(() => {
  const parent = triggerRef.value?.parentElement

  if (parent && !(parent?.style?.position ?? '' in ['absolute', 'relative', 'fixed'])) {
    parent.classList.add('relative')
  }
})

const popoverRef = useTemplateRef('popoverRef')
const triggerRef = useTemplateRef('triggerRef')

const { placement, floatingStyles } = useFloating(triggerRef, popoverRef, {
  placement: placement_prop,
  strategy: 'fixed',
  whileElementsMounted: autoUpdate,
  middleware: [
    offset(() => 24),
    shift({ padding: 24 }),
    flip({
      fallbackPlacements: ['right', 'left', 'top', 'bottom']
    })
  ]
})

const side = computed(() => placement?.value.split('-')[0] ?? 'right')
</script>

<template>
  <span
    ref="triggerRef"
    data-testid="ui-kit-tooltip-container"
    class="ui-kit-tooltip-container group"
  >
    <span
      ref="popoverRef"
      data-testid="ui-kit-tooltip"
      class="ui-kit-tooltip"
      :class="`ui-kit-tooltip--${side}`"
      :style="floatingStyles"
      role="tooltip"
    >
      <div data-testid="ui-kit-tooltip__bubble" class="ui-kit-tooltip__bubble">
        <p class="text-sm text-purple-500">{{ text }}</p>
        <div data-testid="ui-kit-tooltip__arrow" class="ui-kit-tooltip__arrow"></div>
      </div>
    </span>
  </span>
</template>

<style>
@reference '@/styles/main.css';

.ui-kit-tooltip-container {
  @apply absolute inset-0;
}

.ui-kit-tooltip {
  @apply pointer-events-none z-10 hidden items-center group-hover:flex hover:flex;
}

.ui-kit-tooltip__bubble {
  @apply relative flex min-h-7 min-w-7 shrink-0 items-center justify-center rounded-full bg-white px-3 py-1.5 shadow;
}

.ui-kit-tooltip .ui-kit-tooltip__arrow {
  @apply absolute z-10 border-dashed border-white;
}

.ui-kit-tooltip--top .ui-kit-tooltip__arrow {
  @apply top-full h-6 w-0.25 border-l;
}

.ui-kit-tooltip--left .ui-kit-tooltip__arrow {
  @apply left-full h-0.25 w-6 border-b;
}

.ui-kit-tooltip--right .ui-kit-tooltip__arrow {
  @apply right-full h-0.25 w-6 border-b;
}

.ui-kit-tooltip--bottom .ui-kit-tooltip__arrow {
  @apply bottom-full h-6 w-0.25 border-l;
}
</style>
