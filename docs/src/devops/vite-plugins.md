# Vite Plugins

Custom Vite plugins used in the build pipeline.

## `vite-datauri`

**Source:** `src/plugins/vite-datauri.ts`

Converts imported assets into inline base64 data URIs at build time. This eliminates network requests for small assets that need to be available immediately (e.g. audio files played on interaction).

### Usage

Append `?datauri` to any static import:

```ts
import clickSound from '@/assets/audio/click.wav?datauri'
// → "data:audio/wav;base64,UklGR..."
```

Works with `import.meta.glob` too:

```ts
const sounds = import.meta.glob('@/assets/audio/**/*.wav', {
  eager: true,
  query: '?datauri',
  import: 'default'
}) as Record<string, string>
```

### Supported file types

| Extension          | MIME type         |
| ------------------ | ----------------- |
| `.wav`             | `audio/wav`       |
| `.mp3`             | `audio/mpeg`      |
| `.ogg`             | `audio/ogg`       |
| `.png`             | `image/png`       |
| `.jpg` / `.jpeg`   | `image/jpeg`      |
| `.svg`             | `image/svg+xml`   |
| `.webp`            | `image/webp`      |

### How it works

The plugin runs in Vite's `pre` enforcement phase. When it encounters an import ID containing `?datauri`, it reads the file from disk, base64-encodes it, and returns a module that default-exports the `data:` URI string. Unsupported extensions cause a build error.

### When to use

Use `?datauri` for assets that must be available instantly without a network round-trip — typically small audio files or icons used during initial render. For larger assets, prefer standard `?url` imports to keep the bundle lean.
