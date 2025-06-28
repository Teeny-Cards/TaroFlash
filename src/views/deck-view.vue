<script setup lang="ts">
import OverviewPanel from '@/components/deck-view/overview-panel.vue'
import { onMounted, ref } from 'vue'
import { fetchDeckById } from '@/services/deckService'
import StudyModal from '@/components/study-modal/index.vue'
import CardList from '@/components/deck-view/card-list/index.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { id: deck_id } = defineProps<{
  id: string
}>()

const deck = ref<Deck>()
const studyModalOpen = ref(false)
const editing = ref(true)

const tabs = [
  {
    label: t('deck-view.tabs.list-view'),
    icon: 'list'
  },
  {
    label: t('deck-view.tabs.card-view')
  }
]

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
  <section data-testid="deck-view" class="flex h-full items-start gap-15 pt-12">
    <overview-panel v-if="deck" :deck="deck" @study-clicked="studyModalOpen = true" />

    <div class="w-full">
      <ui-kit:tabs :tabs="tabs" class="pb-4">
        <template #actions>
          <ui-kit:button icon-only icon-left="edit" size="xs"></ui-kit:button>
        </template>
      </ui-kit:tabs>

      <ui-kit:divider />

      <card-list v-if="deck" :deck="deck" :editing="editing" />
    </div>
  </section>

  <study-modal v-if="deck" :open="studyModalOpen" :deck="deck" @closed="studyModalOpen = false" />
</template>
