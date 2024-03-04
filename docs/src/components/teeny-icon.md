<script setup>
  import TeenyIcon from '@/components/TeenyIcon.vue'

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
    'more'
  ]
</script>

# Teeny Icon

The Teeny Icon component, under the hood, is a simple SVG wrapper that accepts a filename corresponding to the desired icon located in `src/assets/svgs`. This component is designed to be used in conjunction with other components, such as buttons, to enhance the visual appeal of your application.

## Usage

To use the Teeny Icon component, simply import it into your component file and include it in your template:

```vue
<template>
  <TeenyIcon src="close" />
</template>

<script setup>
import TeenyIcon from '@teeny/TeenyIcon.vue'
</script>
```

The `src` prop accepts a string corresponding to the SVG icon's filename located in `src/assets/svgs`.

example of a basic icon:

<TeenyIcon src="close" />

```vue
<TeenyIcon src="close" />
```

## Size

The Teeny Icon component also accepts an optional `size` prop, which allows you to adjust the icon's dimensions. Available options include `large`, `base`, `small`, or `teeny`, enabling you to maintain design consistency across different sections of your application.

example of different sizes:

<div class="flex gap-2 items-center">
  <TeenyIcon src="delete" size="large" />
  <TeenyIcon src="delete" size="base" />
  <TeenyIcon src="delete" size="small" />
  <TeenyIcon src="delete" size="teeny" />
</div>

```vue
<TeenyIcon src="delete" size="large" />
<TeenyIcon src="delete" size="base" />
<TeenyIcon src="delete" size="small" />
<TeenyIcon src="delete" size="teeny" />
```

## Styling

Since the icon component, under the hood, is a simple SVG wrapper, you can easily apply color to the icon by adding a text color class to the component.

<TeenyIcon src="delete" class="text-red" />

```vue
<TeenyIcon src="delete" class="text-red" />
```

## Available Icons

The Teeny Icon component can render any svg in the `src/assets/svgs` directory. The following is a list of icons currently available:

  <div class="grid grid-cols-4 gap-4">
    <div v-for="icon in icons" :key="icon" class="py-8 px-1 flex flex-col gap-4 justify-center items-center bg-parchment rounded-[8px]">
      <TeenyIcon :src="icon" />
      <span class="text-center">{{ icon }}</span>
    </div>
  </div>
