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

The header renders automatically when any of `title`, `header-content`, `header-left`, or `header` slots are provided. If none of these are present, the header section is omitted entirely.

### Default header layout

The default header is a two-row grid:

- **Row 1**: `header-left` (default: close button) · title · _(empty right cell)_
- **Row 2**: `after-header` slot spanning all columns

```html
<mobile-sheet title="Edit Deck" @close="close()">
  <template #after-header>
    <tab-bar v-model="activeTab" />
  </template>
  <template #body>...</template>
</mobile-sheet>
```

### Custom close button

Replace just the left cell of the header (default close button) with `header-left`:

```html
<mobile-sheet title="Edit Deck" @close="close()">
  <template #header-left>
    <ui-button icon-left="arrow-back" icon-only inverted @click="goBack()" />
  </template>
  <template #body>...</template>
</mobile-sheet>
```

### Full header replacement

Replace the entire header row content (title + left cell) with `header-content`:

```html
<mobile-sheet @close="close()">
  <template #header-content>
    <my-custom-header />
  </template>
  <template #body>...</template>
</mobile-sheet>
```

Or replace the entire header element (including the wave and background) with `header`:

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

| Prop    | Type          | Default       | Description                                         |
| ------- | ------------- | ------------- | --------------------------------------------------- |
| `theme` | `MemberTheme` | `'green-400'` | Color theme applied to the header and close button  |
| `title` | String        | `undefined`   | Title text rendered in the header                   |
| `bgx`   | `BgxConfig`   | `undefined`   | Background texture config for the header area       |

## Emits

| Event   | Payload | Description                              |
| ------- | ------- | ---------------------------------------- |
| `close` | —       | Emitted when the default close button is clicked |

## Slots

| Slot             | Description                                                                 |
| ---------------- | --------------------------------------------------------------------------- |
| `header`         | Replaces the entire header element                                          |
| `header-content` | Replaces the title + left cell within the default header                   |
| `header-left`    | Replaces only the left cell of the default header (default: close button)  |
| `after-header`   | Rendered in row 2 of the default header, spanning all columns              |
| `body`           | Main content area                                                           |
| `footer`         | Bottom section (no padding applied — control spacing from content)          |
