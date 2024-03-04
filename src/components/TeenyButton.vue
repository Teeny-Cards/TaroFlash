<template>
  <button
    class="transition-colors font-semibold flex items-center justify-center font-primary"
    :class="[buttonColor[variant], buttonSize[size], buttonPadding[size]]"
    teeny-button
  >
    <div
      v-if="iconLeft"
      class="rounded-full flex justify-center items-center"
      :class="iconStyles"
      teeny-button__icon-left
    >
      <TeenyIcon v-if="iconLeft" :src="iconLeft" :size="size" />
    </div>
    <slot></slot>
    <div
      v-if="iconRight"
      class="rounded-full flex justify-center items-center"
      :class="iconStyles"
      teeny-button__icon-right
    >
      <TeenyIcon v-if="iconRight" :src="iconRight" :size="size" />
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
  iconLeft: String
})

const buttonSize: { [key: string]: string } = {
  large: 'text-lg rounded-btn-large gap-2',
  base: 'text-base rounded-btn-base gap-2',
  small: 'text-sm rounded-btn-small gap-1.5',
  teeny: 'text-sm rounded-btn-teeny gap-1.5'
}

const buttonPadding: { [key: string]: string } = {
  large: props.iconOnly ? 'p-2' : 'px-2.5 py-1.5',
  base: props.iconOnly ? 'p-2' : 'px-2.5 py-1.5',
  small: props.iconOnly ? 'p-2' : 'px-2.5 py-1.5',
  teeny: props.iconOnly ? 'p-2' : 'px-1.5 py-1'
}

const buttonColor: { [key: string]: string } = {
  interaction: props.inverted ? 'bg-white text-blue' : 'bg-blue text-white',
  muted: props.inverted ? 'bg-white text-grey' : 'bg-grey text-white',
  danger: props.inverted ? 'bg-white text-red' : 'bg-red text-white'
}

const iconColor: { [key: string]: string } = {
  interaction: props.inverted ? 'text-white' : 'text-blue',
  muted: props.inverted ? 'text-white' : 'text-grey',
  danger: props.inverted ? 'text-white' : 'text-red'
}

const iconBackground: { [key: string]: string } = {
  interaction: props.inverted ? 'bg-blue p-0.5' : 'bg-white p-0.5',
  muted: props.inverted ? 'bg-grey p-0.5' : 'bg-white p-0.5',
  danger: props.inverted ? 'bg-red p-0.5' : 'bg-white p-0.5'
}

const iconOnlyStyles: { [key: string]: string } = {
  interaction: props.inverted ? 'p-0 bg-transparent text-blue' : 'p-0 bg-transparent text-white',
  muted: props.inverted ? 'p-0 bg-transparent text-grey' : 'p-0 bg-transparent text-white',
  danger: props.iconOnly ? 'p-0 bg-transparent text-red' : 'p-0 bg-transparent text-white'
}

const iconStyles = {
  [iconColor[props.variant]]: !props.iconOnly, // Apply icon color only if not iconOnly
  [iconBackground[props.variant]]: !props.iconOnly, // Apply background only if not iconOnly
  [iconOnlyStyles[props.variant]]: props.iconOnly // Apply iconOnlyStyles if iconOnly is true
}
</script>
