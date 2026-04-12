# Icon

`ui-icon` is a simple SVG wrapper. It accepts a filename from `src/assets/svgs` and renders the corresponding icon.

## Basic Usage

```vue
<ui-icon src="close" />
```

## Sizes

```vue
<ui-icon src="delete" size="large" />
<ui-icon src="delete" size="base" />
<ui-icon src="delete" size="small" />
<ui-icon src="delete" size="xs" />
```

## Styling

Apply color by adding a text color class — the SVG inherits `currentColor`:

```vue
<ui-icon src="delete" class="text-red" />
```

## Available Icons

`ui-icon` can render any SVG in `src/assets/svgs`. Currently available:

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
