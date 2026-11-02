<div align="center">
  <img src="https://github.com/Nucleify/Nucleify/blob/prod/web/public/img/logo.svg" width="70" alt="Nucleify logo">
  <h1>nui-rainbow</h1>
  <p>Ultra-lightweight, hardware-friendly shell-brand hue cycle for any element.</p>
</div>

Rainbow hue cycle on `--rainbow-hue`. Use as a **web component**, a **CSS class**, or via **`applyRainbow()`**.

---

## Install

```bash
npm install nui-rainbow
```

---

## Quick start

### 1. Web component

```html
<script type="module">
  import 'nui-rainbow';
</script>

<nui-rainbow duration="12s">
  <h1>Hue lives on --rainbow-hue</h1>
</nui-rainbow>
```

```css
h1 {
  color: hsl(var(--rainbow-hue) 55% 52%);
}
```

Or use pre-computed tokens:

```css
h1 {
  color: var(--nui-rainbow-color);
  background: var(--nui-rainbow-color-soft);
  border-color: var(--nui-rainbow-complement);
}
```

### 2. CSS class

```css
@import 'nui-rainbow/styles.css';
```

```html
<div class="nui-rainbow" style="--nui-rainbow-duration: 12s">
  <p class="nui-rainbow-text">Rainbow gradient text</p>
</div>
```

> **Note:** `.nuc-rainbow` is an alias of `.nui-rainbow`.

### 3. JavaScript / TypeScript helper

```ts
import { applyRainbow } from 'nui-rainbow';

const stop = applyRainbow(document.querySelector('.surface')!, {
  duration: 45,
  cycle: 'linear',
  fps: 'eco',
  offset: 24,
});

// Stop and restore previous styles whenever needed:
stop();
```

---

## Documentation

<details open>
<summary><b>⚡ Performance & Optimization</b></summary>

`nui-rainbow` is designed to be gentle on CPU, GPU, and battery, especially on mobile and budget laptops:

* **Automatic Off-Screen & Tab Pause**: Integrated `IntersectionObserver` and Page Visibility listeners pause cycles automatically whenever the element leaves the viewport or the browser tab is hidden (0% CPU/GPU overhead when not visible).
* **Frame Rate Limiter (`fps`)**: Avoid running 120 FPS style recalculations for subtle color shifts. Pass `fps="eco"` (15 FPS), `fps="auto"` (auto-detected for devices with `≤ 4` cores or data saver), or a custom limit like `fps="30"`.
* **Zero Recalculate Style Thrashing**: The internal Houdini property `--nui-rainbow-cycle` is declared with `inherits: false`, avoiding recursive DOM tree invalidation on child elements.
* **100% GPU Compositor Mode (`mode="gpu"` / `.nui-rainbow-gpu`)**: Runs entirely on the GPU Compositor thread via hardware-accelerated `filter: hue-rotate()`, achieving 0% main thread CPU consumption.

```html
<!-- Eco mode (15 FPS) for weak mobile devices -->
<nui-rainbow fps="eco">...</nui-rainbow>

<!-- Full GPU acceleration mode -->
<nui-rainbow mode="gpu">...</nui-rainbow>

<!-- Pure CSS stepped eco cycle -->
<div class="nui-rainbow nui-rainbow-eco">...</div>
```

</details>

<details>
<summary><b>⚙️ Props & Attributes Reference</b></summary>

| Prop | Attribute | Default | Notes |
|---|---|---|---|
| `duration` | `duration` | `30s` | Seconds (`12` → `12s`) or milliseconds (`800ms`). |
| `initialHue` | `initial-hue` | `152deg` | Cycle origin (Vue/Nuxt green). Alias: `from`. |
| `from` | `from` | `152deg` | Same as `initialHue`. Takes precedence when both are set. |
| `to` | `to` | origin + `360deg` | Sets span to `to - from`. |
| `hueSpan` | `hue-span` | `360deg` | How far the cycle travels. Ignored when `to` is set. |
| `offset` | `offset` | `0deg` | Extra hue shift (useful for staggering children). |
| `easing` | `easing` | `linear` | Any CSS timing function. |
| `iterations` | `iterations` | `infinite` | Number or `infinite`. |
| `delay` | `delay` | `0s` | Start delay in seconds or CSS time. |
| `paused` | `paused` | `false` | Boolean toggle. |
| `direction` | `direction` | `normal` | `normal` / `reverse` / `alternate` / `alternate-reverse`. |
| `fillMode` | `fill-mode` | `none` | `none` / `forwards` / `backwards` / `both`. |
| `cycle` | `cycle` | `branded` | `branded` (Vue/Nuxt → React/Next → Astro → Svelte) or `linear` (even 360°). |
| `fps` | `fps` | `smooth` | `smooth` (native CSS), `auto` (low-end device detection), `eco` (15 FPS), or a number (`15`, `30`). |
| `autoPause` | `auto-pause` | `true` | Pauses when off-screen or background tab. Set `false` to disable. |
| `mode` | `mode` | `css` | `css` (Houdini angle) or `gpu` (`filter: hue-rotate()` running on GPU compositor). |
| `reducedMotion` | `reduced-motion` | `reduce` | `ignore` keeps animation when user prefers reduced motion. |
| `saturation` | `saturation` | `55%` | S in HSL tokens. Number = percent. |
| `lightness` | `lightness` | `52%` | L in HSL tokens. Number = percent. |
| `alpha` | `alpha` | `1` | Alpha opacity in color tokens. |

`<nui-rainbow>` emits a `rainbowcycle` event on each iteration (`detail.animationName`).

</details>

<details>
<summary><b>🎨 Recipes & Styling</b></summary>

Add a recipe class on the cycling element or any descendant (`--rainbow-hue` inherits):

| Class | Effect |
|---|---|
| `.nui-rainbow-text` | Rainbow gradient clipped to text. |
| `.nui-rainbow-border` | Border tinted with `--nui-rainbow-color`. |
| `.nui-rainbow-underline` | Underline tinted with `--nui-rainbow-color`. |
| `.nui-rainbow-gpu` | Hardware-accelerated GPU filter cycle (`filter: hue-rotate()`), 0% CPU overhead. |
| `.nui-rainbow-eco` | Low-frequency stepped cycle (stepped easing) for low CPU usage in pure CSS. |

> `.nuc-rainbow-text`, `.nuc-rainbow-border`, `.nuc-rainbow-underline`, `.nuc-rainbow-gpu`, and `.nuc-rainbow-eco` are supported aliases.

#### Text gradient recipe:
```html
<nui-rainbow class="nui-rainbow-text">Hello Rainbow</nui-rainbow>
```

#### Staggered children with offset:
```html
<div class="nui-rainbow">
  <span style="--nui-rainbow-offset: 0deg">A</span>
  <span style="--nui-rainbow-offset: 24deg">B</span>
  <span style="--nui-rainbow-offset: 48deg">C</span>
</div>
```

</details>

<details>
<summary><b>🌈 CSS Variables & Tokens</b></summary>

Available tokens computed from the cycle:

| Variable | Description |
|---|---|
| `--rainbow-hue` | Public hue angle token for `hsl()` / `oklch()`. |
| `--nui-rainbow-color` | `hsl(hue saturation lightness / alpha)` |
| `--nui-rainbow-color-soft` | Lighter, less saturated companion. |
| `--nui-rainbow-color-muted` | Duller companion. |
| `--nui-rainbow-complement` | Complementary opposite hue, same S/L/alpha. |
| `--nui-rainbow-complement-hue` | `--rainbow-hue + 180deg` |
| `--nui-rainbow-oklch` | Same cycle in modern `oklch()`. |
| `--nui-rainbow-duration` | Cycle length. |
| `--nui-rainbow-initial-hue` | Cycle origin. |
| `--nui-rainbow-from` | Hue at progress 0 (defaults to initial hue). |
| `--nui-rainbow-to` | Computed `from + span`. |
| `--nui-rainbow-span` | Total angle distance (default `360deg`). |
| `--nui-rainbow-offset` | Additional hue shift. |
| `--nui-rainbow-easing` | Timing function. |
| `--nui-rainbow-iterations` | Repeat count. |
| `--nui-rainbow-delay` | Start delay. |
| `--nui-rainbow-direction` | Animation direction. |
| `--nui-rainbow-fill-mode` | `animation-fill-mode`. |
| `--nui-rainbow-saturation` | Used for color tokens. |
| `--nui-rainbow-lightness` | Used for color tokens. |
| `--nui-rainbow-alpha` | Used for color tokens. |
| `--nui-rainbow-animation` | Full cycle shorthand. |
| `--nui-rainbow-extra-animation` | Optional extra animation to compose. |

`prefers-reduced-motion: reduce` automatically stops animation unless `reduced-motion="ignore"`.

</details>

<details>
<summary><b>🧩 Frameworks & Shadow DOM</b></summary>

#### Vue / Nuxt
```vue
<template>
  <nui-rainbow :duration="speed" :paused="isPaused" fps="eco" initial-hue="210deg">
    <slot />
  </nui-rainbow>
</template>
```

#### React / Next.js
```tsx
import 'nui-rainbow';

export function RainbowBanner({ children }: { children: React.ReactNode }) {
  return (
    <nui-rainbow duration="15s" fps="eco">
      {children}
    </nui-rainbow>
  );
}
```

#### Composing with another animation
```css
.surface {
  --nui-rainbow-extra-animation: fade-in 0.4s ease;
}
```

#### Shadow Root / Adopted Stylesheets
`applyRainbow()` and `<nui-rainbow>` adopt a constructable stylesheet automatically when supported. To manually adopt into a shadow root:

```ts
import { getRainbowStyleSheet } from 'nui-rainbow';

shadow.adoptedStyleSheets = [...shadow.adoptedStyleSheets, getRainbowStyleSheet()];
```

</details>
