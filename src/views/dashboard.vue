<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { fetchMemberDecks } from '@/api/decks'
import { fetchMemberCardCount } from '@/api/cards'
import { useToast } from '@/composables/toast'
import Deck from '@/components/deck.vue'
import { useRouter } from 'vue-router'
import deckSettings, {
  type DeckSettingsResponse
} from '@/components/modals/deck-settings/index.vue'
import MemberApplication from '@/components/modals/member-application.vue'
import { useModal } from '@/composables/modal'
import { useMemberStore } from '@/stores/member'
import { useI18n } from 'vue-i18n'
import UiButton from '@/components/ui-kit/button.vue'
import { useMediaQuery } from '@/composables/use-media-query'

const { t } = useI18n()
const toast = useToast()
const router = useRouter()
const member_store = useMemberStore()
const is_md = useMediaQuery('md')

const modal = useModal()
const loading = ref(true)
const decks = ref<Deck[]>([])
const due_card_count = ref(0)

onMounted(async () => {
  await refetchDecks()
  due_card_count.value = await fetchMemberCardCount({ only_due_cards: true })
  loading.value = false

  if (!member_store.has_member) {
    modal.open(MemberApplication, {
      backdrop: true,
      openAudio: 'ui.double_pop_up',
      closeAudio: 'ui.double_pop_down'
    })
  }
})

const due_decks = computed(() => {
  return decks.value.filter((deck) => deck.due_count ?? 0 > 0)
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
  const { response: deck_created } = modal.open<DeckSettingsResponse>(deckSettings, {
    backdrop: true,
    openAudio: 'ui.double_pop_up',
    closeAudio: 'ui.double_pop_down'
  })

  if (await deck_created) {
    await refetchDecks()
  }
}
</script>

<template>
  <div
    data-testid="dashboard"
    class="grid grid-cols-[345px_1fr] grid-rows-[auto_1fr] gap-x-15.5 gap-y-11.5 h-full pb-12"
  >
    <ui-button icon-left="add" class="w-full!" size="xl" @click="onCreateDeckClicked">
      {{ t('dashboard.create-deck') }}
    </ui-button>
    <h1 class="text-brown-700 dark:text-brown-300 text-4xl self-end">{{ t('dashboard.all') }}</h1>
    <div class="flex gap-x-4 gap-y-8 flex-wrap col-start-2">
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
