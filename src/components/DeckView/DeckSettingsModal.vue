<template>
  <slot name="trigger">
    <ui-kit:button
      icon-left="settings"
      variant="muted"
      icon-only
      @click="open = true"
    ></ui-kit:button>
  </slot>
  <ui-kit:modal :open="open" @close="open = false">
    <div
      tid="deck-settings-modal"
      class="bg-white rounded-16 shadow-modal flex flex-col justify-between gap-22 py-10 px-14"
    >
      <div tid="settings-modal-header" class="w-full flex justify-center items-center gap-12">
        <div class="w-30 h-0.75 bg-grey rounded-full"></div>
        <h1 class="text-3xl font-primary text-grey tracking-wider">Deck Settings</h1>
        <div class="w-30 h-0.75 bg-grey rounded-full"></div>
      </div>
      <div tid="settings-modal-body" class="flex gap-16 w-full h-full relative">
        <div class="z-1 max-w-min">
          <Card size="large" class="bg-blue! ring-white ring-6"></Card>
          <ui-kit:input
            placeholder="Title"
            size="large"
            class="-mt-5"
            center
            v-model="title"
          ></ui-kit:input>
        </div>
        <div class="z-1 w-121">
          <div class="flex flex-col gap-10">
            <ui-kit:input
              type="text"
              placeholder="Add a short description to your deck."
              v-model="description"
            />
            <div class="flex flex-col gap-8 font-primary text-grey-dark text-xl">
              <div class="flex justify-between items-center">
                <div class="flex gap-2.5 items-center">
                  <ui-kit:icon src="public" class="text-leaf-dark"></ui-kit:icon>
                  Public Deck
                </div>
                <ui-kit:toggle :checked="publicDeck" @click="publicDeck = !publicDeck" />
              </div>
              <div class="flex justify-between items-center">
                <div class="flex gap-2.5 items-center">
                  <ui-kit:icon src="schedule" class="text-leaf-dark"></ui-kit:icon>
                  Spaced Repetition
                </div>
                <ui-kit:toggle :checked="spaced" @click="spaced = !spaced" />
              </div>
              <div class="flex justify-between items-center">
                <div class="flex gap-2.5 items-center">
                  <ui-kit:icon src="music-note" class="text-leaf-dark"></ui-kit:icon>
                  Auto Play Audio
                </div>
                <ui-kit:toggle :checked="audio" @click="audio = !audio" />
              </div>
              <div class="flex justify-between items-center">
                <div class="flex gap-2.5 items-center">
                  <ui-kit:icon src="card-deck" class="text-leaf-dark"></ui-kit:icon>
                  Only Review New Cards
                </div>
                <ui-kit:toggle :checked="newCards" @click="newCards = !newCards" />
              </div>
              <div class="flex gap-2.5 items-center font-light">
                <p v-for="(tag, index) in deck?.tags" :key="index" class="text-grey text-sm">
                  #{{ tag }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          tid="settings-bg"
          class="absolute -inset-x-6 -inset-y-14 bg-(image:--curve-green-bg) rounded-9 z-0"
        ></div>
      </div>
      <div tid="settings-modal-footer" class="flex justify-between items-center">
        <p class="text-grey-dark">
          Created On <span class="text-leaf-dark font-bold">{{ created_at }}</span>
        </p>
        <div class="flex gap-1.5">
          <ui-kit:button variant="muted" icon-left="close" @click="open = false"
            >Cancel</ui-kit:button
          >
          <ui-kit:button icon-left="delete" variant="danger">Delete</ui-kit:button>
          <ui-kit:button icon-left="check">Save</ui-kit:button>
        </div>
      </div>
    </div>
  </ui-kit:modal>
</template>

<script setup lang="ts">
import Card from '@/components/card.vue'
import { computed, ref, type PropType } from 'vue'

const props = defineProps({
  deck: Object as PropType<Deck>
})

const title = ref(props.deck?.title ?? '')
const description = ref(props.deck?.description ?? '')
const publicDeck = ref(props.deck?.is_public ?? false)

const created_at = computed(() => {
  var date = new Date(props.deck?.created_at ?? '')
  return date.toDateString()
})

const open = ref(false)
const spaced = ref(false)
const audio = ref(false)
const newCards = ref(false)
</script>
