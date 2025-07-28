<script setup lang="ts">
const {
  variant = 'interaction',
  size = 'base',
  inverted = false,
  iconOnly = false,
  iconRight,
  iconLeft,
  fancyHover = false
} = defineProps<{
  variant?: 'interaction' | 'muted' | 'danger'
  size?: 'large' | 'base' | 'small' | 'xs'
  inverted?: boolean
  iconOnly?: boolean
  iconRight?: string
  iconLeft?: string
  fancyHover?: boolean
}>()

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

const iconSize: { [key: string]: string } = {
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
  >
    <div v-if="iconLeft" class="btn-icon" uikit-button__icon-left>
      <ui-kit:icon v-if="iconLeft" :src="iconLeft" :size="iconSize[size]" />
    </div>
    <slot></slot>
    <div v-if="iconRight" class="btn-icon" uikit-button__icon-right>
      <ui-kit:icon v-if="iconRight" :src="iconRight" :size="iconSize[size]" />
    </div>
  </button>
</template>
