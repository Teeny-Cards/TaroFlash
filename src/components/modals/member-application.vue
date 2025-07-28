<script setup lang="ts">
import MemberCard from '@/components/modals/member-card.vue'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { DateTime } from 'luxon'
import { type MemberCardTheme } from '@/components/modals/member-card.vue'
import { useAudio } from '@/composables/use-audio'

const { t } = useI18n()
const audio = useAudio()

const created_at = DateTime.now().toISO()
const created_at_formatted = DateTime.fromISO(created_at).toFormat('LLL d, yyyy')

const member_name = ref('')
const card_comment = ref('')
const selected_theme = ref<MemberCardTheme>('green-400')

const themes: MemberCardTheme[] = [
  'green-400',
  'blue-500',
  'purple-500',
  'pink-500',
  'red-500',
  'orange-500'
]

function setTheme(theme: MemberCardTheme) {
  if (theme === selected_theme.value) {
    audio.play('digi_powerdown')
    return
  }

  audio.play('etc_camera_shutter')
  selected_theme.value = theme
}
</script>

<template>
  <div data-testid="member-application" class="drop-shadow-modal grid grid-cols-[auto_auto]">
    <member-card
      :created-at="created_at"
      :display-name="member_name"
      :card-comment="card_comment"
      card-title="Debut Deck Builder"
      :theme="selected_theme"
    />

    <div
      data-testid="member-application__form"
      class="bg-brown-300 rounded-8 border-brown-300 relative flex h-full flex-col gap-6 border-8 px-11 pt-6 pb-9"
    >
      <span
        data-testid="member-application__form__divider"
        class="absolute top-0 -left-2 flex h-full w-1 py-5.5"
      >
        <span class="border-l-brown-500 h-full border-l border-dashed"></span>
      </span>

      <div class="flex flex-col">
        <h1 class="text-brown-700 text-5xl">{{ t('member-application.header') }}</h1>
        <p class="text-brown-700">
          {{ t('member-application.subtitle') }}
        </p>
      </div>

      <div class="grid grid-cols-[1fr_auto] gap-x-12 gap-y-6">
        <ui-kit:input :label="t('member-application.member-name')" v-model:value="member_name" />

        <div class="flex flex-col gap-1.5">
          <span class="text-brown-500">{{ t('member-application.title') }}</span>

          <div class="flex gap-1">
            <ui-kit:tag>Debut</ui-kit:tag>
            <ui-kit:tag>Deck Builder</ui-kit:tag>
          </div>
        </div>

        <ui-kit:input
          :label="t('member-application.card-comment')"
          :placeholder="t('member-card.description-placeholder')"
          class="col-span-2"
          v-model:value="card_comment"
        />

        <div class="col-span-2 flex flex-col gap-1.5">
          <span class="text-brown-500">{{ t('member-application.card-theme') }}</span>

          <div class="flex gap-6">
            <div
              v-for="theme in themes"
              :key="theme"
              class="ring-brown-100 relative h-8.5 w-8.5 cursor-pointer rounded-full ring-4 transition-all duration-75
                hover:scale-110"
              :class="`bg-${theme} text-${theme}`"
              @click="setTheme(theme)"
              @mouseenter="audio.play('click_04')"
            >
              <ui-kit:icon
                src="check"
                v-if="theme === selected_theme"
                class="ring-brown-100 bg-brown-100 absolute -top-1.5 -right-1.5 rounded-full ring-2"
              ></ui-kit:icon>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <span class="text-brown-500">{{ t('member-application.member-id') }}</span>
          <span class="text-brown-700">f4891cc5-0610-4697-bfdf-02a5d9afd3df</span>
        </div>

        <div class="flex flex-col gap-1.5">
          <span class="text-brown-500">{{ t('member-application.registered') }}</span>
          <span class="text-brown-700">{{ created_at_formatted }}</span>
        </div>
      </div>

      <ui-kit:button icon-left="check" class="ring-brown-300 absolute right-8 -bottom-5 ring-7">{{
        t('common.confirm')
      }}</ui-kit:button>
    </div>
  </div>
</template>
