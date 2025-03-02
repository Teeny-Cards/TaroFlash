<template>
  <slot name="trigger">
    <TeenyButton icon-left="settings" variant="muted" icon-only @click="open = true"></TeenyButton>
  </slot>
  <TeenyModal :open="open" @close="open = false">
    <div
      tid="deck-settings-modal"
      class="bg-white rounded-16shadow-modal flex flex-col justify-between gap-22 py-10 px-14"
    >
      <div tid="settings-modal-header" class="w-full flex justify-center items-center gap-12">
        <div class="w-30 h-0.75 bg-grey rounded-full"></div>
        <h1 class="text-3xl font-primary text-grey tracking-wider">Deck Settings</h1>
        <div class="w-30 h-0.75 bg-grey rounded-full"></div>
      </div>
      <div tid="settings-modal-body" class="flex gap-16 w-full h-full relative">
        <div class="z-1 max-w-min">
          <TeenyCard size="large" class="bg-blue! ring-white ring-6"></TeenyCard>
          <TeenyInput placeholder="Title" size="large" class="-mt-5" center></TeenyInput>
        </div>
        <div class="z-1 w-121">
          <div class="flex flex-col gap-4">
            <TeenyInput type="text" placeholder="Add a short description to your deck." />
          </div>
        </div>
        <div
          tid="settings-bg"
          class="absolute -inset-x-6 -inset-y-14 bg-(image:--curve-green-bg) rounded-9 z-0"
        ></div>
      </div>
      <div tid="settings-modal-footer" class="flex justify-between items-center">
        <p class="text-grey-dark">
          Created On <span class="text-leaf-dark font-bold">February 28, 2024</span>
        </p>
        <div class="flex gap-1.5">
          <TeenyButton variant="muted" icon-left="close" @click="open = false">Cancel</TeenyButton>
          <TeenyButton icon-left="check">Save</TeenyButton>
          <TeenyButton icon-left="delete" variant="danger">Delete</TeenyButton>
        </div>
      </div>
    </div>
  </TeenyModal>
</template>

<script setup lang="ts">
import TeenyButton from '@teeny/TeenyButton.vue'
import TeenyModal from '@teeny/TeenyModal.vue'
import TeenyCard from '@teeny/TeenyCard.vue'
import TeenyInput from '@teeny/TeenyInput.vue'
import { ref } from 'vue'

const open = ref(false)
</script>
