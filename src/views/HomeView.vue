<template>
  <NavBar :display_name="displayName" />
  <main class="max-w-app h-full w-full px-4 sm:px-16 pt-7">
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import { RouterView } from 'vue-router'
import { useMemberStore } from '@/stores/member'

const user = useMemberStore()
const displayName = user.display_name
</script>
