<script setup lang="ts">
import Card from '@/components/card/index.vue'
import { computed, onBeforeUnmount, ref } from 'vue'
import { type Grade, Rating, type RecordLog, type RecordLogItem } from 'ts-fsrs'
import { useI18n } from 'vue-i18n'
import { emitSfx } from '@/sfx/bus'
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

const { t } = useI18n()

const FLIP_THRESHOLD = 0
const SWIPE_DISTANCE_THRESHOLD = 50
const FLING_SPEED = 0.25

const swipe_zone = ref<-1 | 0 | 1>(0)
const start_pos = ref<{ x: number; y: number } | undefined>()
const study_card = ref<HTMLElement | null>(null)
const card_offset = ref<number>(0)
const pointerId = ref<number | null>(null)

const is_dragging = computed(() => Math.abs(card_offset.value) > FLIP_THRESHOLD)

const passVisible = computed(() => {
  if (card_offset.value <= 0) return false
  return card_offset.value > SWIPE_DISTANCE_THRESHOLD
})

const failVisible = computed(() => {
  if (card_offset.value >= 0) return false
  return card_offset.value < -SWIPE_DISTANCE_THRESHOLD
})

onBeforeUnmount(_cleanupListeners)

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
  if (side === 'front' || (e.pointerType === 'mouse' && e.button !== 0)) return // only left click

  pointerId.value = e.pointerId
  start_pos.value = { x: e.clientX, y: e.clientY }
  study_card.value = e.currentTarget as HTMLElement

  if (!study_card.value) return

  study_card.value.style.transition = 'none'

  document.addEventListener('pointermove', onPointerMove)
  document.addEventListener('pointerup', onPointerUp)
  document.addEventListener('pointercancel', onPointerUp)
}

function onPointerMove(e: PointerEvent) {
  if (
    pointerId.value === null ||
    e.pointerId !== pointerId.value ||
    !start_pos.value ||
    !study_card.value
  )
    return

  e.preventDefault()
  const { x } = start_pos.value
  const clientX = e.clientX

  card_offset.value = clientX - x
  const rotation = card_offset.value / 10
  study_card.value.style.transform = `translateX(${card_offset.value}px) rotate(${rotation}deg)`

  // check the threshold and play audio
  _updateSwipeZone(card_offset.value)
}

function onPointerUp(e?: PointerEvent) {
  if (pointerId.value !== null && e?.pointerId !== pointerId.value) return

  const cardEl = study_card.value
  _cleanupListeners()

  if (!cardEl) {
    _resetDragState()
  } else if (Math.abs(card_offset.value) > SWIPE_DISTANCE_THRESHOLD) {
    const direction = Math.sign(card_offset.value)
    flingCard(direction)
  } else {
    cardEl.style.transition = 'transform 0.15s ease-out'
    cardEl.style.transform = ''
    _resetDragState()
  }
}

function flingCard(direction: number) {
  const cardEl = study_card.value
  if (!cardEl) {
    _resetDragState()
    return
  }

  const targetX = _getFlingTargetX(cardEl, direction)
  const rotation = direction * 45

  cardEl.style.transition = `transform ${FLING_SPEED}s ease-out`
  cardEl.style.transform = `translateX(${targetX}px) rotate(${rotation}deg)`

  const rating = direction > 0 ? Rating.Good : Rating.Again

  const handleTransitionEnd = () => {
    cardEl.removeEventListener('transitionend', handleTransitionEnd)

    reviewCard(rating)
    card_offset.value = 0
    cardEl.style.transition = 'none'
    cardEl.style.transform = ''
    swipe_zone.value = 0
  }

  cardEl.addEventListener('transitionend', handleTransitionEnd)
  emitSfx('ui.slide_up')
}

function reviewCard(grade: Grade) {
  const item = options?.[grade]
  if (item) {
    emit('reviewed', item)
  }
}

function _updateSwipeZone(offset: number) {
  const zone: -1 | 0 | 1 =
    offset > SWIPE_DISTANCE_THRESHOLD ? 1 : offset < -SWIPE_DISTANCE_THRESHOLD ? -1 : 0

  if (zone !== swipe_zone.value) {
    emitSfx('ui.pop_drip_mid')
  }

  swipe_zone.value = zone
}

function _getFlingTargetX(cardEl: HTMLElement, direction: number) {
  const container = cardEl.closest('[data-testid="study-session"]')
  const containerRect = container?.getBoundingClientRect() ?? document.body.getBoundingClientRect()
  const cardRect = cardEl.getBoundingClientRect()

  const distanceToEdge =
    direction > 0
      ? containerRect.right - cardRect.left // distance to right edge
      : cardRect.right - containerRect.left // distance to left edge

  const extra = cardRect.width * 1.5

  return direction * (distanceToEdge + extra)
}

function _resetDragState() {
  setTimeout(() => {
    start_pos.value = undefined
    pointerId.value = null
    card_offset.value = 0
    swipe_zone.value = 0
  }, 0)
}

function _cleanupListeners() {
  document.removeEventListener('pointermove', onPointerMove)
  document.removeEventListener('pointerup', onPointerUp)
  document.removeEventListener('pointercancel', onPointerUp)
}
</script>

<template>
  <div class="relative">
    <!-- <card class="z-10" size="xl" face_classes="outline-brown-100 outline-10 opacity-0" /> -->
    <card
      data-testid="study-card"
      class="z-10"
      :class="is_dragging ? 'cursor-grabbing' : 'cursor-grab'"
      size="xl"
      v-bind="card"
      :side="side"
      @mouseup="toggleSide"
      @pointerdown="onPointerDown"
    >
      <div class="absolute inset-0 overflow-hidden rounded-(--face-radius)">
        <div class="review-label bg-pink-400" :class="{ 'review-label--visible': failVisible }">
          {{ t('study.nope') }}
          <p class="text-sm">{{ getRatingTimeFormat(Rating.Again) }}</p>
        </div>
        <div class="review-label bg-green-400" :class="{ 'review-label--visible': passVisible }">
          {{ t('study.got-it') }}
          <p class="text-sm">{{ getRatingTimeFormat(Rating.Good) }}</p>
        </div>
      </div>
    </card>
  </div>
</template>

<style>
.review-label {
  position: absolute;
  inset: 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  color: var(--color-white);
  font-size: var(--text-3xl);
  line-height: var(--text-3xl--line-height);

  pointer-events: none;
  opacity: 0;

  transform: translateY(100%);
  transition:
    transform 0.1s linear,
    opacity 0.1s linear;
}

.review-label--visible {
  transform: translateY(0);
  opacity: 1;
}
</style>
