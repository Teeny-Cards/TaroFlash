<script setup lang="ts">
import Card from '@/components/card/index.vue'
import { useAudio } from '@/composables/use-audio'
import { nextTick, ref } from 'vue'

const { mode } = defineProps<{
  cards: Card[]
  mode: 'edit' | 'view' | 'select'
}>()

const audio = useAudio()

const selected_card_index = ref()

async function onCardClick(index: number) {
  if (selected_card_index.value === index) return

  audio.play('slide_up')
  selected_card_index.value = index

  await nextTick()

  const card = document.querySelector('[data-testid="card-grid__selected-card"]') as HTMLDivElement
  const input = card.querySelector(
    '[data-testid="card-face__front"] .card-face__text-input'
  ) as HTMLInputElement

  input.focus()
}

function onCardMouseEnter() {
  if (mode !== 'edit') return
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
      @mouseenter="onCardMouseEnter"
    >
      <div
        v-if="mode === 'edit'"
        class="rounded-12 absolute -inset-2 -z-1 hidden bg-purple-400 bg-(image:--diagonal-stripes)
          group-hover:block"
      ></div>

      <card
        v-if="selected_card_index === index && mode === 'edit'"
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
