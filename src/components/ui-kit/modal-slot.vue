<script setup lang="ts">
import { provide } from 'vue'
import { MODAL_ID_KEY } from '@/composables/modal'

const { id } = defineProps<{ id: string }>()
provide(MODAL_ID_KEY, id)
</script>

<template>
  <slot></slot>
</template>
