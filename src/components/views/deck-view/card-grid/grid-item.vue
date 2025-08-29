<script lang="ts" setup>
import Card from '@/components/card/index.vue'
import { useCard } from '@/composables/use-card'
import { useAudio } from '@/composables/use-audio'
import { ref } from 'vue'
import { type ImageUploadEvent } from '@/components/image-uploader.vue'
import { MAX_INPUT_LENGTH } from '@/composables/use-card-bulk-editor'

const { card, activeCardIndex, side, mode, index } = defineProps<{
  card: Card
  index: number
  mode: 'edit' | 'view' | 'select'
  side: 'front' | 'back'
  activeCardIndex?: number
  selected: boolean
}>()

const emit = defineEmits<{
  (e: 'card-image-updated', file: File | undefined): void
  (e: 'card-activated', index: number): void
  (e: 'card-deactivated', index: number): void
  (e: 'card-updated', text: string): void
  (e: 'card-selected'): void
}>()

const audio = useAudio()
const { front_image_url, back_image_url } = useCard(card)
const card_size = ref<'base' | 'xl'>('base')
const front_image_preview = ref<string | undefined>(front_image_url.value)
const back_image_preview = ref<string | undefined>(back_image_url.value)

async function onCardFocusIn() {
  if (mode !== 'edit' || activeCardIndex === index) return

  card_size.value = 'base'
  audio.play('slide_up')
  emit('card-activated', index)

  await new Promise((resolve) => setTimeout(resolve, 1))

  card_size.value = 'xl'
  _focusInput()
}

async function onCardFocusOut() {
  if (mode !== 'edit' || activeCardIndex !== index) return

  card_size.value = 'base'
  emit('card-deactivated', index)

  await new Promise((resolve) => setTimeout(resolve, 1))

  if (activeCardIndex === undefined) {
    audio.play('card_drop')
  }
}

function onDblClick() {
  if (mode === 'view') {
    emit('card-activated', index)
  }
}

function onImageUploaded(event: ImageUploadEvent) {
  if (side === 'front') {
    front_image_preview.value = event.preview
  } else {
    back_image_preview.value = event.preview
  }

  emit('card-image-updated', event.file)
}

function _focusInput() {
  const input = document.querySelector(
    '[data-testid="card-grid__selected-card"] [data-testid="card-face__text-input"]'
  ) as HTMLTextAreaElement

  input?.focus()
}

function onMouseEnter() {
  if (mode !== 'select') return
  audio.play('click_04')
}

function onClick() {
  if (mode !== 'select') return
  emit('card-selected')
  audio.play('etc_camera_shutter')
}
</script>

<template>
  <card
    class="group relative"
    :class="{
      'cursor-pointer hover:[&>.card-face]:!border-purple-500': mode === 'select'
    }"
    :key="card.id"
    :front_text="card.front_text"
    :back_text="card.back_text"
    :side="side"
    :front_image_url="front_image_preview"
    :back_image_url="back_image_preview"
    :maxlength="MAX_INPUT_LENGTH"
    :mode="mode"
    @focusin="onCardFocusIn"
    @image-uploaded="onImageUploaded"
    @dblclick="onDblClick"
    @click="onClick"
    @mouseenter="onMouseEnter"
  >
    <div
      v-if="mode === 'edit'"
      class="rounded-12 absolute -inset-2 -z-1 hidden bg-purple-400 bg-(image:--diagonal-stripes)
        group-hover:block"
    ></div>

    <div v-if="mode === 'select'" class="absolute top-0 right-0">
      <ui-kit:radio :checked="selected" @click.stop="emit('card-selected')" />
    </div>

    <card
      v-if="activeCardIndex === index && mode === 'edit'"
      data-testid="card-grid__selected-card"
      class="[&>.card-face]:shadow-modal !absolute top-1/2 left-1/2 z-10 -translate-1/2 [&>.card-face]:ring-2
        [&>.card-face]:ring-blue-500"
      :front_text="card.front_text"
      :back_text="card.back_text"
      :front_image_url="front_image_preview"
      :back_image_url="back_image_preview"
      :mode="mode"
      :size="card_size"
      :max_length="MAX_INPUT_LENGTH"
      @focusout="onCardFocusOut"
      @update:front_text="emit('card-updated', $event)"
      @update:back_text="emit('card-updated', $event)"
      @image-uploaded="onImageUploaded"
    ></card>
  </card>
</template>
