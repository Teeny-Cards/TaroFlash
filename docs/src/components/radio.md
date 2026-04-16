---
lastUpdated: 2026-04-13T21:03:32-07:00
---

# Radio

`ui-radio` is a circular toggle that represents a selected or unselected state. It supports themes, an intermediate state, and an inverted style for use on coloured backgrounds.

## Basic usage

```html
<ui-radio :checked="selected === 'a'" @click="selected = 'a'" />
```

## Theme

Pass any `MemberTheme` value to match the radio to its context. Defaults to `'blue-500'`.

```html
<ui-radio :checked="isSelected" theme="green-400" />
```

## Inverted

`inverted` renders the radio with a filled background at rest — suited to placing the radio directly on a themed or dark surface where the filled state needs to be the default appearance.

```html
<!-- Standard: white bg at rest, filled on checked -->
<ui-radio :checked="isSelected" />

<!-- Inverted: filled bg always, outline highlight on checked -->
<ui-radio :checked="isSelected" inverted />
```

## Intermediate

The `intermediate` prop renders a minus icon inside the circle — for use in "select all / some" patterns.

```html
<ui-radio :checked="false" :intermediate="someSelected" />
```

## Props

| Prop           | Type          | Default      | Description                                               |
| -------------- | ------------- | ------------ | --------------------------------------------------------- |
| `checked`      | Boolean       | —            | Required. Whether the radio appears selected              |
| `theme`        | `MemberTheme` | `'blue-500'` | Color theme                                               |
| `inverted`     | Boolean       | `false`      | Filled background at rest; outline highlight when checked |
| `intermediate` | Boolean       | `false`      | Shows a minus icon (for indeterminate / partial state)    |
