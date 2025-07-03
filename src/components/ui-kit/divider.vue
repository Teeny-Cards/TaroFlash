<script lang="ts" setup>
defineProps<{
  dashed?: boolean
}>()
</script>

<template>
  <div
    data-testid="ui-kit-divider"
    class="border-brown-500 w-full border-t"
    :class="{ 'border-dashed': dashed }"
  ></div>
</template>
