<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import UiButton from '@/components/ui-kit/button.vue'
import Card from '@/components/card/index.vue'
import { useBulkInsertCardsInDeckMutation } from '@/api/cards'
import { type CardListController } from '@/composables/card-editor/card-list-controller'

type CardDraft = { front_text: string; back_text: string }

const saving = ref(false)
const delimiter = ref<string>('::')
const raw_text = ref<string>('')
const cards = ref<CardDraft[]>([])
const bulk_insert_mutation = useBulkInsertCardsInDeckMutation()

const { deck_id } = inject<CardListController>('card-editor')!

const has_unsaved_changes = computed(() => cards.value.length > 0)

function onImport() {
  cards.value = raw_text.value.split('\n').map((line) => {
    const [front, back] = line.split(delimiter.value)
    return {
      front_text: front.trim(),
      back_text: back.trim()
    }
  })
}

async function onSave() {
  if (!has_unsaved_changes.value || saving.value) return

  saving.value = true
  if (deck_id.value === undefined) return
  await bulk_insert_mutation.mutateAsync({ deck_id: deck_id.value, cards: cards.value })
  saving.value = false
  cards.value = []
}
</script>

<template>
  <div class="flex flex-col gap-4 py-4 w-full">
    <div class="w-full flex gap-4">
      <div class="w-full">
        <textarea
          class="p-6 w-full h-200 bg-white outline-1 outline-blue-500 rounded-4 resize-none text-brown-700"
          v-model="raw_text"
        />
        <ui-button data-theme="blue-500" @click="onImport">Import</ui-button>
      </div>

      <div class="w-full flex flex-col gap-2">
        <div class="flex flex-col gap-2 w-full h-200 overflow-auto">
          <div v-for="(card, i) in cards" :key="i" class="flex gap-2">
            <Card v-bind="card" side="front" size="lg" />
            <Card v-bind="card" side="back" size="lg" />
          </div>
        </div>
        <ui-button data-theme="blue-500" @click="onSave" :disabled="!has_unsaved_changes">{{
          saving ? 'Saving...' : 'Save'
        }}</ui-button>
      </div>
    </div>
  </div>
</template>
