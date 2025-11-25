<script lang="ts" setup>
import UiButton from '@/components/ui-kit/button.vue'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (e: 'select'): void
  (e: 'move'): void
  (e: 'delete'): void
}>()

const { t } = useI18n()
</script>

<template>
  <div class="grid grid-cols-1 gap-2">
    <ui-button
      hover-audio="pop_drip_mid"
      @click.stop="emit('select')"
      icon-only
      icon-left="check"
      theme="brown"
    >
      {{ t('deck-view.card-popover.select') }}
    </ui-button>

    <ui-button
      hover-audio="pop_drip_mid"
      @click.stop="emit('move')"
      icon-only
      icon-left="arrow-forward"
      theme="brown"
    >
      {{ t('deck-view.card-popover.move') }}
    </ui-button>

    <ui-button
      hover-audio="pop_drip_mid"
      @click.stop="emit('delete')"
      icon-only
      icon-left="delete"
      theme="red"
    >
      {{ t('deck-view.card-popover.delete') }}
    </ui-button>
  </div>
</template>
