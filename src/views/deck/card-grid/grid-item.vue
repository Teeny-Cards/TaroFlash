<script lang="ts" setup>
import Card from '@/components/card/index.vue'
import { useCard } from '@/composables/card'
import { ref } from 'vue'
import UiRadio from '@/components/ui-kit/radio.vue'

const { card, side, mode } = defineProps<{
  card: Card
  mode: 'edit' | 'view' | 'select'
  side: 'front' | 'back'
  selected: boolean
}>()

const emit = defineEmits<{
  (e: 'card-selected'): void
}>()

const { front_image_url, back_image_url } = useCard(card)
const front_image_preview = ref<string | undefined>(front_image_url.value)
const back_image_preview = ref<string | undefined>(back_image_url.value)
</script>

<template>
  <card
    v-bind="card"
    :class="{
      'cursor-pointer hover:[&>.card-face]:border-purple-500!': mode === 'select'
    }"
    :side="side"
    :front_image_url="front_image_preview"
    :back_image_url="back_image_preview"
  >
    <div v-if="mode === 'select'" class="absolute top-0 right-0">
      <ui-radio :checked="selected" @click.stop="emit('card-selected')" />
    </div>
  </card>
</template>
