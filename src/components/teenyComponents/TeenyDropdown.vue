<template>
  <div class="relative">
    <slot name="trigger"></slot>
    <div class="absolute z-10 right-0 top-full mt-2 shadow-md bg-white rounded-xl">
      <slot name="dropdown"></slot>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
