<template>
  <div class="flex h-full flex-col gap-4">
    <h1 class="text-grey-dark text-2xl font-semibold">{{ $t('dashboard.due') }}</h1>
    <div class="flex gap-4">
      <div v-if="loading">{{ $t('common.loading') }}</div>
      <div v-else v-for="(deck, index) in decks" :key="index">
        <Deck :deck="deck" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchMemberDecks } from '@/services/deckService'
import { useToastStore } from '@/stores/toast'
import Deck from '@/components/deck.vue'
import { useMemberStore } from '@/stores/member'

const loading = ref(true)
const toastStore = useToastStore()
const decks = ref<Deck[]>([])
const memberStore = useMemberStore()

onMounted(async () => {
  try {
    decks.value = await fetchMemberDecks(memberStore.id)
    loading.value = false
  } catch (e: any) {
    toastStore.error(e.message)
  }
})
</script>
