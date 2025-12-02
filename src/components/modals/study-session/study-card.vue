<script setup lang="ts">
import Card from '@/components/card/index.vue'
import { computed, ref } from 'vue'
import { type Grade, Rating, type RecordLog, type RecordLogItem } from 'ts-fsrs'

const { card, side, options } = defineProps<{
  card?: Card
  side: 'front' | 'back'
  options?: RecordLog
}>()

const emit = defineEmits<{
  (e: 'side-changed', side: 'front' | 'back'): void
  (e: 'reviewed', item: RecordLogItem): void
}>()

const REVIEW_THRESHOLD = 100
const FLIP_THRESHOLD = 0

const start_pos = ref<{ x: number; y: number } | undefined>()
const study_card = ref<HTMLDivElement | null>()
const card_offset = ref<number>(0)

const is_dragging = computed(() => {
  return Math.abs(card_offset.value) > FLIP_THRESHOLD
})

function toggleSide() {
  if (is_dragging.value) return

  emit('side-changed', side === 'front' ? 'back' : 'front')
}

function onDragStart(e: MouseEvent) {
  if (side === 'front') return
  e.preventDefault()

  start_pos.value = { x: e.clientX, y: e.clientY }
  study_card.value = document.querySelector('[data-testid="study-card"]') as HTMLDivElement
  study_card.value.style.transition = 'none'

  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', onDragEnd)
}

function onDragEnd() {
  start_pos.value = undefined

  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', onDragEnd)

  // if (Math.abs(card_offset.value) > REVIEW_THRESHOLD) {
  //   const rating = card_offset.value > 0 ? Rating.Good : Rating.Again
  //   reviewCard(rating)
  // }

  if (!study_card.value) return
  study_card.value.style.transition = 'transform 0.1s linear'
  study_card.value.style.transform = ''
  card_offset.value = 0
}

function onDrag(e: MouseEvent) {
  if (!start_pos.value || !study_card.value) return

  const { x } = start_pos.value
  const { clientX } = e

  card_offset.value = clientX - x
  const rotation = card_offset.value / 10

  study_card.value.style.transform = `translateX(${card_offset.value}px) rotate(${rotation}deg)`
}

function reviewCard(grade: Grade) {
  const item = options?.[grade]

  if (item) {
    emit('reviewed', item)
  }
}
</script>

<template>
  <div class="relative">
    <!-- <card class="z-10" size="xl" face_classes="outline-brown-100 outline-10 opacity-0" /> -->
    <card
      data-testid="study-card"
      class="z-10"
      :class="is_dragging ? 'cursor-grabbing' : 'cursor-grab'"
      face_classes="outline-brown-100 outline-10"
      size="xl"
      v-bind="card"
      :side="side"
      @mouseup="toggleSide"
      @mousedown="onDragStart"
    />
  </div>
</template>
