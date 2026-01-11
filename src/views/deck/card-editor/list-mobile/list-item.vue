<script setup lang="ts">
import Card from '@/components/card/index.vue'
import { type CardBulkEditor } from '@/composables/card-bulk-editor'
import { inject, computed } from 'vue'

const { card } = defineProps<{
  index: number
  card: Card
}>()

const editor = inject<CardBulkEditor>('card-editor')!
</script>

<template>
  <card v-bind="card" size="xl" class="shrink-0" mode="edit"></card>
</template>
