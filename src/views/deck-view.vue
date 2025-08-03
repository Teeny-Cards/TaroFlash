<script setup lang="ts">
import OverviewPanel from '@/components/views/deck-view/overview-panel.vue'
import { onMounted, ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { fetchDeck } from '@/services/deck-service'
import StudyModal from '@/components/modals/study-modal/index.vue'
import CardList from '@/components/views/deck-view/card-list/index.vue'
import CardGrid from '@/components/views/deck-view/card-grid.vue'
import { useI18n } from 'vue-i18n'
import { useCardEditor } from '@/composables/use-card-editor'
import { useAlert } from '@/composables/use-alert'
import { useModal } from '@/composables/use-modal'
import { useDeckEditor } from '@/composables/use-deck-editor'
import { useAudio } from '@/composables/use-audio'
import ContextualButtons from '@/components/views/deck-view/contextual-buttons.vue'

const { id: deck_id } = defineProps<{
  id: string
}>()

const { t } = useI18n()
const modal = useModal()
const alert = useAlert()
const audio = useAudio()

const image_url = ref<string | undefined>()
const deck = ref<Deck>()
const active_tab = ref(0)
const mode = ref<'edit' | 'view' | 'select'>('view')

const {
  edited_cards,
  active_card_id,
  selected_card_ids,
  all_cards_selected,
  is_dirty,
  addCard,
  deleteCards,
  updateCard,
  toggleSelectCard,
  selectCard,
  setActiveCard,
  resetCards,
  saveCards,
  toggleSelectAll,
  clearSelectedCards
} = useCardEditor(deck.value?.cards ?? [], Number(deck_id))

const tabs = [
  {
    label: t('deck-view.tabs.list-view'),
    icon: 'list'
  },
  {
    label: t('deck-view.tabs.card-view'),
    icon: 'teeny-cards'
  }
]

const tab_components: { [key: number]: any } = {
  0: CardList,
  1: CardGrid
}

onMounted(async () => {
  await refetchDeck()
})

onBeforeRouteLeave(async () => {
  if (is_dirty.value) {
    const { response } = alert.warn({
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

async function onSaveClicked() {
  await saveCards()
  await refetchDeck()
  mode.value = 'view'
}

async function refetchDeck() {
  try {
    deck.value = await fetchDeck(Number(deck_id))
    image_url.value = useDeckEditor(deck.value).image_url.value
    resetCards(deck.value.cards)
  } catch (e: any) {
    // TODO
  }
}

function onCancel() {
  resetCards()
  clearSelectedCards()
  mode.value = 'view'
}

async function onDeleteCard(id?: number) {
  const { response: confirmed } = alert.warn({
    title: t('alert.delete-card'),
    message: t('alert.delete-card.message'),
    confirmLabel: t('common.delete')
  })

  if (await confirmed) {
    selectCard(id)
    await deleteCards()
    await refetchDeck()

    audio.play('trash_crumple_short')
  }
}

function onSelectCard(id?: number) {
  toggleSelectCard(id)
  mode.value = 'select'
}

function onCardActivated(id?: number) {
  if (mode.value === 'view') {
    mode.value = 'edit'
    audio.play('etc_camera_reel')
  }

  activateCard(id)
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
      <div class="flex w-full justify-between">
        <ui-kit:tabs
          :tabs="tabs"
          v-model:activeTab="active_tab"
          class="pb-4"
          storage-key="deck-view-tabs"
        />

        <contextual-buttons
          :mode="mode"
          :is-dirty="is_dirty"
          :all-selected="all_cards_selected"
          @edit="mode = 'edit'"
          @cancelled="onCancel"
          @saved="onSaveClicked"
          @all-selected="toggleSelectAll"
        />
      </div>

      <ui-kit:divider />

      <component
        :is="tab_components[active_tab]"
        :cards="edited_cards"
        :active-card-id="active_card_id"
        :selected-card-ids="selected_card_ids"
        :mode="mode"
        @card-added="addCard"
        @card-updated="updateCard"
        @card-activated="setActiveCard"
        @card-selected="onSelectCard"
        @card-deleted="onDeleteCard"
      />
    </div>
  </section>
</template>
