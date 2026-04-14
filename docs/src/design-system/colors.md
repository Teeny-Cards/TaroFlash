# Colors & Palette

Component themes are typed as `MemberTheme` (defined in `types/member.d.ts`). Each value maps to a block in `src/styles/palettes.css` that defines the `--theme-*` tokens for that color.

## Available themes

| Value        | Primary color |
| ------------ | ------------- |
| `blue-500`   | Blue 500      |
| `blue-800`   | Blue 800      |
| `blue-650`   | Blue 650      |
| `blue-400`   | Blue 400      |
| `green-400`  | Green 400     |
| `purple-700` | Purple 700    |
| `purple-500` | Purple 500    |
| `pink-400`   | Pink 400      |
| `red-500`    | Red 500       |
| `red-400`    | Red 400       |
| `orange-600` | Orange 600    |
| `orange-500` | Orange 500    |
| `brown-300`  | Brown 300     |
| `brown-100`  | Brown 100     |
| `grey-900`   | Grey 900      |
| `grey-400`   | Grey 400      |
| `white`      | White         |

## Base color tokens

The raw color palette is defined in `src/styles/palettes.css` and exposed as `--color-*` tokens (e.g. `--color-blue-500`, `--color-brown-100`). Use these only for colors that do not change with the component theme. For anything that should follow the active theme, use `--theme-*` tokens instead — see [Theming](./theming.md).

## Dark mode

All `MemberTheme` values support dark mode via `data-theme-dark`. When the root has `data-theme="dark"`, a component with `:data-theme-dark="'purple-500'"` will use the `purple-500` palette regardless of its `data-theme` value. See [Theming](./theming.md) for details.
