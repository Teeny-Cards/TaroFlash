<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase-client'

const router = useRouter()

onMounted(async () => {
  await supabase.auth.getSession()

  if (window.opener && window.opener !== window) {
    window.close()
    return
  }

  router.push({ name: 'dashboard' })
})
</script>
