<script setup lang="ts">
import Card from '@/components/card/index.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { type Grade, Rating, type RecordLog, type RecordLogItem } from 'ts-fsrs'
import { emitSfx } from '@/sfx/bus'
import { useGestures } from '@/composables/use-gestures'
import { useRatingFormat } from '@/utils/fsrs'

defineExpose({ rate })

const { card, side, options } = defineProps<{
  card?: Card
  side: 'front' | 'back' | 'cover'
  options?: RecordLog
}>()

const emit = defineEmits<{
  (e: 'started'): void
  (e: 'side-changed'): void
  (e: 'reviewed', item: RecordLogItem | undefined): void
}>()

const { getRatingTimeFormat } = useRatingFormat()

const FLIP_THRESHOLD = 10
const SWIPE_DISTANCE_THRESHOLD = 50
const FLING_SPEED = 0.25

const card_ref = ref<InstanceType<typeof Card> | null>(null)
const card_offset = ref<number>(0)

const is_dragging = ref(false)

const passVisible = computed(() => card_offset.value > SWIPE_DISTANCE_THRESHOLD)
const failVisible = computed(() => card_offset.value < -SWIPE_DISTANCE_THRESHOLD)

const { register } = useGestures()

onMounted(() => {
  const el = card_ref.value?.$el as HTMLElement | null
  if (!el) return

  // swipe-right holds onStart/onMove since it fires for all horizontal drags,
  // regardless of which direction is ultimately recognised.
  register(el, 'swipe-right', {
    onStart: (el) => {
      ;(el as HTMLElement).style.transition = 'none'
    },
    onMove: (el, { dx }) => handleDrag(el as HTMLElement, dx),
    onEnd: (el, { dx }) => commitSwipe(el as HTMLElement, dx, 1),
    onCancel: (el) => snapBack(el as HTMLElement)
  })

  register(el, 'swipe-left', {
    onEnd: (el, { dx }) => commitSwipe(el as HTMLElement, dx, -1),
    onCancel: (el) => snapBack(el as HTMLElement)
  })
})

/** Triggers the fling animation for a given grade. Called by the parent via template ref. */
function rate(grade: Grade) {
  if (side === 'cover') return

  const el = card_ref.value?.$el as HTMLElement | null
  if (!el) return
  flingCard(el, grade === Rating.Good ? 1 : -1)
}

/** Flips the card face unless a drag just ended (prevents accidental flips on release). */
function onCardClick() {
  if (is_dragging.value) return

  if (side === 'cover') {
    emit('started')
    return
  }

  emit('side-changed')
}

/**
 * Animates the card off-screen in the given direction, then emits `reviewed`.
 * Resets transform state once the CSS transition ends.
 */
function flingCard(el: HTMLElement, direction: number) {
  if (side === 'cover') return

  const targetX = direction * (window.innerWidth + el.getBoundingClientRect().width)
  const rating = direction > 0 ? Rating.Good : Rating.Again

  el.style.transition = `transform ${FLING_SPEED}s ease-out`
  el.style.transform = `translateX(${targetX}px) rotate(${direction * 45}deg)`

  emitSfx(rating === Rating.Good ? 'ui.music_plink_ok' : 'ui.music_plink_locancel')

  const onTransitionEnd = () => {
    el.removeEventListener('transitionend', onTransitionEnd)
    emit('reviewed', options?.[rating])
    card_offset.value = 0
    el.style.transition = 'none'
    el.style.transform = ''
  }

  el.addEventListener('transitionend', onTransitionEnd)
}

/** Tracks the card position and tilt while the user is dragging. */
function handleDrag(el: HTMLElement, dx: number) {
  if (side === 'cover') return

  is_dragging.value = Math.abs(dx) > FLIP_THRESHOLD // prevents accidental flips on release, but allows for a bit of wiggle room
  card_offset.value = dx
  el.style.transform = `translateX(${dx}px) rotate(${dx / 10}deg)`
}

/**
 * Decides whether to fling or snap back at the end of a swipe.
 * Flings if the drag exceeded the distance threshold, otherwise snaps back.
 */
function commitSwipe(el: HTMLElement, dx: number, direction: 1 | -1) {
  if (side === 'cover') return

  if (Math.abs(dx) > SWIPE_DISTANCE_THRESHOLD) flingCard(el, direction)
  else snapBack(el)
}

/** Animates the card back to its resting position and clears drag state. */
function snapBack(el: HTMLElement) {
  el.style.transition = 'transform 0.15s ease-out'
  el.style.transform = ''
  card_offset.value = 0

  setTimeout(() => {
    is_dragging.value = false
  }, 150)
}

/** Maps a drag offset to a swipe zone: 1 (pass), -1 (fail), 0 (neutral). */
function toSwipeZone(offset: number) {
  return offset > SWIPE_DISTANCE_THRESHOLD ? 1 : offset < -SWIPE_DISTANCE_THRESHOLD ? -1 : 0
}

// Play a tick sound whenever the drag crosses into or out of a commit zone.
watch(card_offset, (val, prev) => {
  if (toSwipeZone(val) !== toSwipeZone(prev)) emitSfx('ui.music_plink_mid')
})
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
      @mouseup="onCardClick"
    >
      <div class="absolute inset-0 overflow-hidden rounded-(--face-radius)">
        <div
          data-testid="review-label--fail"
          class="review-label bg-pink-400"
          :class="{ 'review-label--visible': failVisible }"
        >
          {{ $t('study.nope') }}
          <p class="text-sm">{{ getRatingTimeFormat(Rating.Again, options) }}</p>
        </div>
        <div
          data-testid="review-label--pass"
          class="review-label bg-green-400"
          :class="{ 'review-label--visible': passVisible }"
        >
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
