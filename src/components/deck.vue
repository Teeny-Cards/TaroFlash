<script setup lang="ts">
import Card from '@/components/card/index.vue'
import UiButton from '@/components/ui-kit/button.vue'
import StudyModal from './modals/study-session/index.vue'
import { useModal } from '@/composables/modal'
import { useI18n } from 'vue-i18n'

const { deck, size = 'base' } = defineProps<{
  deck: Deck
  size?: 'xs' | 'sm' | 'base'
  due?: boolean
}>()

const { t } = useI18n()
const modal = useModal()

function onStudyClicked() {
  modal.open(StudyModal, {
    backdrop: true,
    props: {
      deck
    },
    openAudio: 'ui.double_pop_up',
    closeAudio: 'ui.double_pop_down'
  })
}
</script>

<template>
  <div data-testid="deck" class="relative flex w-max flex-col gap-2.5 group">
    <card :size="size" class="relative cursor-pointer" :sfx="{ hover: 'ui.click_04' }">
      <div
        v-if="due && deck.due_count"
        class="outline-brown-100 dark:outline-grey-900 absolute -top-2 -right-2 flex h-7.5 w-7.5
          items-center justify-center rounded-full bg-red-500 outline-4"
      >
        <h2 class="text-base text-white">{{ deck.due_count }}</h2>
      </div>

      <!-- <div
        v-if="due"
        class="hidden absolute h-full w-full group-hover:flex pointer-coarse:flex justify-center
          items-center"
      >
        <ui-button icon-left="play" @click.stop="onStudyClicked" theme="brown" icon-only>{{
          t('common.study')
        }}</ui-button>
      </div> -->
    </card>

    <div>
      <h2 class="text-md text-brown-700 dark:text-brown-300">{{ deck.title }}</h2>
    </div>
  </div>
</template>
