<script setup lang="ts">
import Card from '@/components/card/index.vue'
import TextEditor from '@/components/text-editor/text-editor.vue'
import { computed } from 'vue'

type CardSide = 'front' | 'back'

const { card, side, front_attributes, back_attributes } = defineProps<{
  card?: Card
  side: CardSide
  front_attributes?: CardAttributes
  back_attributes?: CardAttributes
}>()

const emit = defineEmits<{
  (e: 'update', side: CardSide, text: string): void
}>()

const attributes = computed(() => (side === 'front' ? front_attributes : back_attributes))

const text = computed(() => (side === 'front' ? card?.front_text : card?.back_text))
</script>

<template>
  <card
    data-testid="study-card-edit"
    size="xl"
    mode="edit"
    :side="side"
    v-bind="card"
    :front_attributes="front_attributes"
    :back_attributes="back_attributes"
  >
    <template #editor>
      <text-editor
        :key="`${card?.id}-${side}`"
        data-testid="study-card-edit__input"
        :content="text"
        :attributes="attributes"
        :placeholder="side === 'front' ? $t('common.front') : $t('common.back')"
        class="w-full h-full"
        @update="emit('update', side, $event)"
      />
    </template>
  </card>
</template>
