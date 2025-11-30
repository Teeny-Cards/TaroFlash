<script setup lang="ts">
import { supabase } from '@/supabase-client'
import UiButton from '@/components/ui-kit/button.vue'

async function cleanupMedia() {
  const res = await supabase.functions.invoke('cleanup-media')
  console.log(res)
}
</script>

<template>
  <div class="fixed bottom-4 right-4 w-100 h-50 bg-white shadow-popover rounded-5 p-4">
    <ui-button @click="cleanupMedia">Cleanup Media</ui-button>
  </div>
</template>
