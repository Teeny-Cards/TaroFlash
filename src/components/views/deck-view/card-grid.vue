<script setup lang="ts">
import Card from '@/components/card/index.vue'
import { useAudio } from '@/composables/use-audio'
import { nextTick, ref } from 'vue'

const { mode, activeCardIndex } = defineProps<{
  cards: Card[]
  mode: 'edit' | 'view' | 'select'
  activeCardIndex?: number
}>()

const emit = defineEmits<{
  (e: 'card-activated', index: number): void
}>()

const audio = useAudio()

async function onCardClick(index: number) {
  if (activeCardIndex === index) return

  audio.play('slide_up')
  emit('card-activated', index)

  await nextTick()

  const input = document.querySelector(
    '[data-testid="card-grid__selected-card"] .card-face__text-input'
  ) as HTMLInputElement

  input.focus()
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
      :mode="mode"
      @click="onCardClick(index)"
      @mouseenter="onCardMouseEnter(index)"
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
        :mode="mode"
        size="lg"
      ></card>
    </card>
  </div>
</template>
