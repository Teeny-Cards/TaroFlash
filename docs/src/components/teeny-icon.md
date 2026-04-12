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

Example of a basic icon:

```vue
<ui-kit:icon src="close" />
```

## Size

The Teeny Icon component also accepts an optional `size` prop, which allows you to adjust the icon's dimensions. Available options include `large`, `base`, `small`, or `teeny`, enabling you to maintain design consistency across different sections of your application.

Example of different sizes:

```vue
<ui-kit:icon src="delete" size="large" />
<ui-kit:icon src="delete" size="base" />
<ui-kit:icon src="delete" size="small" />
<ui-kit:icon src="delete" size="teeny" />
```

## Styling

Since the icon component, under the hood, is a simple SVG wrapper, you can easily apply color to the icon by adding a text color class to the component.

```vue
<ui-kit:icon src="delete" class="text-red" />
```

## Available Icons

The Teeny Icon component can render any svg in the `src/assets/svgs` directory. The following icons are currently available:

- `arrow-back`
- `arrow-forward`
- `check`
- `chevron-left`
- `chevron-right`
- `close`
- `delete`
- `play`
- `settings`
- `user`
- `more`
- `expand-more`
- `expand-less`
- `add-image`
- `image`
