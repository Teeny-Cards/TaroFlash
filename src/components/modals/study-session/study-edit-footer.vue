<script setup lang="ts">
const { is_starting_side } = defineProps<{ is_starting_side: boolean }>()

const emit = defineEmits<{
  (e: 'flip'): void
  (e: 'done'): void
}>()
</script>

<template>
  <div data-testid="study-card-edit__actions" class="z-10 mt-4 flex justify-center gap-2 text-2xl">
    <button
      data-testid="study-card-edit__flip"
      v-sfx="{ click: is_starting_side ? 'ui.transition_up' : 'ui.transition_down' }"
      class="text-brown-700 cursor-pointer rounded-full bg-white px-13 py-4 hover:-translate-0.5 hover:shadow-sm transition-all duration-50"
      @click="emit('flip')"
    >
      {{ $t('study.flashcard.edit-footer.flip-button') }}
    </button>
    <button
      data-testid="study-card-edit__done"
      v-sfx="{ click: 'ui.music_plink_ok' }"
      class="cursor-pointer rounded-full bg-(--theme-primary) px-13 py-4 text-white hover:-translate-0.5 hover:shadow-sm transition-all duration-50"
      @click="emit('done')"
    >
      {{ $t('study-session.edit.done') }}
    </button>
  </div>
</template>
