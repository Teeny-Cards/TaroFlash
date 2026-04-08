<script setup lang="ts">
import Card from '@/components/card/index.vue'
import { computed, onMounted, ref } from 'vue'
import { type Grade, Rating, type RecordLog, type RecordLogItem } from 'ts-fsrs'
import { emitSfx } from '@/sfx/bus'
import { useGestures } from '@/composables/use-gestures'
import { useRatingFormat } from '@/utils/fsrs'

const { card, side, options } = defineProps<{
  card?: Card
  side: 'front' | 'back'
  options?: RecordLog
}>()

const emit = defineEmits<{
  (e: 'side-changed', side: 'front' | 'back'): void
  (e: 'reviewed', item: RecordLogItem): void
}>()

const { getRatingTimeFormat } = useRatingFormat()

const SWIPE_DISTANCE_THRESHOLD = 50
const FLING_SPEED = 0.25

const swipe_zone = ref<-1 | 0 | 1>(0)
const card_ref = ref<InstanceType<typeof Card> | null>(null)
const card_offset = ref<number>(0)

const is_dragging = computed(() => card_offset.value !== 0)

const passVisible = computed(() => card_offset.value > SWIPE_DISTANCE_THRESHOLD)
const failVisible = computed(() => card_offset.value < -SWIPE_DISTANCE_THRESHOLD)

const { register } = useGestures()

onMounted(() => {
  const el = card_ref.value?.$el as HTMLElement | null
  if (!el) return

  // swipe-right holds onStart/onMove since it fires for all horizontal drags,
  // regardless of which direction is ultimately recognised.
  register(el, 'swipe-right', {
    onStart() {
      el.style.transition = 'none'
    },
    onMove({ dx }) {
      card_offset.value = dx
      el.style.transform = `translateX(${dx}px) rotate(${dx / 10}deg)`
      _updateSwipeZone(dx)
    },
    onEnd({ dx }) {
      if (Math.abs(dx) > SWIPE_DISTANCE_THRESHOLD) flingCard(el, 1)
      else _snapBack(el)
    },
    onCancel() {
      _snapBack(el)
    }
  })

  register(el, 'swipe-left', {
    onEnd({ dx }) {
      if (Math.abs(dx) > SWIPE_DISTANCE_THRESHOLD) flingCard(el, -1)
      else _snapBack(el)
    },
    onCancel() {
      _snapBack(el)
    }
  })
})

function toggleSide() {
  if (is_dragging.value) return
  emit('side-changed', side === 'front' ? 'back' : 'front')
}

function flingCard(el: HTMLElement, direction: number) {
  const targetX = _getFlingTargetX(el, direction)
  const rotation = direction * 45

  el.style.transition = `transform ${FLING_SPEED}s ease-out`
  el.style.transform = `translateX(${targetX}px) rotate(${rotation}deg)`

  const rating = direction > 0 ? Rating.Good : Rating.Again

  const handleTransitionEnd = () => {
    el.removeEventListener('transitionend', handleTransitionEnd)
    reviewCard(rating)
    card_offset.value = 0
    el.style.transition = 'none'
    el.style.transform = ''
    swipe_zone.value = 0
  }

  el.addEventListener('transitionend', handleTransitionEnd)
  emitSfx('ui.slide_up')
}

function reviewCard(grade: Grade) {
  const item = options?.[grade]
  if (item) {
    emit('reviewed', item)
  }
}

function _snapBack(el: HTMLElement) {
  el.style.transition = 'transform 0.15s ease-out'
  el.style.transform = ''
  card_offset.value = 0
  swipe_zone.value = 0
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
</script>

<template>
  <div class="relative">
    <card
      ref="card_ref"
      data-testid="study-card"
      class="z-10"
      :class="is_dragging ? 'cursor-grabbing' : 'cursor-grab'"
      size="xl"
      v-bind="card"
      :side="side"
      @mouseup="toggleSide"
    >
      <div class="absolute inset-0 overflow-hidden rounded-(--face-radius)">
        <div class="review-label bg-pink-400" :class="{ 'review-label--visible': failVisible }">
          {{ $t('study.nope') }}
          <p class="text-sm">{{ getRatingTimeFormat(Rating.Again, options) }}</p>
        </div>
        <div class="review-label bg-green-400" :class="{ 'review-label--visible': passVisible }">
          {{ $t('study.got-it') }}
          <p class="text-sm">{{ getRatingTimeFormat(Rating.Good, options) }}</p>
        </div>
      </div>
    </card>
  </div>
</template>

<style>
.review-label {
  --duration: 0.05s;

  position: absolute;
  inset: -100px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  color: var(--color-white);
  font-size: var(--text-3xl);
  line-height: var(--text-3xl--line-height);

  border-radius: inherit;
  pointer-events: none;
  opacity: 0;

  user-select: none;
  z-index: 10;
  transform: scale(50%);
  transition:
    transform var(--duration) linear,
    opacity var(--duration) linear;
}

.review-label--visible {
  transform: scale(100%);
  opacity: 1;
}
</style>
