<template>
  <div class="teeny-input" :class="sizeClass[props.size]">
    <input
      :type="props.type"
      :placeholder="props.placeholder"
      v-model="value"
      :class="{ 'text-center': props.center }"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  type: String,
  placeholder: String,
  center: Boolean,
  size: {
    type: String,
    validator(value: string) {
      return ['large', 'base'].includes(value)
    },
    default: 'base'
  }
})

const value = defineModel()

const sizeClass: { [key: string]: string } = {
  large: 'input-large',
  base: 'input-base'
}
</script>
