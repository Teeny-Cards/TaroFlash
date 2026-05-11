<script setup lang="ts">
import { computed } from 'vue'
import { buildTagButtonMask, outsetSideFor, type NotchSide } from '@/utils/tag-button/mask'

type TagButtonProps = {
  notchSide?: NotchSide
  notchDepth?: number
  outsetDepth?: number
  apexRadius?: number
  cornerRadius?: number
  fancyHover?: boolean
}

const {
  notchSide = 'right',
  notchDepth = 10,
  outsetDepth = 10,
  apexRadius = 3,
  cornerRadius = 4,
  fancyHover = true
} = defineProps<TagButtonProps>()

const mask = computed(() =>
  buildTagButtonMask({ notchSide, notchDepth, outsetDepth, apexRadius, cornerRadius })
)

const padding = computed(() => {
  const outset = outsetSideFor(notchSide)
  const left = outset === 'left' ? outsetDepth + 10 : notchDepth + 10
  const right = outset === 'left' ? notchDepth + 10 : outsetDepth + 10
  return { paddingLeft: `${left}px`, paddingRight: `${right}px` }
})
</script>

<template>
  <span class="ui-tag-button-shell inline-block hover:scale-105" v-sfx.hover="'ui.click_07'">
    <button
      data-testid="ui-kit-tag-button"
      type="button"
      class="group/tag-btn relative bg-(--theme-primary) text-(--theme-on-primary) py-2 w-max cursor-pointer inline-flex items-center gap-1.5 text-sm"
      :style="{ mask, WebkitMask: mask, ...padding }"
    >
      <slot></slot>
      <div
        v-if="fancyHover"
        data-testid="ui-kit-tag-button__hover-fx"
        class="absolute! inset-0 bgx-diagonal-stripes bgx-color-[var(--theme-neutral)] animation-safe:group-hover/tag-btn:bgx-slide pointer-events-none"
      />
    </button>
  </span>
</template>

<style>
.ui-tag-button-shell {
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.15));
}

@media (hover: hover) {
  .ui-tag-button-shell:hover {
    filter: drop-shadow(2px 0 0 var(--theme-primary)) drop-shadow(-2px 0 0 var(--theme-primary))
      drop-shadow(0 2px 0 var(--theme-primary)) drop-shadow(0 -2px 0 var(--theme-primary));
  }
}
</style>
