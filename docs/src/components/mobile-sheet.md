# Mobile Sheet

`mobile-sheet` is a themed panel used as the content container inside a mobile-sheet modal. It provides a structured header (with a wave decoration, close button, and optional background texture), a body, and a footer.

## Basic usage

```html
<mobile-sheet title="Settings" theme="blue-500" @close="close()">
  <template #body>
    <p>Content here</p>
  </template>
</mobile-sheet>
```

## Header

The header renders automatically when any of `title`, `header-content`, or `header` slots are provided. If none of these are present, the header section is omitted entirely.

### Default header layout

The default header is a flex row that centers its content. A close button is always rendered in the top-left corner (absolutely positioned). The title sits centered in the remaining space.

```html
<mobile-sheet title="Edit Deck" @close="close()">
  <template #body>...</template>
</mobile-sheet>
```

### Custom header content

Replace the centered title area with `header-content`. The close button remains fixed in the top-left:

```html
<mobile-sheet @close="close()">
  <template #header-content>
    <my-custom-title />
  </template>
  <template #body>...</template>
</mobile-sheet>
```

### Full header replacement

Replace the entire header element (including the wave, background, and close button) with `header`:

```html
<mobile-sheet @close="close()">
  <template #header>
    <my-fully-custom-header />
  </template>
  <template #body>...</template>
</mobile-sheet>
```

## Background texture

Pass a `BgxConfig` to `bgx` to apply a background pattern to the header area:

```html
<mobile-sheet title="Settings" :bgx="{ pattern: 'dots', color: 'blue-700' }" @close="close()" />
```

## Props

| Prop    | Type          | Default       | Description                                        |
| ------- | ------------- | ------------- | -------------------------------------------------- |
| `theme` | `MemberTheme` | `'green-400'` | Color theme applied to the header and close button |
| `title` | String        | `undefined`   | Title text rendered in the header                  |
| `bgx`   | `BgxConfig`   | `undefined`   | Background texture config for the header area      |

## Emits

| Event   | Payload | Description                              |
| ------- | ------- | ---------------------------------------- |
| `close` | —       | Emitted when the close button is clicked |

## Slots

| Slot             | Description                                                        |
| ---------------- | ------------------------------------------------------------------ |
| `header`         | Replaces the entire header element                                 |
| `header-content` | Replaces the centered title within the default header              |
| `body`           | Main content area                                                  |
| `footer`         | Bottom section (no padding applied — control spacing from content) |
