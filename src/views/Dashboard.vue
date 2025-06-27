<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { fetchMemberDecks } from '@/services/deckService'
import { useToastStore } from '@/stores/toast'
import Deck from '@/components/deck.vue'
import { useMemberStore } from '@/stores/member'
import { useRouter } from 'vue-router'

const loading = ref(true)
const toastStore = useToastStore()
const decks = ref<Deck[]>([])
const memberStore = useMemberStore()
const router = useRouter()

onMounted(async () => {
  try {
    if (!memberStore.id) {
      return
    }

    decks.value = await fetchMemberDecks(memberStore.id)
    loading.value = false
  } catch (e: any) {
    toastStore.error(e.message)
  }
})

const due_decks = computed(() => {
  return decks.value.filter((deck) => deck.due_cards?.length ?? 0 > 0)
})

function onDeckClicked(deck: Deck) {
  router.push({ name: 'deck', params: { id: deck.id } })
}
</script>

<template>
  <div class="flex h-full flex-col gap-16">
    <div class="flex flex-col gap-4">
      <h1 class="text-grey-dark text-3xl">{{ $t('dashboard.due') }}</h1>
      <div class="flex gap-4">
        <Deck
          v-for="(deck, index) in due_decks"
          :key="index"
          :deck="deck"
          @clicked="() => onDeckClicked(deck)"
        />
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <h1 class="text-grey-dark text-3xl">All Decks</h1>
      <div class="flex gap-4">
        <Deck
          v-for="(deck, index) in decks"
          :key="index"
          :deck="deck"
          @clicked="() => onDeckClicked(deck)"
        />
      </div>
    </div>
  </div>
</template>
