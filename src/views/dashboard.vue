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
    backdrop: true
  })

  if (await deck_created) {
    await refetchDecks()
  }
}
</script>

<template>
  <div data-testid="dashboard" class="flex h-full flex-col gap-16 pb-12">
    <div class="flex flex-col gap-1.5">
      <h1 class="text-brown-700 dark:text-brown-300 text-3xl">
        {{ t('dashboard.due') }} ({{ due_card_count }})
      </h1>
      <div class="flex gap-2 overflow-y-auto pt-2.5">
        <Deck
          v-for="(deck, index) in due_decks"
          :key="index"
          :deck="deck"
          :size="is_md ? 'sm' : 'xs'"
          due
          @click="onDeckClicked(deck)"
          @updated="refetchDecks"
        />
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <h1 class="text-brown-700 dark:text-brown-300 text-3xl">{{ t('dashboard.all') }}</h1>
      <div class="flex gap-x-4 gap-y-8 flex-wrap">
        <Deck
          v-for="(deck, index) in decks"
          :key="index"
          :deck="deck"
          :size="is_md ? 'base' : 'sm'"
          @click="onDeckClicked(deck)"
          @updated="refetchDecks"
        />
      </div>
      <ui-button icon-left="add" @click="onCreateDeckClicked">
        {{ t('dashboard.create-deck') }}
      </ui-button>
    </div>
  </div>
</template>
