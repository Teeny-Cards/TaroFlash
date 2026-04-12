# Button

`ui-button` is a versatile and customizable button component. It supports icons, sizes, variants, and an inverted color scheme.

## Basic Usage

```html
<ui-button @click="console.log('save')">Save</ui-button>
```

## Icons

Add icons on either side of the label with `icon-left` and `icon-right`. Both accept a string matching an SVG filename in `src/assets/svgs`.

```html
<ui-button icon-left="close">Close</ui-button>
<ui-button icon-right="arrow-forward">Next</ui-button>
```

### Icon Only

Use `icon-only` to render just the icon with no label. The button adjusts its padding automatically.

```html
<ui-button icon-left="close" icon-only />
```

## Sizes

```html
<ui-button size="large" icon-left="check">Large</ui-button>
<ui-button size="base" icon-left="check">Base</ui-button>
<ui-button size="small" icon-left="check">Small</ui-button>
<ui-button size="xs" icon-left="check">XS</ui-button>
```

## Variants

```html
<ui-button icon-left="check">Interaction</ui-button>
<ui-button variant="muted" icon-left="close">Muted</ui-button>
<ui-button variant="danger" icon-left="delete">Danger</ui-button>
```

### Inverted

`inverted` flips the color scheme — useful on dark or colored backgrounds.

```html
<ui-button inverted icon-left="check">Interaction</ui-button>
<ui-button inverted variant="muted" icon-left="close">Muted</ui-button>
<ui-button inverted variant="danger" icon-left="delete">Danger</ui-button>
```

## Props

| Prop         | Type   | Default     | Description                           |
| ------------ | ------ | ----------- | ------------------------------------- |
| `size`       | String | `base`      | `large`, `base`, `small`, or `xs`     |
| `variant`    | String | `primary`   | `interaction`, `muted`, or `danger`   |
| `inverted`   | Bool   | `false`     | Inverts the button's color scheme     |
| `icon-only`  | Bool   | `false`     | Renders only the icon, no label       |
| `icon-left`  | String | `undefined` | SVG filename for a left-aligned icon  |
| `icon-right` | String | `undefined` | SVG filename for a right-aligned icon |
