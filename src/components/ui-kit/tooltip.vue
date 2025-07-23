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
      fallbackPlacements: ['right', 'left', 'bottom']
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
