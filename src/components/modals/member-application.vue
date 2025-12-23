<script setup lang="ts">
import MemberCard from '@/components/modals/member-card.vue'
import { useI18n } from 'vue-i18n'
import { reactive, ref } from 'vue'
import { DateTime } from 'luxon'
import { upsertMember } from '@/api/members'
import { useSessionStore } from '@/stores/session'
import UiInput from '@/components/ui-kit/input.vue'
import UiButton from '@/components/ui-kit/button.vue'
import UiTag from '@/components/ui-kit/tag.vue'
import UiIcon from '@/components/ui-kit/icon.vue'
import { emitSfx } from '@/sfx/bus'

const { close } = defineProps<{
  close: (response?: boolean) => void
}>()

const { t } = useI18n()
const sessionStore = useSessionStore()

const created_at = DateTime.now().toISO()
const created_at_formatted = DateTime.fromISO(created_at).toFormat('LLL d, yyyy')

const member = reactive<Member>({
  display_name: '',
  description: '',
  id: sessionStore.user_id
})

const selected_theme = ref<MemberTheme>('green-400')

const themes: MemberTheme[] = [
  'green-400',
  'blue-500',
  'purple-500',
  'pink-500',
  'red-500',
  'orange-500'
]

function setTheme(theme: MemberTheme) {
  if (theme === selected_theme.value) {
    emitSfx('ui.digi_powerdown')
    return
  }

  emitSfx('ui.etc_camera_shutter')
  selected_theme.value = theme
}

async function onConfirm() {
  await upsertMember(member)
  close(true)
}
</script>

<template>
  <div data-testid="member-application" class="drop-shadow-lg grid grid-cols-[auto_auto]">
    <member-card
      :created-at="created_at"
      :display-name="member.display_name"
      :card-comment="member.description"
      card-title="Debut Deck Builder"
      :theme="selected_theme"
    />

    <div
      data-testid="member-application__form"
      class="bg-brown-300 rounded-8 border-brown-300 relative flex h-full flex-col gap-6 border-8
        px-11 pt-6 pb-9"
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
        <ui-input
          :label="t('member-application.member-name')"
          v-model:value="member.display_name"
        />

        <div class="flex flex-col gap-1.5">
          <span class="text-brown-500">{{ t('member-application.title') }}</span>

          <div class="flex gap-1">
            <ui-tag>Debut</ui-tag>
            <ui-tag>Deck Builder</ui-tag>
          </div>
        </div>

        <ui-input
          :label="t('member-application.card-comment')"
          :placeholder="t('member-card.description-placeholder')"
          class="col-span-2"
          v-model:value="member.description"
        />

        <div class="col-span-2 flex flex-col gap-1.5">
          <span class="text-brown-500">{{ t('member-application.card-theme') }}</span>

          <div class="flex gap-6">
            <div
              v-for="theme in themes"
              :key="theme"
              class="ring-brown-100 relative h-8.5 w-8.5 cursor-pointer rounded-full ring-4
                transition-all duration-75 hover:scale-110"
              :class="`bg-${theme} text-${theme}`"
              @click="setTheme(theme)"
              @mouseenter="audio.play('ui.click_04')"
            >
              <ui-icon
                src="check"
                v-if="theme === selected_theme"
                class="ring-brown-100 bg-brown-100 absolute -top-1.5 -right-1.5 rounded-full ring-2"
              ></ui-icon>
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

      <ui-button
        icon-left="check"
        class="ring-brown-300 absolute right-8 -bottom-5 ring-7"
        @click="onConfirm"
        >{{ t('common.confirm') }}</ui-button
      >
    </div>
  </div>
</template>
