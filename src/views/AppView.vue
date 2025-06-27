<template>
  <NavBar :display_name="member.display_name" />
  <main class="h-full w-full max-w-326 px-4 pt-7 sm:px-16">
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import NavBar from '@/components/nav-bar.vue'
import { RouterView } from 'vue-router'
import { useMemberStore } from '@/stores/member'

const member = useMemberStore()
</script>
