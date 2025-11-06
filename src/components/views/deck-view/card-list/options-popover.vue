<script setup lang="ts">
import UiPopover from '@/components/ui-kit/popover.vue'
import UiButton from '@/components/ui-kit/button.vue'
import { useI18n } from 'vue-i18n'

const { open = false } = defineProps<{
  open?: boolean
}>()

const { t } = useI18n()

const emit = defineEmits<{
  (e: 'upload-image'): void
  (e: 'select'): void
  (e: 'delete'): void
  (e: 'move'): void
  (e: 'closed'): void
}>()
</script>

<template>
  <ui-popover
    position="right"
    :gap="10"
    :fallback_placements="['top', 'bottom', 'left', 'right']"
    :open="open"
    @close="emit('closed')"
  >
    <template #trigger>
      <slot></slot>
    </template>
    <div class="bg-brown-300 rounded-10 p-6 grid grid-cols-1 gap-2">
      <ui-button
        hover-audio="pop_drip_mid"
        @click="emit('upload-image')"
        icon-only
        icon-left="add-image"
      >
        {{ t('deck-view.card-popover.upload-image') }}
      </ui-button>

      <ui-button hover-audio="pop_drip_mid" @click="emit('select')" icon-only icon-left="check">
        {{ t('deck-view.card-popover.select') }}
      </ui-button>

      <ui-button
        hover-audio="pop_drip_mid"
        @click="emit('move')"
        icon-only
        icon-left="arrow-forward"
      >
        {{ t('deck-view.card-popover.move') }}
      </ui-button>

      <ui-button
        hover-audio="pop_drip_mid"
        @click="emit('delete')"
        icon-only
        icon-left="delete"
        variant="danger"
      >
        {{ t('deck-view.card-popover.delete') }}
      </ui-button>
    </div>
  </ui-popover>
</template>
