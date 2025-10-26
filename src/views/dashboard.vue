<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { fetchMemberDecks } from '@/api/decks'
import { useToastStore } from '@/stores/toast'
import Deck from '@/components/deck.vue'
import { useRouter } from 'vue-router'
import deckSettings from '@/components/modals/deck-settings/index.vue'
import MemberApplication from '@/components/modals/member-application.vue'
import { useModal } from '@/composables/modal'
import { useMemberStore } from '@/stores/member'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const toastStore = useToastStore()
const router = useRouter()
const memberStore = useMemberStore()

const modal = useModal()
const loading = ref(true)
const decks = ref<Deck[]>([])

onMounted(async () => {
  await refetchDecks()
  loading.value = false

  if (!memberStore.has_member) {
    modal.open(MemberApplication, {
      backdrop: true,
      openAudio: 'double-pop-up',
      closeAudio: 'double-pop-down'
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
    toastStore.error(e.message)
  }
}

function onDeckClicked(deck: Deck) {
  router.push({ name: 'deck', params: { id: deck.id } })
}

async function onCreateDeckClicked() {
  const deck_created = await modal.open(deckSettings, { backdrop: true })

  if (deck_created) {
    await refetchDecks()
  }
}
</script>

<template>
  <div data-testid="dashboard" class="flex h-full flex-col gap-16">
    <div class="flex flex-col gap-4">
      <h1 class="text-grey-700 text-3xl">{{ t('dashboard.due') }}</h1>
      <div class="flex gap-4">
        <Deck
          v-for="(deck, index) in due_decks"
          :key="index"
          :deck="deck"
          @clicked="() => onDeckClicked(deck)"
          @updated="refetchDecks"
        />
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <h1 class="text-grey-700 text-3xl">{{ t('dashboard.all') }}</h1>
      <div class="flex gap-4">
        <Deck
          v-for="(deck, index) in decks"
          :key="index"
          :deck="deck"
          @clicked="() => onDeckClicked(deck)"
          @updated="refetchDecks"
        />
      </div>
      <ui-kit:button icon-left="add" @click="onCreateDeckClicked">
        {{ t('dashboard.create-deck') }}
      </ui-kit:button>
    </div>
  </div>
</template>
