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

// Distance & velocity thresholds
const REVIEW_DISTANCE_THRESHOLD = 150 // px
const REVIEW_VELOCITY_THRESHOLD = 2 // px/ms-ish
const FLIP_THRESHOLD = 0 // you already had this

const start_pos = ref<{ x: number; y: number } | undefined>()
const study_card = ref<HTMLDivElement | null>()
const card_offset = ref<number>(0)

// For kinetic behavior
const lastX = ref<number | null>(null)
const lastTime = ref<number | null>(null)
const velocityX = ref<number>(0)

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
  study_card.value = document.querySelector('[data-testid="study-card"]') as HTMLDivElement | null
  if (!study_card.value) return

  study_card.value.style.transition = 'none'

  // Init velocity tracking
  lastX.value = e.clientX
  lastTime.value = performance.now()
  velocityX.value = 0

  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', onDragEnd)
}

function onDrag(e: MouseEvent) {
  if (!start_pos.value || !study_card.value) return

  const { x } = start_pos.value
  const { clientX } = e

  card_offset.value = clientX - x
  const rotation = card_offset.value / 10
  study_card.value.style.transform = `translateX(${card_offset.value}px) rotate(${rotation}deg)`

  // Velocity tracking
  const now = performance.now()
  if (lastX.value !== null && lastTime.value !== null) {
    const dx = clientX - lastX.value
    const dt = now - lastTime.value || 1
    velocityX.value = dx / dt // px per ms
  }
  lastX.value = clientX
  lastTime.value = now
}

function onDragEnd() {
  start_pos.value = undefined

  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', onDragEnd)

  if (!study_card.value) return

  const absOffset = Math.abs(card_offset.value)
  const absVelocity = Math.abs(velocityX.value)

  const shouldReview =
    absOffset > REVIEW_DISTANCE_THRESHOLD || absVelocity > REVIEW_VELOCITY_THRESHOLD

  if (shouldReview) {
    const direction =
      card_offset.value !== 0 ? Math.sign(card_offset.value) : Math.sign(velocityX.value) || 1
    flingCard(direction)
  } else {
    // Snap back
    study_card.value.style.transition = 'transform 0.15s ease-out'
    study_card.value.style.transform = ''
    card_offset.value = 0
  }
}

function flingCard(direction: number) {
  if (!study_card.value) return

  const cardEl = study_card.value
  const width = window.innerWidth || 1000
  const targetX = direction * (width + 200)
  const rotation = direction * 45

  cardEl.style.transition = 'transform 0.25s ease-out'
  cardEl.style.transform = `translateX(${targetX}px) rotate(${rotation}deg)`

  const rating = direction > 0 ? Rating.Good : Rating.Again

  const handleTransitionEnd = () => {
    cardEl.removeEventListener('transitionend', handleTransitionEnd)

    // Emit review event
    reviewCard(rating)

    // Reset visual state so the next card starts centered.
    card_offset.value = 0
    velocityX.value = 0
    cardEl.style.transition = 'none'
    cardEl.style.transform = ''
  }

  cardEl.addEventListener('transitionend', handleTransitionEnd)
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
