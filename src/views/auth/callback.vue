 <script setup lang="ts">
import { onMounted } from "vue"
import { supabase } from '@/supabase-client'

onMounted(async () => {
  await supabase.auth.exchangeCodeForSession(window.location.href)

  if (window.opener) {
    window.opener.postMessage("auth_complete", window.location.origin)
  }

  window.close()
})
</script>
