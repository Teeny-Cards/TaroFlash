# Teeny Card

The TeenyCard component is a simple data wrapper

## Basic Usage

In its most simple form the TeenyCard allows the passing in of a component as a child. This component rendered within a card with a fixed aspect ratio and border radius.

example:

```vue
<Card>Example</Card>
```

## Sizes

The TeenyCard component supports a `size` prop which allows you to adjust the size of the card. Available options include `large`, `base`, `small`, `xs`, or `teeny`, enabling you to maintain design consistency across different sections of your application.

example:

```vue
<Card size="large">Large</Card>
<Card size="base">Base</Card>
<Card size="small">Small</Card>
<Card size="xs" />
<Card size="teeny" />
```
