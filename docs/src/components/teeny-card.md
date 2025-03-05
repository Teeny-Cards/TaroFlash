<script setup>
import TeenyCard from '@/components/TeenyCard.vue'
</script>

# Teeny Card

The TeenyCard component is a simple data wrapper

## Basic Usage

In its most simple form the TeenyCard allows the passing in of a component as a child. This component rendered within a card with a fixed aspect ratio and border radius.

example:

<div class="p-4 bg-parchment rounded-[20px] flex justify-center gap-2">
  <TeenyCard>Example</TeenyCard>
</div>

```vue
<TeenyCard>Example</TeenyCard>
```

## Sizes

The TeenyCard component supports a `size` prop which allows you to adjust the size of the card. Available options include `large`, `base`, `small`, `xs`, or `teeny`, enabling you to maintain design consistency across different sections of your application.

example:

<div class="flex flex-col gap-6">
  <div class="p-4 bg-parchment rounded-[20px] flex flex-wrap justify-center items-center gap-2">
    <TeenyCard size="large">Large</TeenyCard>
    <TeenyCard size="base">Base</TeenyCard>
    <TeenyCard size="small">Small</TeenyCard>
  </div>

  <div class="p-4 bg-parchment rounded-[20px] flex flex-wrap justify-center items-center gap-2">
    <span>xs</span>
    <TeenyCard size="xs"></TeenyCard>
    <TeenyCard size="teeny"></TeenyCard>
    <span>Teeny</span>
  </div>
</div>
