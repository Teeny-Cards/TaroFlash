<template>
  <input
    :type="props.type"
    :placeholder="props.placeholder"
    v-model="value"
    class="border-b border-gray-400 focus:outline-none py-1 w-full bg-transparent"
  />
</template>

<script setup lang="ts">
const props = defineProps({
  type: String,
  placeholder: String
})

const value = defineModel()
</script>
