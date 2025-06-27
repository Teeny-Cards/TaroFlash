<script setup lang="ts">
import OverviewPanel from '@/components/deck-view/overview-panel.vue'
import { onMounted, ref } from 'vue'
import { fetchDeckById } from '@/services/deckService'
import StudyModal from '@/components/study-modal/index.vue'
import CardList from '@/components/deck-view/card-list/index.vue'

const { id: deck_id } = defineProps<{
  id: string
}>()

const deck = ref<Deck>()
const studyModalOpen = ref(false)

onMounted(async () => {
  try {
    const id = Number(deck_id)
    deck.value = await fetchDeckById(id)
  } catch (e: any) {
    //
  }
})
</script>

<template>
  <section data-testid="deck-view" class="flex gap-15">
    <overview-panel v-if="deck" :deck="deck" @study-clicked="studyModalOpen = true" />
    <card-list v-if="deck" :deck="deck" />
  </section>

  <study-modal v-if="deck" :open="studyModalOpen" :deck="deck" @closed="studyModalOpen = false" />
</template>
