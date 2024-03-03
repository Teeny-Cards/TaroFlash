<script setup>
  import TeenyButton from '@teeny/TeenyButton.vue'
</script>

# Teeny Button

## Basic Usage

The Teeny Button, by default, uses the `blue` color and takes a default slot to pass in text (or anything really).

```html
<TeenyButton>Save></TeenyButton>
```

<TeenyButton>Save</TeenyButton>

## Icons

The Component accepts two icon props: `icon-left` and `icon-right`. The prop is a simple string that relates to the name of the svg icon stored at `src/assets/svgs`.

```html
<TeenyButton icon-left="close">Close</TeenyButton>
```

<TeenyButton icon-left="close">Close</TeenyButton>

## Sizes

The Component accepts a `size` prop that can be set to `small`, `medium`, or `large`.

<div class="flex gap-2 items-center">
  <TeenyButton size="large" icon-left="check">Large</TeenyButton>
  <TeenyButton size="base" icon-left="check">Base</TeenyButton>
  <TeenyButton size="small" icon-left="check">Small</TeenyButton>
  <TeenyButton size="teeny" icon-left="check">Teeny</TeenyButton>
</div>

## Variant

The Component accepts a `variant` prop that can be set to `primary`, `secondary`, `tertiary`, or `danger`.
