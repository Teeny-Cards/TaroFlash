<script setup lang="ts">
import { useAudio } from '@/composables/audio'
import UiIcon from '@/components/ui-kit/icon.vue'

export type ButtonProps = {
  variant?: 'interaction' | 'muted' | 'danger'
  size?: 'large' | 'base' | 'small' | 'xs'
  inverted?: boolean
  iconOnly?: boolean
  iconRight?: string
  iconLeft?: string
  fancyHover?: boolean
  hoverAudio?: boolean
}

const {
  variant = 'interaction',
  size = 'base',
  inverted = false,
  iconOnly = false,
  iconRight,
  iconLeft,
  fancyHover = false,
  hoverAudio = true
} = defineProps<ButtonProps>()

const audio = useAudio()

const variantClass: { [key: string]: string } = {
  interaction: 'btn-interaction',
  muted: 'btn-muted',
  danger: 'btn-danger'
}

const sizeClass: { [key: string]: string } = {
  large: 'btn-large',
  base: 'btn-base',
  small: 'btn-small',
  xs: 'btn-xs'
}

const iconSize: { [key: string]: 'large' | 'base' | 'small' | 'xs' } = {
  large: 'large',
  base: 'base',
  small: 'small',
  xs: 'xs'
}
</script>

<template>
  <button
    data-testid="ui-kit-button"
    class="ui-kit-btn"
    :class="{
      [sizeClass[size]]: true,
      [variantClass[variant]]: true,
      'btn-inverted': inverted,
      'btn-icon-only': iconOnly,
      'btn-fancy-hover': fancyHover
    }"
    @click.stop
    @mouseenter="hoverAudio && audio.play('click_07')"
  >
    <div v-if="iconLeft" class="btn-icon" uikit-button__icon-left>
      <ui-icon v-if="iconLeft" :src="iconLeft" :size="iconSize[size]" />
    </div>
    <div v-if="!iconOnly" class="btn-label">
      <slot></slot>
    </div>
    <div v-if="iconRight" class="btn-icon" uikit-button__icon-right>
      <ui-icon v-if="iconRight" :src="iconRight" :size="iconSize[size]" />
    </div>

    <div v-if="iconOnly && $slots.default" class="ui-kit-btn__tooltip">
      <slot></slot>
    </div>
  </button>
</template>

<style>
@reference '@/styles/main.css';

/* Base button styles */
.ui-kit-btn {
  --btn-main-color: var(--color-blue-500);
  --btn-secondary-color: var(--color-white);

  @apply h-max w-max;

  background-color: var(--btn-main-color);
  color: var(--btn-secondary-color);
  font-family: var(--font-primary);
  font-size: var(--btn-font-size);
  border-radius: var(--btn-border-radius);
  gap: var(--btn-gap);
  padding: var(--btn-padding);

  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  cursor: pointer;
}

.ui-kit-btn:hover {
  @apply ring-2 ring-(--btn-main-color);
  @apply scale-105;
}

.ui-kit-btn .btn-icon {
  color: var(--btn-main-color);
  background-color: var(--btn-secondary-color);

  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: --spacing(0.5);
}

/* Button variants */
.ui-kit-btn.btn-interaction {
  --btn-main-color: var(--color-blue-500);
  --btn-secondary-color: var(--color-white);
}
.ui-kit-btn.btn-muted {
  --btn-main-color: var(--color-grey-500);
  --btn-secondary-color: var(--color-white);
}
.ui-kit-btn.btn-danger {
  --btn-main-color: var(--color-red-500);
  --btn-secondary-color: var(--color-white);
}

/* Inverted styles */
.ui-kit-btn.btn-inverted.btn-interaction {
  --btn-main-color: var(--color-white);
  --btn-secondary-color: var(--color-blue-500);
}
.ui-kit-btn.btn-inverted.btn-muted {
  --btn-main-color: var(--color-white);
  --btn-secondary-color: var(--color-grey-500);
}
.ui-kit-btn.btn-inverted.btn-danger {
  --btn-main-color: var(--color-white);
  --btn-secondary-color: var(--color-red-500);
}

/* Button sizes */
.ui-kit-btn.btn-large {
  --btn-font-size: var(--text-lg);
  --btn-border-radius: var(--radius-4);
  --btn-gap: --spacing(2);
  --btn-padding: --spacing(1.5) --spacing(2.5);
}
.ui-kit-btn.btn-base {
  --btn-font-size: var(--text-base);
  --btn-border-radius: var(--radius-4);
  --btn-gap: --spacing(2);
  --btn-padding: --spacing(1.5) --spacing(2.5);
}
.ui-kit-btn.btn-small {
  --btn-font-size: var(--text-sm);
  --btn-border-radius: var(--radius-3);
  --btn-gap: --spacing(1.5);
  --btn-padding: --spacing(1) --spacing(1);
}
.ui-kit-btn.btn-xs {
  --btn-font-size: var(--text-sm);
  --btn-border-radius: var(--radius-3);
  --btn-gap: --spacing(1.5);
  --btn-padding: --spacing(1) --spacing(1.5);
}

/* Icon-only buttons */
.ui-kit-btn.btn-icon-only,
.ui-kit-btn.btn-inverted.btn-icon-only {
  --btn-padding: --spacing(2);
  --btn-border-radius: var(--radius-4);
  --btn-secondary-color: var(--color-white);
}
.ui-kit-btn.btn-icon-only .btn-icon {
  background-color: transparent;
  color: var(--btn-secondary-color);
}

.ui-kit-btn.btn-icon-only.btn-small {
  --btn-padding: --spacing(1);
}

.ui-kit-btn.btn-icon-only.btn-inverted.btn-interaction {
  --btn-secondary-color: var(--color-blue-500);
}
.ui-kit-btn.btn-icon-only.btn-inverted.btn-muted {
  --btn-secondary-color: var(--color-grey-500);
}
.ui-kit-btn.btn-icon-only.btn-inverted.btn-danger {
  --btn-secondary-color: var(--color-red-500);
}

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
</style>
