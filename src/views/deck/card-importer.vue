<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
// import { getCards } from '@/cards'
import UiButton from '@/components/ui-kit/button.vue'
import CardRecord from '@/utils/card-record'
import Card from '@/components/card/index.vue'
import { upsertCards } from '@/api/cards'

const saving = ref(false)
const delimiter = ref<string>('::')
const raw_text = ref<string>('')
const cards = ref<CardRecord[]>([])

const { deck_id } = defineProps<{ deck_id: number }>()

onMounted(() => {
  // raw_text.value = getCards().join('\n')
})

const has_unsaved_changes = computed(() => {
  return cards.value.some((card) => card.has_temp_id)
})

async function onImport() {
  const lines = raw_text.value.split('\n')

  const parsed = lines.map((line) => {
    const [front, back] = line.split(delimiter.value)

    return {
      front_text: front.trim(),
      back_text: back.trim(),
      deck_id
    }
  })

  cards.value = parsed.map((card) => CardRecord.create(card))
}

async function onSave() {
  if (cards.value.length <= 0 || saving.value) return

  saving.value = true

  const payload = cards.value.map((card) => card.buildUpsertPayload())
  await upsertCards(payload)

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
        <ui-button @click="onImport">Import</ui-button>
      </div>

      <div class="w-full flex flex-col gap-2">
        <div class="flex flex-col gap-2 w-full h-200 overflow-auto">
          <div v-for="card in cards" class="flex gap-2">
            <Card v-bind="card" side="front" size="lg" />
            <Card v-bind="card" side="back" size="lg" />
          </div>
        </div>
        <ui-button @click="onSave" :disabled="!has_unsaved_changes">{{
          saving ? 'Saving...' : 'Save'
        }}</ui-button>
      </div>
    </div>
  </div>
</template>
