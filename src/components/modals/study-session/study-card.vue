<script setup lang="ts">
import Card from '@/components/card/index.vue'
import { computed, onBeforeUnmount, ref } from 'vue'
import { type Grade, Rating, type RecordLog, type RecordLogItem } from 'ts-fsrs'
import { useI18n } from 'vue-i18n'
import { DateTime } from 'luxon'

const { card, side, options } = defineProps<{
  card?: Card
  side: 'front' | 'back'
  options?: RecordLog
}>()

const emit = defineEmits<{
  (e: 'side-changed', side: 'front' | 'back'): void
  (e: 'reviewed', item: RecordLogItem): void
}>()

// Independent thresholds
const SWIPE_DISTANCE_THRESHOLD = 150
const SWIPE_VELOCITY_THRESHOLD = 0.8
const FLIP_THRESHOLD = 0
const MAX_LABEL_DISTANCE = 160
const VELOCITY_WINDOW_MS = 80 // ms to consider for velocity calculation

const { t } = useI18n()

// Stores recent movement points for velocity calculation
const velocity_samples = ref<{ x: number; time: number }[]>([])
const start_pos = ref<{ x: number; y: number } | undefined>()
const study_card = ref<HTMLElement | null>(null)
const card_offset = ref<number>(0)

// Velocity state
const velocityX = ref<number>(0)
const pointerId = ref<number | null>(null)

const is_dragging = computed(() => Math.abs(card_offset.value) > FLIP_THRESHOLD)

const passOpacity = computed(() => {
  if (card_offset.value <= 0) return 0
  return Math.min(Math.abs(card_offset.value) / MAX_LABEL_DISTANCE, 1)
})

const failOpacity = computed(() => {
  if (card_offset.value >= 0) return 0
  return Math.min(Math.abs(card_offset.value) / MAX_LABEL_DISTANCE, 1)
})

function getRatingTimeFormat(grade: Grade) {
  const date = options?.[grade].card.due

  if (!date) return ''

  const time = DateTime.fromJSDate(date)
  const timeString = time.toRelativeCalendar()

  return t('study.study-again', { time: timeString })
}

function toggleSide() {
  if (is_dragging.value) return
  emit('side-changed', side === 'front' ? 'back' : 'front')
}

function onPointerDown(e: PointerEvent) {
  if (side === 'front') return
  if (e.pointerType === 'mouse' && e.button !== 0) return // only left click
  e.preventDefault()

  pointerId.value = e.pointerId
  start_pos.value = { x: e.clientX, y: e.clientY }

  // Root DOM element of the card component
  study_card.value = e.currentTarget as HTMLElement
  if (!study_card.value) return

  study_card.value.style.transition = 'none'

  // Init velocity tracking
  velocityX.value = 0
  velocity_samples.value = [{ x: e.clientX, time: performance.now() }]

  document.addEventListener('pointermove', onPointerMove)
  document.addEventListener('pointerup', onPointerUp)
  document.addEventListener('pointercancel', onPointerUp)
}

function onPointerMove(e: PointerEvent) {
  if (pointerId.value === null || e.pointerId !== pointerId.value) return
  if (!start_pos.value || !study_card.value) return

  const now = performance.now()
  const { x } = start_pos.value
  const clientX = e.clientX

  // Move card visually
  card_offset.value = clientX - x
  const rotation = card_offset.value / 10
  study_card.value.style.transform = `translateX(${card_offset.value}px) rotate(${rotation}deg)`

  // Add new sample
  velocity_samples.value.push({ x: clientX, time: now })

  // Remove old samples beyond the window
  const cutoff = now - VELOCITY_WINDOW_MS
  velocity_samples.value = velocity_samples.value.filter((s) => s.time >= cutoff)

  // Compute velocity from earliest sample in window
  if (velocity_samples.value.length > 1) {
    const first = velocity_samples.value[0]
    const last = velocity_samples.value[velocity_samples.value.length - 1]
    const dx = last.x - first.x
    const dt = last.time - first.time || 1
    velocityX.value = dx / dt // px per ms
  }
}

function onPointerUp(e?: PointerEvent) {
  if (pointerId.value !== null && e && e.pointerId !== pointerId.value) return

  const cardEl = study_card.value
  cleanupListeners()

  if (!cardEl) {
    resetDragState()
    return
  }

  const absOffset = Math.abs(card_offset.value)
  const absVelocity = Math.abs(velocityX.value)

  const distancePassed = absOffset > SWIPE_DISTANCE_THRESHOLD
  const fastEnough = absVelocity > SWIPE_VELOCITY_THRESHOLD

  if (distancePassed || fastEnough) {
    // Decide direction from offset first, else velocity
    const direction =
      card_offset.value !== 0
        ? Math.sign(card_offset.value)
        : velocityX.value !== 0
          ? Math.sign(velocityX.value)
          : 1

    flingCard(direction)
  } else {
    // Snap back to center
    cardEl.style.transition = 'transform 0.15s ease-out'
    cardEl.style.transform = ''
    resetDragState()
  }
}

function flingCard(direction: number) {
  const cardEl = study_card.value
  if (!cardEl) {
    resetDragState()
    return
  }

  const width = window.innerWidth || 1000
  const targetX = direction * (width + 200)
  const rotation = direction * 45

  cardEl.style.transition = 'transform 0.25s ease-out'
  cardEl.style.transform = `translateX(${targetX}px) rotate(${rotation}deg)`

  const rating = direction > 0 ? Rating.Good : Rating.Again

  const handleTransitionEnd = () => {
    cardEl.removeEventListener('transitionend', handleTransitionEnd)

    reviewCard(rating)

    // Reset visual state for next card
    card_offset.value = 0
    velocityX.value = 0
    cardEl.style.transition = 'none'
    cardEl.style.transform = ''
  }

  cardEl.addEventListener('transitionend', handleTransitionEnd)
}

function resetDragState() {
  start_pos.value = undefined
  velocityX.value = 0
  pointerId.value = null
  card_offset.value = 0
}

function cleanupListeners() {
  document.removeEventListener('pointermove', onPointerMove)
  document.removeEventListener('pointerup', onPointerUp)
  document.removeEventListener('pointercancel', onPointerUp)
}

onBeforeUnmount(() => {
  cleanupListeners()
})

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
      @pointerdown="onPointerDown"
    >
      <div
        class="absolute inset-0 bg-pink-400 rounded-(--face-radius) flex flex-col items-center justify-center
          text-white text-3xl"
        :style="{ opacity: failOpacity }"
      >
        {{ t('study.nope') }}
        <p class="text-sm">{{ getRatingTimeFormat(Rating.Again) }}</p>
      </div>
      <div
        class="absolute inset-0 bg-green-400 rounded-(--face-radius) flex flex-col items-center justify-center
          text-white text-3xl"
        :style="{ opacity: passOpacity }"
      >
        {{ t('study.got-it') }}
        <p class="text-sm">{{ getRatingTimeFormat(Rating.Good) }}</p>
      </div>
    </card>
  </div>
</template>
