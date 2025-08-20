<script setup lang="ts">
import Card from '@/components/card/index.vue'
import { useAudio } from '@/composables/use-audio'
import { ref } from 'vue'
import { useCard } from '@/composables/use-card'

const {
  mode,
  activeCardIndex,
  side = 'front'
} = defineProps<{
  cards: Card[]
  mode: 'edit' | 'view' | 'select'
  side?: 'front' | 'back'
  activeCardIndex?: number
}>()

const emit = defineEmits<{
  (e: 'card-activated', index: number): void
  (
    e: 'card-image-updated',
    card_id: number | undefined,
    side: 'front' | 'back',
    file: File | undefined
  ): void
}>()

const audio = useAudio()
const card_size = ref<'base' | 'xl'>('base')

const get_front_image_url = (card: Card) => {
  return useCard(card).front_image_url.value
}

const get_back_image_url = (card: Card) => {
  return useCard(card).back_image_url.value
}

async function onCardClick(index: number) {
  if (activeCardIndex === index) return

  card_size.value = 'base'
  audio.play('slide_up')
  emit('card-activated', index)

  await new Promise((resolve) => setTimeout(resolve, 1))

  card_size.value = 'xl'
  const input = document.querySelector(
    '[data-testid="card-grid__selected-card"] .card-face__text-input'
  ) as HTMLInputElement

  input?.focus()
}

function onCardMouseEnter(index: number) {
  if (mode !== 'edit' || activeCardIndex === index) return
  audio.play('click_04')
}
</script>

<template>
  <div data-testid="card-grid" class="grid grid-cols-[repeat(auto-fit,192px)] gap-4 py-3">
    <card
      v-for="(card, index) in cards"
      class="group"
      :key="card.id"
      :front_text="card.front_text"
      :back_text="card.back_text"
      :front_image_url="get_front_image_url(card)"
      :back_image_url="get_back_image_url(card)"
      :mode="mode"
      @click="onCardClick(index)"
      @mouseenter="onCardMouseEnter(index)"
      @image-uploaded="emit('card-image-updated', card?.id, side, $event.file)"
    >
      <div
        v-if="mode === 'edit'"
        class="rounded-12 absolute -inset-2 -z-1 hidden bg-purple-400 bg-(image:--diagonal-stripes)
          group-hover:block"
      ></div>

      <card
        v-if="activeCardIndex === index && mode === 'edit'"
        data-testid="card-grid__selected-card"
        class="[&>.card-face]:shadow-modal !absolute top-1/2 left-1/2 z-10 -translate-1/2 [&>.card-face]:ring-2
          [&>.card-face]:ring-blue-500"
        :front_text="card.front_text"
        :back_text="card.back_text"
        :front_image_url="get_front_image_url(card)"
        :back_image_url="get_back_image_url(card)"
        :mode="mode"
        :size="card_size"
      ></card>
    </card>
  </div>
</template>
