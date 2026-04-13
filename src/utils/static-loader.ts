/**
 * Static Loader
 *
 * Eliminates the flash between the blank HTML shell and the Vue loader.
 *
 * How it works:
 *  1. A blocking `<script id="static-loader-script">` in `index.html` reads
 *     the user's stored theme preference from localStorage (`app-theme`) and
 *     sets an inline `background` on `<body>` to match the Vue loader's color.
 *  2. The Vue `<ui-loader>` in `authenticated.vue` covers the screen with the
 *     same color via its theme prop.
 *  3. When the loader finishes, `authenticated.vue` calls `clearStaticLoader()`
 *     to strip the inline style and the script tag, letting the normal Tailwind
 *     classes on `<body>` take effect.
 *
 * The function is idempotent — multiple calls are harmless.
 *
 * If either side is removed, the other is harmless — the inline style just gets
 * cleaned up on mount, or the cleanup runs against elements that don't exist.
 */

const SCRIPT_TAG_ID = 'static-loader-script'

export function clearStaticLoader() {
  document.body.style.removeProperty('background')
  document.getElementById(SCRIPT_TAG_ID)?.remove()
}
