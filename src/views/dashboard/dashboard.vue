<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { fetchMemberDecks } from '@/api/decks'
import { fetchMemberCardCount } from '@/api/cards'
import { useToast } from '@/composables/toast'
import Deck from '@/components/deck.vue'
import { useRouter } from 'vue-router'
import deckSettings from '@/components/modals/deck-settings/index.vue'
import { useModal } from '@/composables/modal'
import { emitSfx } from '@/sfx/bus'
import { useI18n } from 'vue-i18n'
import UiButton from '@/components/ui-kit/button.vue'
import { useMediaQuery } from '@/composables/use-media-query'
import ReviewInbox from './review-inbox.vue'

const { t } = useI18n()
const toast = useToast()
const router = useRouter()
const is_md = useMediaQuery('md')

const modal = useModal()
const loading = ref(true)
const decks = ref<Deck[]>([])
const due_card_count = ref(0)

onMounted(async () => {
  await refetchDecks()
  due_card_count.value = await fetchMemberCardCount({ only_due_cards: true })
  loading.value = false
})

const due_decks = computed(() => {
  return decks.value.filter((deck) => (deck.due_count ?? 0) > 0)
})

async function refetchDecks() {
  try {
    decks.value = await fetchMemberDecks()
  } catch (e: any) {
    toast.error(e.message)
  }
}

function onDeckClicked(deck: Deck) {
  router.push({ name: 'deck', params: { id: deck.id } })
}

async function onCreateDeckClicked() {
  emitSfx('ui.double_pop_up')
  const { response: deck_created } = modal.open(deckSettings, { backdrop: true })
  deck_created.then(() => emitSfx('ui.double_pop_down'))

  if (await deck_created) {
    await refetchDecks()
  }
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
      class="max-md:row-start-2 text-brown-700 dark:text-brown-300 text-4xl self-end relative text-nowrap w-min after:absolute after:-right-2 after:bottom-0 after:-left-2 after:rounded-1.5 after:h-4 after:-z-1 after:bg-brown-300"
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
        @updated="refetchDecks"
      />
    </div>
  </div>
</template>
