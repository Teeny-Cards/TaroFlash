<template>
  <NavBar :display_name="member.display_name" />
  <main class="h-full w-full max-w-375 px-4 sm:px-16">
    <RouterView />
    <Phone />
  </main>
</template>

<script setup lang="ts">
import NavBar from '@/components/nav-bar.vue'
import { RouterView } from 'vue-router'
import { useMemberStore } from '@/stores/member'
import Phone from '@/components/phone/phone.vue'

const member = useMemberStore()
</script>
