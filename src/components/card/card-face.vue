<script setup lang="ts">
defineProps<{
  image?: string
  text?: string
}>()
</script>

<template>
  <div
    data-testid="card-face"
    class="card-face"
    :class="{ 'card-face--has-image': image, 'card-face--has-text': text }"
  >
    <img v-if="image" :src="image" alt="Deck Image preview" class="card-face__image" />

    <slot name="front">
      <div v-if="text" class="card-face__text">{{ text }}</div>
    </slot>
  </div>
</template>

<style>
.card-face {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  width: 100%;
  height: 100%;
  aspect-ratio: var(--aspect-card);
  padding: var(--face-padding);

  border-radius: var(--face-radius);
  border-color: var(--color-brown-300);
  border-width: var(--face-border-width);

  background-color: var(--color-white);
}

.card-face__image {
  border-radius: calc(var(--face-radius) - var(--face-border-width) - var(--face-padding));

  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-face__text {
  color: var(--color-brown-700);
  font-size: var(--face-text-size);
  line-height: var(--face-text-size--line-height);
}

.card-face:not(.card-face--has-image) .card-face__text {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.card-face:not(.card-face--has-text) {
  --face-padding: 0px;
}

.card-face:not(.card-face--has-text):not(.card-face--has-image) {
  background-color: var(--color-purple-400);
  background-image: var(--diagonal-stripes);
}
</style>
