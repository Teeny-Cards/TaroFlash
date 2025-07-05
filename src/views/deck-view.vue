<script setup lang="ts">
import OverviewPanel from '@/components/deck-view/overview-panel.vue'
import { onMounted, ref } from 'vue'
import { fetchDeckById } from '@/services/deck-service'
import StudyModal from '@/components/study-modal/index.vue'
import CardList from '@/components/deck-view/card-list/index.vue'
import { useI18n } from 'vue-i18n'
import { useEditableCards } from '@/composables/use-editable-cards'
import { updateCards, deleteCardsById } from '@/services/card-service'
import confirmationAlert from '@/components/confirmation-alert.vue'

const { t } = useI18n()

const { id: deck_id } = defineProps<{
  id: string
}>()

const deck = ref<Deck>()
const studyModalOpen = ref(false)
const editing = ref(false)
const deleteCardConfirmationOpen = ref(false)
const cardsToDelete = ref<number[]>([])
let cardEdits: ReturnType<typeof useEditableCards> | undefined

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

    cardEdits = useEditableCards(deck.value.cards ?? [], deck.value.id)
  } catch (e: any) {
    // TODO
  }
})

async function saveEdits() {
  const changed = cardEdits?.getChangedCards()
  if (!changed) return

  if (changed.length > 0) {
    try {
      await updateCards(changed)
      await refetchCards()
      editing.value = false
    } catch (e: any) {
      // TODO
    }
  }
}

async function refetchCards() {
  try {
    deck.value = await fetchDeckById(Number(deck_id))
    cardEdits = useEditableCards(deck.value.cards ?? [], deck.value.id)
  } catch (e: any) {
    // TODO
  }
}

function discardEdits() {
  cardEdits?.resetChanges()
  editing.value = false
}

function selectCard(id: number) {
  // cardEdits?.selectCard(id)
}

function deleteCards(ids: number[]) {
  cardsToDelete.value = ids
  deleteCardConfirmationOpen.value = true
}

async function confirmDeleteCards() {
  await deleteCardsById(cardsToDelete.value)
  await refetchCards()

  cardsToDelete.value = []
  deleteCardConfirmationOpen.value = false
}

function cancelDeleteCards() {
  cardsToDelete.value = []
  deleteCardConfirmationOpen.value = false
}
</script>

<template>
  <section data-testid="deck-view" class="flex h-full items-start gap-15 pt-12">
    <overview-panel v-if="deck" :deck="deck" @study-clicked="studyModalOpen = true" />

    <div class="relative w-full">
      <ui-kit:tabs :tabs="tabs" class="pb-4">
        <template #actions>
          <ui-kit:button
            v-if="!editing"
            icon-only
            icon-left="edit"
            size="xs"
            @click="editing = true"
          ></ui-kit:button>

          <div class="flex gap-1.5">
            <ui-kit:button
              v-if="editing"
              icon-only
              icon-left="close"
              size="xs"
              variant="danger"
              @click="discardEdits"
            ></ui-kit:button>

            <ui-kit:button
              v-if="editing"
              icon-only
              icon-left="check"
              size="xs"
              @click="saveEdits()"
              :disabled="!cardEdits?.isDirty"
            ></ui-kit:button>
          </div>
        </template>
      </ui-kit:tabs>

      <ui-kit:divider />

      <card-list
        v-if="deck"
        :cards="cardEdits?.editedCards ?? []"
        :editing="editing"
        @updated="cardEdits?.updateCard"
        @add-card="cardEdits?.addCard"
        @cards-deleted="deleteCards"
      />
    </div>
  </section>

  <study-modal v-if="deck" :open="studyModalOpen" :deck="deck" @closed="studyModalOpen = false" />

  <confirmation-alert
    :open="deleteCardConfirmationOpen"
    :confirm-label="$t('common.delete')"
    @confirm="confirmDeleteCards"
    @cancel="cancelDeleteCards"
  />
</template>
