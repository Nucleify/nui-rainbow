<div align="center">
  <img src="https://github.com/Nucleify/Nucleify/blob/prod/public/img/logo.svg" width="70" alt="Nucleify logo">
  <h1>nui-rainbow</h1>
</div>

Rainbow hue cycle on `--rainbow-hue`. Use the web component, a CSS class, or `applyRainbow()`.

## Install

```bash
npm install nui-rainbow
```

## Web component

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

Or use a ready-made token:

```css
h1 {
  color: var(--nui-rainbow-color);
  background: var(--nui-rainbow-color-soft);
  border-color: var(--nui-rainbow-complement);
}
```

Vue:

```vue
<nui-rainbow :duration="speed" :paused="paused" initial-hue="210deg">
  <slot />
</nui-rainbow>
```

### Props / attributes

| Prop | Attribute | Default | Notes |
|---|---|---|---|
| `duration` | `duration` | `30s` | Number = seconds (`12` → `12s`). Also `800ms`. |
| `initialHue` | `initial-hue` | `132deg` | Cycle origin. Alias: `from`. |
| `from` | `from` | `132deg` | Same as `initialHue`. Wins when both are set. |
| `to` | `to` | origin + `360deg` | Sets span to `to - from`. |
| `hueSpan` | `hue-span` | `360deg` | How far the cycle travels. Ignored when `to` is set. |
| `offset` | `offset` | `0deg` | Extra hue shift (stagger children). |
| `easing` | `easing` | `linear` | Any CSS easing. |
| `iterations` | `iterations` | `infinite` | Number or `infinite`. |
| `delay` | `delay` | `0s` | Number = seconds. |
| `paused` | `paused` | `false` | Boolean attribute. |
| `direction` | `direction` | `normal` | `normal` / `reverse` / `alternate` / `alternate-reverse`. |
| `fillMode` | `fill-mode` | `none` | `none` / `forwards` / `backwards` / `both`. |
| `cycle` | `cycle` | `branded` | `branded` (curved path) or `linear` (even 360°). |
| `reducedMotion` | `reduced-motion` | `reduce` | `ignore` keeps motion when the user prefers reduced motion. |
| `saturation` | `saturation` | `55%` | Used by color tokens. Number = percent. |
| `lightness` | `lightness` | `52%` | Used by color tokens. Number = percent. |
| `alpha` | `alpha` | `1` | Used by color tokens. |

`<nui-rainbow>` emits `rainbowcycle` on each animation iteration (`detail.animationName`).

## Class or helper

```ts
import { applyRainbow } from 'nui-rainbow';

const stop = applyRainbow(document.querySelector('.surface'), {
  duration: 45,
  paused: false,
  cycle: 'linear',
  offset: 24,
});

el.addEventListener('rainbowcycle', () => { /* next lap */ });

stop();
```

```html
<div class="nui-rainbow" style="--nui-rainbow-duration: 12s">
  …
</div>
```

```css
@import 'nui-rainbow/styles.css';

.surface {
  color: hsl(var(--rainbow-hue) 55% 52%);
}
```

`.nuc-rainbow` is an alias of `.nui-rainbow`.

CSS-only usage does not emit `rainbowcycle`. Call `bindRainbowCycle(el)` if you need the event without `applyRainbow()`.

### Recipes

Add a recipe class on the cycling element or a descendant (`--rainbow-hue` inherits):

| Class | Effect |
|---|---|
| `.nui-rainbow-text` | Rainbow gradient clipped to text. |
| `.nui-rainbow-border` | Border tinted with `--nui-rainbow-color`. |
| `.nui-rainbow-underline` | Underline tinted with `--nui-rainbow-color`. |

`.nuc-rainbow-text`, `.nuc-rainbow-border`, and `.nuc-rainbow-underline` are aliases.

```html
<nui-rainbow class="nui-rainbow-text">Hello</nui-rainbow>
```

`--rainbow-hue` inherits, so a child can add its own shift:

```css
.letter {
  color: hsl(
    calc(var(--rainbow-hue) + var(--nui-rainbow-offset, 0deg))
      var(--nui-rainbow-saturation) var(--nui-rainbow-lightness)
  );
}
```

```html
<div class="nui-rainbow">
  <span style="--nui-rainbow-offset: 0deg">A</span>
  <span style="--nui-rainbow-offset: 24deg">B</span>
  <span style="--nui-rainbow-offset: 48deg">C</span>
</div>
```

Or put `.nui-rainbow` on each letter with a different `--nui-rainbow-offset` so tokens like `--nui-rainbow-color` pick up the shift.

### Compose with another animation

The cycle lives on `--nui-rainbow-animation`. Keep another animation without overwriting it:

```css
.surface {
  --nui-rainbow-extra-animation: fade-in 0.4s ease;
}
```

Or list it yourself:

```css
.surface {
  animation: fade-in 0.4s ease, var(--nui-rainbow-animation);
}
```

## CSS variables

Set these on the same element that has the class / component:

| Variable | Role |
|---|---|
| `--rainbow-hue` | Public hue token for `hsl()` / `oklch()`. |
| `--nui-rainbow-color` | `hsl(hue saturation lightness / alpha)`. |
| `--nui-rainbow-color-soft` | Lighter, less saturated sibling. |
| `--nui-rainbow-color-muted` | Duller sibling. |
| `--nui-rainbow-complement` | Opposite hue, same S/L/alpha. |
| `--nui-rainbow-complement-hue` | `--rainbow-hue + 180deg`. |
| `--nui-rainbow-oklch` | Same cycle in `oklch()`. |
| `--nui-rainbow-duration` | Cycle length. |
| `--nui-rainbow-initial-hue` | Cycle origin. |
| `--nui-rainbow-from` | Hue at progress 0 (defaults to initial hue). |
| `--nui-rainbow-to` | Computed `from + span`. |
| `--nui-rainbow-span` | Travel distance (default `360deg`). |
| `--nui-rainbow-offset` | Extra hue shift. |
| `--nui-rainbow-easing` | Timing function. |
| `--nui-rainbow-iterations` | Repeat count. |
| `--nui-rainbow-delay` | Start delay. |
| `--nui-rainbow-direction` | Animation direction. |
| `--nui-rainbow-fill-mode` | `animation-fill-mode`. |
| `--nui-rainbow-saturation` | For color tokens. |
| `--nui-rainbow-lightness` | For color tokens. |
| `--nui-rainbow-alpha` | For color tokens. |
| `--nui-rainbow-animation` | Full cycle shorthand. |
| `--nui-rainbow-extra-animation` | Optional extra animation to compose. |

`prefers-reduced-motion: reduce` stops the animation unless `reduced-motion="ignore"`.

## Styles

`applyRainbow()` / `<nui-rainbow>` adopt a constructable stylesheet when the document supports it, and fall back to a `<style id="nui-rainbow-styles">` tag. For a shadow root:

```ts
import { getRainbowStyleSheet } from 'nui-rainbow';

shadow.adoptedStyleSheets = [...shadow.adoptedStyleSheets, getRainbowStyleSheet()];
```
