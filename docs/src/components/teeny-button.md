<script setup>
  import TeenyButton from '@teeny/TeenyButton.vue'
</script>

# Teeny Button

The Teeny Button is a versatile and customizable component designed for Vue.js applications. It provides an elegant solution for integrating button elements into your user interface, offering a range of customization options including colors, icons, sizes, and variants to fit the design requirements of your project seamlessly.

## Installation

To begin using the Teeny Button in your project, ensure you have imported the component correctly.

An alias has been set up for Teeny Components, so you can import the Teeny Button directly from the `@teeny` namespace.

```html
<script setup>
  import TeenyButton from '@teeny/TeenyButton.vue'
</script>
```

## Default Configuration

Out of the box, the Teeny Button is styled with a default blue color scheme and is capable of accepting any content, such as text or other elements, through its default slot.

Since the TeenyButton uses a standard html button element under the hood, you can also use the `click` event to specify a function to be executed when the button is clicked.

Example of a basic button:

<TeenyButton>Save</TeenyButton>

```html
<TeenyButton @click="console.log('save')">Save</TeenyButton>
```

## Incorporating Icons

To enhance the button's visual appeal, the component supports the inclusion of icons on either side of the text. This is achieved through the `icon-left` and `icon-right` properties, which accept a string corresponding to the SVG icon's filename located in `src/assets/svgs`.

Example with a left-aligned icon:

<TeenyButton icon-left="close">Close</TeenyButton>

```html
<TeenyButton icon-left="close">Close</TeenyButton>
```

### Icon Only

The Teeny Button also accepts an optional `icon-only` prop, which allows you to render an icon without any accompanying text. The visual style of the button will be adjusted to accommodate the icon's presence.

Example of an icon-only button:

<TeenyButton icon-left="close" icon-only></TeenyButton>

```html
<TeenyButton icon-left="close" icon-only></TeenyButton>
```

## Adjustable Sizes

Adapt the Teeny Button to fit various UI contexts by setting the size prop. Available options include `large`, `base`, `small`, or `teeny`, enabling you to maintain design consistency across different sections of your application.

Illustration of different sizes:

<div class="flex gap-2 items-center">
  <TeenyButton size="large" icon-left="check">Large</TeenyButton>
  <TeenyButton size="base" icon-left="check">Base</TeenyButton>
  <TeenyButton size="small" icon-left="check">Small</TeenyButton>
  <TeenyButton size="teeny" icon-left="check">Teeny</TeenyButton>
</div>

```html
<TeenyButton size="large" icon-left="check">Large</TeenyButton>
<TeenyButton size="base" icon-left="check">Base</TeenyButton>
<TeenyButton size="small" icon-left="check">Small</TeenyButton>
<TeenyButton size="teeny" icon-left="check">Teeny</TeenyButton>
```

## Variants for Different Contexts

### Variants

The button's appearance can be further customized by using the `variant` prop, which allows you to define the button's thematic significance. Options include `interaction` (default), `muted`, and `danger`, each designed to convey different levels of urgency or importance.

Example showcasing various variants:

<div class="flex gap-2 items-center">
  <TeenyButton icon-left="check">Interaction</TeenyButton>
  <TeenyButton variant="muted" icon-left="close">Muted</TeenyButton>
  <TeenyButton variant="danger" icon-left="delete">Danger</TeenyButton>
</div>

```html
<TeenyButton icon-left="check">Interaction</TeenyButton>
<TeenyButton variant="muted" icon-left="close">Muted</TeenyButton>
<TeenyButton variant="danger" icon-left="delete">Danger</TeenyButton>
```

### Inverted

In addition to color variants, the Teeny Button also supports an `inverted` prop, which inverts the button's color scheme, making it suitable for use on dark backgrounds or in contexts where a lighter color scheme is preferred.

Example of an inverted variant:

<div class="p-4 bg-parchment rounded-[20px] flex gap-2">
<TeenyButton inverted icon-left="check">Interaction</TeenyButton>
<TeenyButton inverted variant="muted" icon-left="close">Muted</TeenyButton>
<TeenyButton inverted variant="danger" icon-left="delete">Danger</TeenyButton>
</div>

```html
<TeenyButton inverted icon-left="check">Interaction</TeenyButton>
<TeenyButton inverted variant="muted" icon-left="close">Muted</TeenyButton>
<TeenyButton inverted variant="danger" icon-left="delete">Danger</TeenyButton>
```

## Detailed Prop Specifications

Below is a table delineating the available props, their expected data types, default values, and a brief description:

| Prop         | Type   | Default     | Description                                           |
| ------------ | ------ | ----------- | ----------------------------------------------------- |
| `click`      | Func   | `undefined` | Specifies the function to be executed on button click |
| `size`       | String | `base`      | Defines the size of the button, adjusting its scale.  |
| `variant`    | String | `primary`   | Determines the button's styling theme.                |
| `inverted`   | Bool   | `false`     | Determines if the button's color scheme is inverted.  |
| `icon-only`  | Bool   | `false`     | Specifies if the button only displays an icon.        |
| `icon-left`  | String | `undefined` | Specifies the left-aligned icon's filename.           |
| `icon-right` | String | `undefined` | Specifies the right-aligned icon's filename           |

By leveraging these props, you can customize the Teeny Button to align perfectly with your application's design language, ensuring a cohesive and intuitive user interface.
