<template>
  <div teeny-alert-manager>
    <teleport to="[teeny-alert-container]">
      <ui-kit:alert
        :open="currentAlert !== null"
        :title="currentAlert?.title"
        :message="currentAlert?.message"
      >
        <ui-kit:button
          @click="action1.action"
          :variant="action1.variant"
          :inverted="action1.inverted"
          :icon-left="action1.iconLeft"
          :icon-right="action1.iconRight"
          :icon-only="action1.iconOnly"
          :size="action1.size"
        >
          {{ action1.label }}
        </ui-kit:button>
        <ui-kit:button
          v-if="action2"
          @click="action2.action"
          :variant="action2.variant"
          :inverted="action2.inverted"
          :icon-left="action2.iconLeft"
          :icon-right="action2.iconRight"
          :icon-only="action2.iconOnly"
          :size="action2.size"
        >
          {{ action2.label }}
        </ui-kit:button>
      </ui-kit:alert>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { useMessageStore } from '@/stores/message'
import { storeToRefs } from 'pinia'
import { computed, type ComputedRef } from 'vue'

const messageStore = useMessageStore()
const { currentAlert } = storeToRefs(messageStore)

const action1: ComputedRef<any> = computed(() => {
  return currentAlert.value?.actions[0]
})

const action2: ComputedRef<any | undefined> = computed(() => {
  return currentAlert.value?.actions[1]
})

function onCloseAlert(): void {
  messageStore.removeAlert()
}
</script>
