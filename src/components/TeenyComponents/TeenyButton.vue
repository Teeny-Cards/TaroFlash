<template>
  <button
    class="teeny-btn"
    :class="{
      [sizeClass[props.size]]: true,
      [variantClass[props.variant]]: true,
      'btn-inverted': props.inverted,
      'btn-icon-only': props.iconOnly,
      'btn-fancy-hover': props.fancyHover
    }"
    @click.stop
    teeny-button
  >
    <div v-if="iconLeft" class="btn-icon" teeny-button__icon-left>
      <TeenyIcon v-if="iconLeft" :src="iconLeft" :size="iconSize[props.size]" />
    </div>
    <slot></slot>
    <div v-if="iconRight" class="btn-icon" teeny-button__icon-right>
      <TeenyIcon v-if="iconRight" :src="iconRight" :size="iconSize[props.size]" />
    </div>
  </button>
</template>

<script setup lang="ts">
import TeenyIcon from './TeenyIcon.vue'

const props = defineProps({
  variant: {
    type: String,
    validator(value: string) {
      return ['interaction', 'muted', 'danger'].includes(value)
    },
    default: 'interaction'
  },
  size: {
    type: String,
    validator(value: string) {
      return ['large', 'base', 'small', 'teeny'].includes(value)
    },
    default: 'base'
  },
  inverted: Boolean,
  iconOnly: Boolean,
  iconRight: String,
  iconLeft: String,
  fancyHover: Boolean
})

const variantClass: { [key: string]: string } = {
  interaction: 'btn-interaction',
  muted: 'btn-muted',
  danger: 'btn-danger'
}

const sizeClass: { [key: string]: string } = {
  large: 'btn-large',
  base: 'btn-base',
  small: 'btn-small',
  teeny: 'btn-teeny'
}

const iconSize: { [key: string]: string } = {
  large: 'large',
  base: 'base',
  small: 'small',
  teeny: 'teeny'
}
</script>
