<script setup>
  import TeenyIcon from '@/components/TeenyComponents/TeenyIcon.vue' 

  const icons = [
    'arrow-back',
    'arrow-forward',
    'check',
    'chevron-left',
    'chevron-right',
    'close',
    'delete',
    'play',
    'settings',
    'user',
    'more',
    'expand-more',
    'expand-less',
    'add-image',
    'image'
  ]
</script>

# Teeny Icon

The Teeny Icon component, under the hood, is a simple SVG wrapper that accepts a filename corresponding to the desired icon located in `src/icons/svgs`. This component is designed to be used in conjunction with other components, such as buttons, to enhance the visual appeal of your application.

## Usage

To use the Teeny Icon component, simply import it into your component file and include it in your template:

```vue
<template>
  <ui-kit:icon src="close" />
</template>

<script setup>
import TeenyIcon from '@/components/TeenyComponents/TeenyIcon.vue'
</script>
```

The `src` prop accepts a string corresponding to the SVG icon's filename located in `src/assets/svgs`.

example of a basic icon:

<ui-kit:icon src="close" />

```vue
<ui-kit:icon src="close" />
```

## Size

The Teeny Icon component also accepts an optional `size` prop, which allows you to adjust the icon's dimensions. Available options include `large`, `base`, `small`, or `teeny`, enabling you to maintain design consistency across different sections of your application.

example of different sizes:

<div class="flex gap-2 items-center">
  <ui-kit:icon src="delete" size="large" />
  <ui-kit:icon src="delete" size="base" />
  <ui-kit:icon src="delete" size="small" />
  <ui-kit:icon src="delete" size="teeny" />
</div>

```vue
<ui-kit:icon src="delete" size="large" />
<ui-kit:icon src="delete" size="base" />
<ui-kit:icon src="delete" size="small" />
<ui-kit:icon src="delete" size="teeny" />
```

## Styling

Since the icon component, under the hood, is a simple SVG wrapper, you can easily apply color to the icon by adding a text color class to the component.

<ui-kit:icon src="delete" class="text-red" />

```vue
<ui-kit:icon src="delete" class="text-red" />
```

## Available Icons

The Teeny Icon component can render any svg in the `src/assets/svgs` directory. The following is a list of icons currently available:

  <div class="grid grid-cols-4 gap-4">
    <div v-for="icon in icons" :key="icon" class="py-8 px-1 flex flex-col gap-4 justify-center items-center bg-parchment rounded-[8px]">
      <ui-kit:icon :src="icon" />
      <span class="text-center">{{ icon }}</span>
    </div>
  </div>
