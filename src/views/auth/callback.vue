 <script setup lang="ts">
import { onMounted, ref } from "vue"
import { supabase } from '@/supabase-client'
import UiLoader from '@/components/ui-kit/loader/index.vue'

const loading = ref(true)

onMounted(async () => {
  loading.value = true
  await supabase.auth.exchangeCodeForSession(window.location.href)
  loading.value = false
})

function onFinish() {
  console.log('closing window')
  window.close()
}
</script>

<template>
  <ui-loader
    :loading="loading"
    loading-image="logo"
    done-image="logo-hover"
    theme="blue-500"
    @finish="onFinish"
  />
</template>
