<script setup lang="ts">
import UiIcon from '@/components/ui-kit/icon.vue'
import type { SfxOptions } from '@/sfx/directive'

export type ButtonProps = {
  theme?: 'green' | 'blue' | 'purple' | 'pink' | 'red' | 'orange' | 'brown' | 'grey'
  size?: 'xl' | 'lg' | 'base' | 'sm' | 'xs'
  iconOnly?: boolean
  iconRight?: string
  iconLeft?: string
  fancyHover?: boolean
  sfx?: SfxOptions
}

const {
  theme = 'blue',
  size = 'base',
  iconOnly = false,
  iconRight,
  iconLeft,
  fancyHover = false,
  sfx = { hover: 'ui.click_07' }
} = defineProps<ButtonProps>()
</script>

<template>
  <button
    data-testid="ui-kit-button"
    class="ui-kit-btn group/btn"
    v-sfx="sfx"
    :class="[
      `btn-${theme}`,
      `btn-${size}`,
      {
        'btn-icon-only': iconOnly,
        'btn-fancy-hover': fancyHover
      }
    ]"
  >
    <ui-icon v-if="iconLeft" class="btn-icon" :src="iconLeft" />
    <div v-if="!iconOnly" class="btn-label">
      <slot></slot>
    </div>
    <ui-icon v-if="iconRight" class="btn-icon" :src="iconRight" />

    <div v-if="iconOnly && $slots.default" class="ui-kit-btn__tooltip">
      <slot></slot>
    </div>

    <div
      class="absolute inset-0 hidden group-hover/btn:block bgx-diagonal-stripes
        animation-safe:bgx-slide rounded-(--btn-border-radius) pointer-events-none"
    ></div>
  </button>
</template>

<style>
/* Base button styles */
.ui-kit-btn {
  position: relative;

  background-color: var(--btn-main-color);
  color: var(--btn-secondary-color);
  font-family: var(--font-primary);
  font-size: var(--btn-font-size);
  line-height: var(--btn-font-size--line-height);

  outline: var(--btn-outline-width, 0) solid var(--btn-outline-color, var(--btn-main-color));
  border-radius: var(--btn-border-radius);
  padding: var(--btn-padding);
  height: max-content;
  width: max-content;

  display: flex;
  gap: var(--btn-gap);
  align-items: center;
  justify-content: center;
  user-select: none;
  cursor: pointer;
}
.ui-kit-btn:hover {
  --btn-outline-color: var(--btn-hover-color);
  --btn-outline-width: 2px;
}

.ui-kit-btn .btn-icon {
  height: 100%;
  max-height: 100%;
  color: var(--btn-secondary-color);
}

/* Button sizes */
.ui-kit-btn.btn-xl {
  --btn-font-size: var(--text-2xl);
  --btn-font-size--line-height: var(--text-2xl--line-height);
  --btn-border-radius: var(--radius-5_5);
  --btn-gap: 8px;
  --btn-padding: 14px 24px;
}
.ui-kit-btn.btn-lg {
  --btn-font-size: var(--text-lg);
  --btn-font-size--line-height: var(--text-xl--line-height);
  --btn-border-radius: var(--radius-5);
  --btn-gap: 16px;
  --btn-padding: 14px 20px;
}
.ui-kit-btn.btn-base {
  --btn-font-size: var(--text-base);
  --btn-font-size--line-height: var(--text-base--line-height);
  --btn-border-radius: var(--radius-4);
  --btn-gap: 8px;
  --btn-padding: 6px 10px;
}
.ui-kit-btn.btn-sm {
  --btn-font-size: var(--text-sm);
  --btn-font-size--line-height: var(--text-sm--line-height);
  --btn-border-radius: var(--radius-3);
  --btn-gap: 6px;
  --btn-padding: 4px 6px;
}
.ui-kit-btn.btn-xs {
  --btn-font-size: var(--text-sm);
  --btn-font-size--line-height: var(--text-sm--line-height);
  --btn-border-radius: var(--radius-3);
  --btn-gap: 6px;
  --btn-padding: 4px 6px;
}

/* Icon-only buttons */
.ui-kit-btn.btn-icon-only {
  --btn-padding: 8px;
  --btn-border-radius: var(--radius-4);
  --btn-secondary-color: var(--color-white);
}
.ui-kit-btn.btn-icon-only .btn-icon {
  background-color: transparent;
  color: var(--btn-secondary-color);
}
.ui-kit-btn.btn-icon-only.btn-sm {
  --btn-padding: 4px;
}

/* Button tooltips */
.ui-kit-btn__tooltip {
  display: none;
  position: absolute;
  top: -22px;

  border-radius: var(--radius-full);
  padding: 6px 8px;

  font-size: var(--text-sm);
  line-height: var(--text-sm--line-height);
  color: var(--color-brown-700);
  white-space: nowrap;
  background-color: var(--color-white);

  pointer-events: none;
}
.ui-kit-btn:hover .ui-kit-btn__tooltip {
  display: block;
}

/* Button themes */
.ui-kit-btn.btn-blue {
  --btn-main-color: var(--color-blue-500);
  --btn-secondary-color: var(--color-white);
  --btn-hover-color: var(--color-blue-400);
}
.ui-kit-btn.btn-green {
  --btn-main-color: var(--color-green-400);
  --btn-secondary-color: var(--color-white);
  --btn-hover-color: var(--color-green-300);
}
.ui-kit-btn.btn-purple {
  --btn-main-color: var(--color-purple-500);
  --btn-secondary-color: var(--color-white);
  --btn-hover-color: var(--color-purple-500);
}
.ui-kit-btn.btn-pink {
  --btn-main-color: var(--color-pink-500);
  --btn-secondary-color: var(--color-white);
  --btn-hover-color: var(--color-pink-400);
}
.ui-kit-btn.btn-red {
  --btn-main-color: var(--color-red-500);
  --btn-secondary-color: var(--color-white);
  --btn-hover-color: var(--color-red-400);
}
.ui-kit-btn.btn-orange {
  --btn-main-color: var(--color-orange-500);
  --btn-secondary-color: var(--color-white);
  --btn-hover-color: var(--color-orange-400);
}
.ui-kit-btn.btn-brown {
  --btn-main-color: var(--color-brown-100);
  --btn-secondary-color: var(--color-brown-700);
  --btn-hover-color: var(--color-brown-500);
}
.ui-kit-btn.btn-grey {
  --btn-main-color: var(--color-grey-400);
  --btn-secondary-color: var(--color-white);
  --btn-hover-color: var(--color-grey-500);
}
</style>
