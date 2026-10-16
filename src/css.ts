import {
  NUI_RAINBOW_ALPHA_DEFAULT,
  NUI_RAINBOW_ANIMATION_BRANDED,
  NUI_RAINBOW_ANIMATION_LINEAR,
  NUI_RAINBOW_BORDER_CLASS,
  NUI_RAINBOW_DELAY_DEFAULT,
  NUI_RAINBOW_DURATION_DEFAULT,
  NUI_RAINBOW_EASING_DEFAULT,
  NUI_RAINBOW_FILL_MODE_DEFAULT,
  NUI_RAINBOW_HUE_ASTRO,
  NUI_RAINBOW_HUE_INITIAL,
  NUI_RAINBOW_HUE_REACT,
  NUI_RAINBOW_HUE_SVELTE,
  NUI_RAINBOW_HUE_VUE,
  NUI_RAINBOW_ITERATIONS_DEFAULT,
  NUI_RAINBOW_LIGHTNESS_DEFAULT,
  NUI_RAINBOW_OFFSET_DEFAULT,
  NUI_RAINBOW_SATURATION_DEFAULT,
  NUI_RAINBOW_SPAN_DEFAULT,
  NUI_RAINBOW_TEXT_CLASS,
  NUI_RAINBOW_UNDERLINE_CLASS,
} from './constants.js';

/** Seamless return to Vue/Nuxt green after one branded lap. */
const NUI_RAINBOW_HUE_VUE_LAP = `calc(${NUI_RAINBOW_HUE_VUE} + 360deg)`;

export const NUI_RAINBOW_CSS = `@property --rainbow-hue {
  syntax: '<angle>';
  inherits: true;
  initial-value: ${NUI_RAINBOW_HUE_INITIAL};
}

@property --nui-rainbow-cycle {
  syntax: '<angle>';
  inherits: true;
  initial-value: ${NUI_RAINBOW_HUE_INITIAL};
}

/* Shell brands: Vue/Nuxt green → React/Next cyan → Astro purple → Svelte red. */
@keyframes ${NUI_RAINBOW_ANIMATION_BRANDED} {
  0%,
  12% {
    --nui-rainbow-cycle: ${NUI_RAINBOW_HUE_VUE};
  }

  25%,
  37% {
    --nui-rainbow-cycle: ${NUI_RAINBOW_HUE_REACT};
  }

  50%,
  62% {
    --nui-rainbow-cycle: ${NUI_RAINBOW_HUE_ASTRO};
  }

  75%,
  87% {
    --nui-rainbow-cycle: ${NUI_RAINBOW_HUE_SVELTE};
  }

  100% {
    --nui-rainbow-cycle: ${NUI_RAINBOW_HUE_VUE_LAP};
  }
}

@keyframes ${NUI_RAINBOW_ANIMATION_LINEAR} {
  from {
    --nui-rainbow-cycle: ${NUI_RAINBOW_HUE_INITIAL};
  }

  to {
    --nui-rainbow-cycle: calc(${NUI_RAINBOW_HUE_INITIAL} + 360deg);
  }
}

.nui-rainbow,
.nuc-rainbow,
nui-rainbow {
  --nui-rainbow-duration: ${NUI_RAINBOW_DURATION_DEFAULT};
  --nui-rainbow-easing: ${NUI_RAINBOW_EASING_DEFAULT};
  --nui-rainbow-iterations: ${NUI_RAINBOW_ITERATIONS_DEFAULT};
  --nui-rainbow-delay: ${NUI_RAINBOW_DELAY_DEFAULT};
  --nui-rainbow-direction: normal;
  --nui-rainbow-fill-mode: ${NUI_RAINBOW_FILL_MODE_DEFAULT};
  --nui-rainbow-play-state: running;
  --nui-rainbow-initial-hue: ${NUI_RAINBOW_HUE_INITIAL};
  --nui-rainbow-from: var(--nui-rainbow-initial-hue);
  --nui-rainbow-span: ${NUI_RAINBOW_SPAN_DEFAULT};
  --nui-rainbow-to: calc(var(--nui-rainbow-from) + var(--nui-rainbow-span));
  --nui-rainbow-offset: ${NUI_RAINBOW_OFFSET_DEFAULT};
  --nui-rainbow-saturation: ${NUI_RAINBOW_SATURATION_DEFAULT};
  --nui-rainbow-lightness: ${NUI_RAINBOW_LIGHTNESS_DEFAULT};
  --nui-rainbow-alpha: ${NUI_RAINBOW_ALPHA_DEFAULT};
  --nui-rainbow-cycle: var(--nui-rainbow-initial-hue);
  --nui-rainbow-anim-name: ${NUI_RAINBOW_ANIMATION_BRANDED};
  --rainbow-hue: calc(
    var(--nui-rainbow-from) +
      (var(--nui-rainbow-cycle) - ${NUI_RAINBOW_HUE_INITIAL}) *
      (var(--nui-rainbow-span) / 360deg) + var(--nui-rainbow-offset)
  );
  --nui-rainbow-complement-hue: calc(var(--rainbow-hue) + 180deg);
  --nui-rainbow-color: hsl(
    var(--rainbow-hue) var(--nui-rainbow-saturation) var(--nui-rainbow-lightness) /
      var(--nui-rainbow-alpha)
  );
  --nui-rainbow-color-soft: hsl(
    var(--rainbow-hue) calc(var(--nui-rainbow-saturation) * 0.55)
      calc(var(--nui-rainbow-lightness) + 12%) / var(--nui-rainbow-alpha)
  );
  --nui-rainbow-color-muted: hsl(
    var(--rainbow-hue) calc(var(--nui-rainbow-saturation) * 0.35)
      calc(var(--nui-rainbow-lightness) - 4%) / var(--nui-rainbow-alpha)
  );
  --nui-rainbow-complement: hsl(
    var(--nui-rainbow-complement-hue) var(--nui-rainbow-saturation)
      var(--nui-rainbow-lightness) / var(--nui-rainbow-alpha)
  );
  --nui-rainbow-oklch: oklch(
    calc(var(--nui-rainbow-lightness) * 0.01)
      calc(var(--nui-rainbow-saturation) * 0.003) var(--rainbow-hue) /
      var(--nui-rainbow-alpha)
  );
  --nui-rainbow-animation: var(--nui-rainbow-anim-name)
    var(--nui-rainbow-duration) var(--nui-rainbow-easing)
    var(--nui-rainbow-delay) var(--nui-rainbow-iterations)
    var(--nui-rainbow-direction) var(--nui-rainbow-fill-mode)
    var(--nui-rainbow-play-state);
  animation: var(--nui-rainbow-extra-animation, none), var(--nui-rainbow-animation);
}

.nui-rainbow[cycle='linear'],
.nuc-rainbow[cycle='linear'],
nui-rainbow[cycle='linear'] {
  --nui-rainbow-anim-name: ${NUI_RAINBOW_ANIMATION_LINEAR};
}

.nui-rainbow[paused],
.nui-rainbow.is-paused,
.nuc-rainbow[paused],
.nuc-rainbow.is-paused,
nui-rainbow[paused] {
  --nui-rainbow-play-state: paused;
}

@media (prefers-reduced-motion: reduce) {
  .nui-rainbow:not([reduced-motion='ignore']),
  .nuc-rainbow:not([reduced-motion='ignore']),
  nui-rainbow:not([reduced-motion='ignore']) {
    animation: none;
    --nui-rainbow-cycle: var(--nui-rainbow-initial-hue);
    --rainbow-hue: calc(var(--nui-rainbow-from) + var(--nui-rainbow-offset));
  }
}

.${NUI_RAINBOW_TEXT_CLASS},
.nuc-rainbow-text {
  color: transparent;
  background-image: linear-gradient(
    90deg,
    hsl(
      var(--rainbow-hue) var(--nui-rainbow-saturation)
        var(--nui-rainbow-lightness) / var(--nui-rainbow-alpha)
    ),
    hsl(
      calc(var(--rainbow-hue) + 90deg) var(--nui-rainbow-saturation)
        var(--nui-rainbow-lightness) / var(--nui-rainbow-alpha)
    ),
    hsl(
      calc(var(--rainbow-hue) + 180deg) var(--nui-rainbow-saturation)
        var(--nui-rainbow-lightness) / var(--nui-rainbow-alpha)
    ),
    hsl(
      calc(var(--rainbow-hue) + 270deg) var(--nui-rainbow-saturation)
        var(--nui-rainbow-lightness) / var(--nui-rainbow-alpha)
    ),
    hsl(
      calc(var(--rainbow-hue) + 360deg) var(--nui-rainbow-saturation)
        var(--nui-rainbow-lightness) / var(--nui-rainbow-alpha)
    )
  );
  -webkit-background-clip: text;
  background-clip: text;
}

.${NUI_RAINBOW_BORDER_CLASS},
.nuc-rainbow-border {
  border-width: var(--nui-rainbow-border-width, 2px);
  border-style: var(--nui-rainbow-border-style, solid);
  border-color: var(--nui-rainbow-color);
}

.${NUI_RAINBOW_UNDERLINE_CLASS},
.nuc-rainbow-underline {
  text-decoration-line: underline;
  text-decoration-color: var(--nui-rainbow-color);
  text-decoration-thickness: var(--nui-rainbow-underline-thickness, 0.12em);
  text-underline-offset: var(--nui-rainbow-underline-offset, 0.18em);
}
`;
