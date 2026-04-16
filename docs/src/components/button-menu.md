---
lastUpdated: 2026-04-12T12:40:50-07:00
---

# Button Menu

`ui-button-menu` is a dropdown that renders a trigger button and a list of action buttons. It does not support multi-select, search, or grouping.

## Basic Usage

The `actions` prop defines the buttons shown in the dropdown. `trigger-label` sets the label of the trigger button.

```vue
<ui-kit:button-menu trigger-label="Menu" :actions="moreMenuActions" />

<script setup>
const moreMenuActions = [
  {
    label: 'Select',
    action: () => console.log('Select'),
    inverted: true,
    iconLeft: 'check'
  },
  {
    label: 'Move',
    action: () => console.log('Move'),
    inverted: true,
    iconLeft: 'arrow-forward'
  },
  {
    label: 'Delete',
    action: () => console.log('Delete'),
    variant: 'danger',
    inverted: true,
    iconLeft: 'delete'
  }
]
</script>
```

::: details Action type

```ts
interface Action {
  label: string
  action: () => void
  variant?: string
  inverted?: boolean
  iconLeft?: string
  iconRight?: string
  iconOnly?: boolean
  size?: string
}
```

:::

## Trigger Variants

Customize the trigger button's appearance with `variant` and `inverted`:

```vue
<ui-kit:button-menu trigger-label="Menu" :actions="moreMenuActions" variant="danger" />
```

## Custom Trigger

Use the `trigger` slot to replace the default trigger button entirely. The slot provides `toggleDropdown` and `open`:

```vue
<ui-kit:button-menu :actions="moreMenuActions">
  <template #trigger="{ toggleDropdown, open }">
    <ui-button @click="toggleDropdown" :icon-left="open ? 'expand-less' : 'expand-more'" icon-only />
  </template>
</ui-kit:button-menu>
```

## Custom Dropdown Content

Use the `dropdown` slot to replace the default action list. The slot provides `closeDropdown`:

```vue
<ui-kit:button-menu trigger-label="Menu" :actions="moreMenuActions">
  <template #dropdown="{ closeDropdown }">
    <div class="bg-parchment p-4 rounded-[10px] w-max">
      <p>Custom dropdown content</p>
      <ui-button @click="closeDropdown">Close</ui-button>
    </div>
  </template>
</ui-kit:button-menu>
```

## Props

| Prop            | Type       | Default     | Description                                   |
| --------------- | ---------- | ----------- | --------------------------------------------- |
| `trigger-label` | String     | `undefined` | Label for the trigger button                  |
| `actions`       | `Action[]` | `[]`        | List of actions to display in the dropdown    |
| `variant`       | String     | `primary`   | Variant of the trigger button                 |
| `inverted`      | Boolean    | `false`     | Whether the trigger button should be inverted |

## Slots

| Slot       | Props                                         | Description                         |
| ---------- | --------------------------------------------- | ----------------------------------- |
| `trigger`  | `toggleDropdown: () => void`, `open: boolean` | Replaces the default trigger button |
| `dropdown` | `closeDropdown: () => void`                   | Replaces the default action list    |
