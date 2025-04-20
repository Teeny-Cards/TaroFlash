<script setup>
import TeenyButtonMenu from '@/components/TeenyButtonMenu.vue'
import TeenyButton from '@/components/TeenyButton.vue'

const moreMenuActions = [
  {
    label: 'Select',
    action: () => console.log('Edit'),
    inverted: true,
    iconLeft: 'check'
  },
  {
    label: 'Move',
    action: () => console.log('Delete'),
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

# Teeny Button Menu

The `TeenyButtonMenu` component is a simple dropdown that can be used to display a list of buttons. It is a very basic dropdown that does not support any advanced features such as multi-select, search, or grouping.

## Usage

In it's basic form the ButtonMenu renders a trigger that, when clicked, displays a list of buttons. The component accepts a `trigger-label` prop which is the label for the trigger button.

::: details Note on Actions
The buttons are defined using the `actions` prop. The actions prop is of type `Action[]` where `Action` is defined as:

```typescript
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

example:

<ui-kit:button-menu trigger-label="Menu" :actions="moreMenuActions" />

```vue
<ui-kit:button-menu trigger-label="Menu" :actions="moreMenuActions" />

<script setup>
import TeenyButtonMenu from '@/components/TeenyButtonMenu.vue'

const moreMenuActions = [
  {
    label: 'Select',
    action: () => console.log('Edit'),
    inverted: true,
    iconLeft: 'check'
  },
  {
    label: 'Move',
    action: () => console.log('Delete'),
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

## Trigger Variants

The trigger button can be customized using the `variant` and `inverted` props. The `variant` prop can be set to `primary`, `muted`, or `danger`. The `inverted` prop can be set to `true` to invert the colors of the button.

example:

<ui-kit:button-menu trigger-label="Menu" :actions="moreMenuActions" variant="danger" />

```vue
<ui-kit:button-menu trigger-label="Menu" :actions="moreMenuActions" variant="danger" />
```

## Custom Trigger

You can also use a custom trigger by using the `trigger` slot. The slot receives a `toggleDropdown` function that can be used to open and close the menu, as well as an `open` boolean that can be used to conditionally render the open state of the menu.

example:

<ui-kit:button-menu :actions="moreMenuActions">
<template #trigger="{ toggleDropdown, open }">
<ui-kit:button @click="toggleDropdown" :icon-left="open ? 'expand-less' : 'expand-more'" icon-only></TeenyButton>
</template>
</TeenyButtonMenu>

```vue
<ui-kit:button-menu :actions="moreMenuActions">
  <template #trigger="{ toggleDropdown, open }">
    <ui-kit:button @click="toggleDropdown" :icon-left="open ? 'expand-less' : 'expand-more'" icon-only></TeenyButton>
  </template>
</TeenyButtonMenu>
```

## Custom Dropdown Content

You can also use a custom dropdown content by using the `dropdown` slot. The slot receives a `closeDropdown` function that can be used to close the menu.

example:

<ui-kit:button-menu trigger-label="Menu" :actions="moreMenuActions">
<template #dropdown="{ closeDropdown }">

<div class="bg-parchment p-4 rounded-[10px] w-max">
<p>Custom dropdown content</p>
<ui-kit:button @click="closeDropdown">Close</TeenyButton>
</div>
</template>
</TeenyButtonMenu>

## Detailed Prop Specifications

Below is a table delineating the available props, their expected data types, default values, and a brief description:

| Prop           | Type     | Default     | Description                                    |
| -------------- | -------- | ----------- | ---------------------------------------------- |
| `triggerLabel` | String   | `undefined` | The label for the trigger button               |
| `actions`      | Action[] | `[]`        | The list of actions to display in the dropdown |
| `variant`      | String   | `primary`   | The variant of the trigger button              |
| `inverted`     | Boolean  | `false`     | Whether the trigger button should be inverted  |

## Detailed Slot Specifications

Below is a table delineating the available slots and their expected data:

| Slot       | Props                                         | Description          |
| ---------- | --------------------------------------------- | -------------------- |
| `trigger`  | `toggleDropdown: () => void`, `open: boolean` | The trigger button   |
| `dropdown` | `closeDropdown: () => void`                   | The dropdown content |
