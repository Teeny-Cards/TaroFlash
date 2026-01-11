<script setup lang="ts">
import Card from '@/components/card/index.vue'
import { type CardBulkEditor } from '@/composables/card-bulk-editor'
import { inject, computed } from 'vue'

const { card } = defineProps<{
  index: number
  card: Card
}>()

const editor = inject<CardBulkEditor>('card-editor')!
const active_side = inject<{ value: 'front' | 'back' }>('active-side')!

const active = computed(() => editor.active_card_id.value === card.id)
</script>

<template>
  <card
    v-bind="card"
    size="xl"
    class="shrink-0"
    mode="edit"
    :side="active_side.value"
    :active="active"
  ></card>
</template>
