<script setup lang="ts">
import OverviewPanel from '@/components/views/deck-view/overview-panel.vue'
import { onMounted, ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { fetchDeck } from '@/services/deck-service'
import StudyModal from '@/components/modals/study-modal/index.vue'
import CardList from '@/components/views/deck-view/card-list/index.vue'
import { useI18n } from 'vue-i18n'
import { useEditableCards } from '@/composables/use-editable-cards'
import { updateCards, deleteCardsById } from '@/services/card-service'
import { useAlert } from '@/composables/use-alert'
import { useModal } from '@/composables/use-modal'
import { useDeckConfiguration } from '@/composables/use-deck-configuration'

const { id: deck_id } = defineProps<{
  id: string
}>()

const { t } = useI18n()
const modal = useModal()
const alert = useAlert()

const image_url = ref<string | undefined>()
const deck = ref<Deck>()
const editing = ref(false)
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
    await refetchDeck()
  } catch (e: any) {
    // TODO
  }
})

onBeforeRouteLeave(async () => {
  if (cardEdits?.isDirty.value) {
    const { response } = alert.info({
      title: t('alert.leave-page'),
      message: t('alert.leave-page.message'),
      confirmLabel: t('common.leave'),
      cancelLabel: t('alert.leave-page.stay')
    })

    return await response
  }
})

function onStudyClicked() {
  modal.open(StudyModal, {
    props: {
      deck: deck.value!
    }
  })
}

async function saveEdits() {
  const changed = cardEdits?.getChangedCards()
  if (!changed) return

  if (changed.length > 0) {
    try {
      await updateCards(changed)
      await refetchDeck()
      editing.value = false
    } catch (e: any) {
      // TODO
    }
  }
}

async function refetchDeck() {
  try {
    deck.value = await fetchDeck(Number(deck_id))
    cardEdits = useEditableCards(deck.value.cards ?? [], deck.value.id)
    image_url.value = useDeckConfiguration(deck.value).image_url.value
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

async function deleteCards(ids: number[]) {
  const count = ids.length
  if (!count) return

  const { response: confirmed } = alert.warn({
    title: t('alert.delete-card', { count }),
    message: t('alert.delete-card.message', { count }),
    confirmLabel: t('common.delete')
  })

  if (await confirmed) {
    await deleteCardsById(ids)
    await refetchDeck()
  }
}

function onAddCard() {
  editing.value = true
  cardEdits?.addCard()
}
</script>

<template>
  <section data-testid="deck-view" class="flex h-full items-start gap-15 pt-12">
    <overview-panel
      v-if="deck"
      :deck="deck"
      :image-url="image_url"
      @study-clicked="onStudyClicked"
      @updated="refetchDeck()"
    />

    <div class="relative flex h-full w-full flex-col">
      <ui-kit:tabs :tabs="tabs" class="pb-4">
        <template #actions>
          <ui-kit:button v-if="!editing" icon-left="edit" @click="editing = true">
            {{ t('common.edit') }}
          </ui-kit:button>

          <div v-else class="flex gap-1.5">
            <ui-kit:button icon-left="close" variant="danger" @click="discardEdits">
              {{ t('common.cancel') }}
            </ui-kit:button>

            <ui-kit:button icon-left="check" @click="saveEdits()" :disabled="!cardEdits?.isDirty">
              {{ t('common.save') }}
            </ui-kit:button>
          </div>
        </template>
      </ui-kit:tabs>

      <ui-kit:divider />

      <card-list
        v-if="deck"
        :cards="cardEdits?.editedCards ?? []"
        :editing="editing"
        @updated="cardEdits?.updateCard"
        @add-card="onAddCard"
        @cards-deleted="deleteCards"
      />
    </div>
  </section>
</template>
