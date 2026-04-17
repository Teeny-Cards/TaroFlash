<script setup lang="ts">
import { computed, watch } from 'vue'
import { useMemberDecksQuery } from '@/api/decks'
import { useToast } from '@/composables/toast'
import Deck from '@/components/deck.vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import UiButton from '@/components/ui-kit/button.vue'
import { useMediaQuery } from '@/composables/use-media-query'
import ReviewInbox from './review-inbox.vue'
import { useDeckSettingsModal } from '@/composables/modals/use-deck-settings-modal'
import { useAlert } from '@/composables/alert'
import { useCan } from '@/composables/use-can'

const { t } = useI18n()
const toast = useToast()
const alert = useAlert()
const can = useCan()
const router = useRouter()
const is_md = useMediaQuery('md')

const deck_settings_modal = useDeckSettingsModal()
const { data: decks_data, error: decks_error } = useMemberDecksQuery()
const decks = computed(() => decks_data.value ?? [])
watch(decks_error, (err) => {
  if (err) toast.error(err.message)
})

const due_decks = computed(() => {
  return decks.value.filter((deck) => (deck.due_count ?? 0) > 0)
})

function onDeckClicked(deck: Deck) {
  router.push({ name: 'deck', params: { id: deck.id } })
}

function onCreateDeckClicked() {
  if (!can.createDeck(decks.value.length)) {
    alert.warn({
      title: t('errors.deck-limit-reached.title'),
      message: t('errors.deck-limit-reached.message')
    })
    return
  }

  deck_settings_modal.open()
}
</script>

<template>
  <div
    data-testid="dashboard"
    class="grid grid-cols-[1fr] md:grid-cols-[345px_1fr] md:grid-rows-[auto_1fr] gap-x-15.5 gap-y-6 md:gap-y-11.5 h-full pb-12"
  >
    <ui-button
      icon-left="add"
      class="w-full! max-md:row-start-4"
      size="xl"
      @click="onCreateDeckClicked"
    >
      {{ t('dashboard.create-deck') }}
    </ui-button>

    <h1
      class="max-md:row-start-2 text-brown-700 dark:text-brown-300 text-4xl self-end relative text-nowrap w-min after:absolute after:-right-2 after:bottom-0 after:-left-2 after:rounded-1.5 after:h-4 after:-z-1 after:bg-brown-300 dark:after:bg-grey-700"
    >
      {{ t('dashboard.all') }}
    </h1>

    <review-inbox :due_decks="due_decks" />

    <div class="flex gap-x-6.5 gap-y-8 flex-wrap md:col-start-2">
      <Deck
        v-for="(deck, index) in decks"
        :key="index"
        :deck="deck"
        :size="is_md ? 'base' : 'sm'"
        @click="onDeckClicked(deck)"
      />
    </div>
  </div>
</template>
