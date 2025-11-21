<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { DateTime } from 'luxon'
import UiImage from '@/components/ui-kit/image.vue'

const { t } = useI18n()

const { createdAt = DateTime.now().toISO(), theme = 'green-400' } = defineProps<{
  createdAt: string
  displayName?: string
  cardComment?: string
  cardTitle: string
  theme: MemberTheme
}>()

const created_on = computed(() => {
  return DateTime.fromISO(createdAt).toFormat('LLL d, yyyy')
})
</script>

<template>
  <div
    data-testid="member-card"
    class="bg-brown-300 rounded-8 border-brown-300 flex w-89 flex-col overflow-hidden border-8 shadow-modal"
  >
    <div data-testid="member-card__header" class="flex items-center justify-center px-9 pt-6 pb-2">
      <h1 class="text-brown-700 text-5xl">{{ t('member-card.header') }}</h1>
    </div>
    <div
      data-testid="member-card__body"
      class="wave-top flex h-full flex-col items-center gap-4.5 bg-(image:--bank-note) bg-size-(--bg-sm) px-8
        pt-9 pb-3"
      :class="`bg-${theme}`"
    >
      <div data-testid="member-card__avatar" class="flex h-full flex-col justify-center">
        <div class="bg-brown-300 rounded-19 border-brown-300 h-50 w-50 overflow-hidden border-10">
          <ui-image src="_default" class="h-full w-full" />
        </div>
      </div>

      <div type="text" class="bg-brown-300 text-brown-500 ring-brown-300 rounded-2 w-full ring-8">
        {{ cardComment || t('member-card.description-placeholder') }}
      </div>

      <div class="flex w-full flex-col gap-2">
        <div class="flex flex-col">
          <p class="text-brown-700 pb-1 text-xl">{{ displayName || 'Member Name' }}</p>
          <div class="bg-brown-300 h-0.25 w-full"></div>
          <p class="text-brown-100 text-sm">{{ t('member-card.member') }}</p>
        </div>
        <div class="flex flex-col">
          <p class="text-brown-700 pb-1 text-xl">{{ cardTitle || 'Title' }}</p>
          <div class="bg-brown-300 h-0.25 w-full"></div>
          <p class="text-brown-100 text-sm">{{ t('member-card.title') }}</p>
        </div>
      </div>

      <div
        data-testid="member-card__registration"
        class="align-center text-brown-700 flex w-full justify-between text-sm font-semibold"
      >
        <p>{{ t('member-card.registration', { date: created_on }) }}</p>
        <p>&lt; &lt; &lt; &lt; &lt; &lt; &lt; &lt; &lt; &lt; &lt; &lt; &lt;</p>
      </div>
    </div>
  </div>
</template>
