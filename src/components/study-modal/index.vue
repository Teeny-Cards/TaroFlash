<template>
  <ui-kit:modal :open="open" @close="$emit('closed')" @opened="onOpen" backdrop>
    <div
      data-testid="study-modal"
      class="bg-parchment-dark rounded-8 shadow-modal flex h-170 w-268 flex-col items-center overflow-hidden pb-6"
    >
      <div
        data-testid="study-modal__header"
        class="bg-purple-dark pointy-bottom relative flex w-full justify-center bg-(image:--diagonal-stripes) bg-(length:--bg-sm) px-13 py-11.5"
      >
        <div data-testid="study-modal__actions" class="absolute top-0 left-0 p-4">
          <ui-kit:button
            icon-left="close"
            variant="muted"
            inverted
            icon-only
            @click="$emit('closed')"
          ></ui-kit:button>
        </div>
        <h1 class="text-3xl text-white">Studying {{ deck?.title }}</h1>
      </div>

      <div
        v-if="open"
        data-testid="study-modal__body"
        class="grid h-full w-full grid-cols-[1fr_auto_1fr] content-center"
      >
        <div></div>
        <Cards :current-card="current_card" :card-revealed="card_revealed" />
        <Buttons
          :current-card="current_card"
          :card-revealed="card_revealed"
          @reveal="card_revealed = true"
          @correct="onCorrect"
          @incorrect="onIncorrect"
        />
      </div>

      <Track :current-card="current_card" />
    </div>
  </ui-kit:modal>
</template>

<script setup lang="ts">
import Track from './track.vue'
import Cards from './cards.vue'
import Buttons from './buttons.vue'
import { provide, type PropType } from 'vue'
import { toRef } from 'vue'
import { ref } from 'vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  deck: {
    type: Object as PropType<Deck>
  }
})

defineEmits<{
  (e: 'closed'): void
}>()

provide('deck', toRef(props, 'deck'))

const card_revealed = ref(false)

function onOpen() {
  current_card.value = props.deck?.cards?.[0]
}

const current_card = ref<Card>()

function onCorrect() {
  card_revealed.value = false
  current_card.value = props.deck?.cards?.[current_card.value?.order ?? 0 + 1]
}

function onIncorrect() {
  card_revealed.value = false
  current_card.value = props.deck?.cards?.[current_card.value?.order ?? 0]
}
</script>
